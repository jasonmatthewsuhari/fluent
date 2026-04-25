import { AutomationAdapter, CapabilityRegistry, createCapabilityRegistry } from "./automation/index.js";
import { AsyncEventQueue } from "./event-queue.js";
import { createId } from "./ids.js";
import { AIProvider } from "./provider.js";
import { DefaultSafetyPolicy, SafetyPolicy } from "./safety.js";
import {
  AutomationAction,
  ComputerUseEvent,
  ConfirmationDecision,
  StartTaskOptions
} from "./types.js";

export type ComputerUseAgentOptions = {
  provider: AIProvider;
  registry?: CapabilityRegistry;
  adapters?: AutomationAdapter[];
  safetyPolicy?: SafetyPolicy;
};

export type ComputerUseTask = {
  readonly id: string;
  readonly events: AsyncIterable<ComputerUseEvent>;
  confirmAction(actionId: string): void;
  rejectAction(actionId: string): void;
  stop(reason?: string): void;
  pause(): void;
  resume(): void;
};

export type ComputerUseAgent = {
  startTask(options: StartTaskOptions): ComputerUseTask;
};

type ConfirmationRecord = {
  decision: ConfirmationDecision;
  resolve: (decision: Exclude<ConfirmationDecision, "pending">) => void;
};

export function createAgent(options: ComputerUseAgentOptions): ComputerUseAgent {
  const registry = options.registry ?? createCapabilityRegistry(options.adapters);
  const safetyPolicy = options.safetyPolicy ?? new DefaultSafetyPolicy();

  return {
    startTask(startOptions: StartTaskOptions) {
      const taskId = createId("task");
      const events = new AsyncEventQueue<ComputerUseEvent>();
      const confirmations = new Map<string, ConfirmationRecord>();
      let stopped = false;
      let paused = false;

      const task: ComputerUseTask = {
        id: taskId,
        events,

        confirmAction(actionId) {
          settleConfirmation(confirmations, actionId, "approved");
        },

        rejectAction(actionId) {
          settleConfirmation(confirmations, actionId, "rejected");
        },

        stop(reason = "Task stopped by caller.") {
          stopped = true;
          events.push({
            type: "task.blocked",
            taskId,
            reason
          });
          events.close();
        },

        pause() {
          paused = true;
        },

        resume() {
          paused = false;
        }
      };

      void runTask({
        taskId,
        options: startOptions,
        events,
        confirmations,
        isStopped: () => stopped,
        waitUntilResumed: async () => {
          while (paused && !stopped) {
            await delay(25);
          }
        },
        provider: options.provider,
        registry,
        safetyPolicy
      });

      return task;
    }
  };
}

async function runTask(options: {
  taskId: string;
  options: StartTaskOptions;
  events: AsyncEventQueue<ComputerUseEvent>;
  confirmations: Map<string, ConfirmationRecord>;
  isStopped: () => boolean;
  waitUntilResumed: () => Promise<void>;
  provider: AIProvider;
  registry: CapabilityRegistry;
  safetyPolicy: SafetyPolicy;
}) {
  const {
    taskId,
    events,
    confirmations,
    isStopped,
    waitUntilResumed,
    provider,
    registry,
    safetyPolicy
  } = options;

  try {
    events.push({
      type: "task.started",
      taskId,
      input: options.options.input
    });

    const plan = await provider.createPlan(options.options);
    let completedActions = 0;

    events.push({
      type: "plan.created",
      taskId,
      plan
    });

    for (const action of plan.actions) {
      if (isStopped()) {
        return;
      }

      await waitUntilResumed();

      events.push({
        type: "action.proposed",
        taskId,
        action
      });

      const decision = safetyPolicy.evaluate(action);

      if (decision.status === "confirm") {
        events.push({
          type: "confirmation.required",
          taskId,
          action,
          reason: decision.reason
        });

        const confirmation = await waitForConfirmation(confirmations, action);

        if (confirmation === "rejected") {
          events.push({
            type: "task.blocked",
            taskId,
            reason: "Action rejected by caller.",
            action
          });
          events.close();
          return;
        }
      }

      if (isStopped()) {
        return;
      }

      events.push({
        type: "action.started",
        taskId,
        action
      });

      const result = await registry.execute(action, options.options.context?.platform);

      events.push({
        type: "action.completed",
        taskId,
        action,
        result
      });

      if (!result.ok) {
        events.push({
          type: "task.failed",
          taskId,
          error: result.error ?? `Action ${action.capability} failed.`
        });
        events.close();
        return;
      }

      completedActions += 1;
    }

    events.push({
      type: "task.completed",
      taskId,
      result: {
        planId: plan.id,
        completedActions
      }
    });
  } catch (error) {
    events.push({
      type: "task.failed",
      taskId,
      error: error instanceof Error ? error.message : String(error)
    });
  } finally {
    events.close();
  }
}

function waitForConfirmation(
  confirmations: Map<string, ConfirmationRecord>,
  action: AutomationAction
): Promise<Exclude<ConfirmationDecision, "pending">> {
  return new Promise((resolve) => {
    confirmations.set(action.id, {
      decision: "pending",
      resolve
    });
  });
}

function settleConfirmation(
  confirmations: Map<string, ConfirmationRecord>,
  actionId: string,
  decision: Exclude<ConfirmationDecision, "pending">
) {
  const confirmation = confirmations.get(actionId);

  if (!confirmation || confirmation.decision !== "pending") {
    return;
  }

  confirmation.decision = decision;
  confirmation.resolve(decision);
  confirmations.delete(actionId);
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
