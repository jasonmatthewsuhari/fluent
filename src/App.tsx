import {
  ArrowUp,
  Bot,
  Check,
  CircleAlert,
  Eye,
  Gauge,
  KeyRound,
  Keyboard,
  LayoutDashboard,
  LockKeyhole,
  MousePointer2,
  Pause,
  Play,
  RotateCcw,
  Settings,
  ShieldAlert,
  ShieldCheck,
  Square,
  UserRound,
  Volume2,
  Zap,
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";

type View = "workspace" | "provider" | "permissions" | "settings";

type Message = {
  id: number;
  author: "user" | "agent" | "system";
  text: string;
};

type TimelineItem = {
  id: number;
  label: string;
  detail: string;
  state: "done" | "active" | "waiting" | "blocked";
};

type AccessPermission = {
  id: string;
  label: string;
  status: "ready" | "review" | "blocked";
};

type ProviderDraft = {
  provider: "OpenAI" | "Anthropic" | "Local";
  model: string;
  key: string;
};

type SafetyLevel = "balanced" | "strict";

const initialMessages: Message[] = [
  {
    id: 1,
    author: "agent",
    text: "Tell me what you want to do on this computer. I will show the plan before any meaningful desktop action.",
  },
];

const initialTimeline: TimelineItem[] = [
  {
    id: 1,
    label: "Text command ready",
    detail: "First-pass control is focused on typed intent.",
    state: "done",
  },
  {
    id: 2,
    label: "Waiting for user intent",
    detail: "No automation will run until a command is submitted.",
    state: "active",
  },
];

const fallbackPermissions: AccessPermission[] = [
  { id: "accessibility", label: "Accessibility control", status: "ready" },
  { id: "keyboard", label: "Keyboard simulation", status: "ready" },
  { id: "screen", label: "Screen context", status: "review" },
  { id: "apps", label: "App and window inspection", status: "review" },
];

const exampleCommands = [
  "Open Notepad and start a grocery list",
  "Find my latest downloaded PDF",
  "Make the current window easier to read",
];

const highRiskWords = [
  "delete",
  "send",
  "email",
  "purchase",
  "buy",
  "pay",
  "upload",
  "share",
  "install",
];

function getRisk(command: string) {
  const normalized = command.toLowerCase();
  return highRiskWords.some((word) => normalized.includes(word))
    ? "Needs confirmation"
    : "Low risk draft";
}

function buildPlan(command: string) {
  const normalized = command.toLowerCase();

  if (normalized.includes("notepad") || normalized.includes("list")) {
    return [
      "Open the requested writing app",
      "Create the list content",
      "Stop before saving or sending anything",
    ];
  }

  if (normalized.includes("download") || normalized.includes("pdf")) {
    return [
      "Inspect the Downloads folder",
      "Sort likely files by recency",
      "Ask before opening private documents",
    ];
  }

  if (normalized.includes("read") || normalized.includes("easier")) {
    return [
      "Identify the active window",
      "Increase readability with reversible settings",
      "Report what changed",
    ];
  }

  return [
    "Understand the requested task",
    "Choose structured OS automation first",
    "Ask before any high-impact action",
  ];
}

function statusLabel(status: AccessPermission["status"]) {
  if (status === "ready") {
    return "Ready";
  }

  if (status === "blocked") {
    return "Blocked";
  }

  return "Review";
}

function App() {
  const [activeView, setActiveView] = useState<View>("workspace");
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [timeline, setTimeline] = useState<TimelineItem[]>(initialTimeline);
  const [permissions, setPermissions] =
    useState<AccessPermission[]>(fallbackPermissions);
  const [command, setCommand] = useState("");
  const [isWorking, setIsWorking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [statusText, setStatusText] = useState("Text mode active");
  const [riskText, setRiskText] = useState("No active request");
  const [eventLog, setEventLog] = useState([
    "Windows permission check prepared",
    "Mock provider layer ready",
    "No automation running",
  ]);
  const [proposedPlan, setProposedPlan] = useState([
    "Listen for a text command",
    "Summarize intent",
    "Ask before risky actions",
  ]);
  const [providerDraft, setProviderDraft] = useState<ProviderDraft>({
    provider: "OpenAI",
    model: "gpt-4.1-mini",
    key: "",
  });
  const [savedProvider, setSavedProvider] = useState("Provider not connected");
  const [safetyLevel, setSafetyLevel] = useState<SafetyLevel>("balanced");
  const [largeText, setLargeText] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    window.fluent?.system
      .getPermissionStatus()
      .then(setPermissions)
      .catch(() => {
        setPermissions(fallbackPermissions);
      });
  }, []);

  const readyPermissionCount = useMemo(
    () =>
      permissions.filter((permission) => permission.status === "ready").length,
    [permissions],
  );

  const activeTask =
    messages.length > 1 ? "Plan desktop assistance" : "Await command";
  const visibleMessages = useMemo(() => messages.slice(-4), [messages]);
  const visibleTimeline = useMemo(() => timeline.slice(-3), [timeline]);

  const submitCommand = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = command.trim();

    if (!trimmed || isWorking) {
      return;
    }

    const plan = buildPlan(trimmed);
    const risk = getRisk(trimmed);

    setActiveView("workspace");
    setCommand("");
    setIsPaused(false);
    setIsWorking(true);
    setStatusText("Interpreting command");
    setRiskText(risk);
    setProposedPlan(plan);
    setMessages((current) => [
      ...current,
      { id: Date.now(), author: "user", text: trimmed },
    ]);
    setTimeline([
      {
        id: 1,
        label: "Command received",
        detail: trimmed,
        state: "done",
      },
      {
        id: 2,
        label: "Intent interpretation",
        detail: "Mapping the request to safe desktop actions.",
        state: "active",
      },
      {
        id: 3,
        label: "Plan review",
        detail:
          "A confirmation step is shown before real automation is connected.",
        state: "waiting",
      },
    ]);
    setEventLog((current) => [
      `Command queued: ${trimmed}`,
      "Mock agent started planning",
      ...current.slice(0, 4),
    ]);

    await window.fluent?.agent.sendCommand(trimmed);

    window.setTimeout(() => {
      setMessages((current) => [
        ...current,
        {
          id: Date.now() + 1,
          author: "agent",
          text: `I understand the request. Proposed plan: ${plan.join("; ")}.`,
        },
      ]);
      setTimeline((current) =>
        current.map((item) =>
          item.id === 2 ? { ...item, state: "done" } : item,
        ),
      );
      setStatusText("Waiting for confirmation");
      setIsWorking(false);
    }, 700);
  };

  const confirmPlan = () => {
    setStatusText("Mock execution complete");
    setRiskText("Confirmed plan");
    setTimeline((current) =>
      current.map((item) =>
        item.id === 3
          ? {
              ...item,
              label: "Plan confirmed",
              detail:
                "The app records the decision. Real OS automation is still pending SDK wiring.",
              state: "done",
            }
          : item,
      ),
    );
    setMessages((current) => [
      ...current,
      {
        id: Date.now(),
        author: "system",
        text: "Plan confirmed. This build stops at the observable mock execution boundary.",
      },
    ]);
    setEventLog((current) => [
      "User confirmed proposed plan",
      "Mock execution boundary reached",
      ...current.slice(0, 4),
    ]);
  };

  const stopAgent = async () => {
    await window.fluent?.agent.stop();
    setIsWorking(false);
    setIsPaused(false);
    setStatusText("Stopped by user");
    setTimeline((current) => [
      ...current,
      {
        id: Date.now(),
        label: "Stopped",
        detail: "The visible stop control interrupted the current flow.",
        state: "blocked",
      },
    ]);
    setEventLog((current) => ["Agent stopped by user", ...current.slice(0, 5)]);
  };

  const togglePause = () => {
    const nextPaused = !isPaused;
    setIsPaused(nextPaused);
    setStatusText(nextPaused ? "Paused" : "Text mode active");
    setEventLog((current) => [
      nextPaused ? "Agent paused by user" : "Agent resumed by user",
      ...current.slice(0, 5),
    ]);
  };

  const retryPermissions = () => {
    setPermissions((current) =>
      current.map((permission) =>
        permission.status === "review"
          ? { ...permission, status: "ready" }
          : permission,
      ),
    );
    setEventLog((current) => [
      "Permission check refreshed",
      "Review items marked ready in mock state",
      ...current.slice(0, 4),
    ]);
  };

  const saveProvider = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSavedProvider(
      `${providerDraft.provider} configured for ${providerDraft.model}`,
    );
    setEventLog((current) => [
      `${providerDraft.provider} provider settings saved locally`,
      ...current.slice(0, 5),
    ]);
  };

  return (
    <main
      className={`app-shell ${largeText ? "large-text" : ""} ${
        reducedMotion ? "reduced-motion" : ""
      }`}
    >
      <aside className="sidebar" aria-label="Fluent navigation">
        <div className="brand-block">
          <div className="brand-mark" aria-hidden="true">
            F
          </div>
          <div>
            <p className="eyebrow">Desktop AI agent</p>
            <h1>Fluent</h1>
          </div>
        </div>

        <nav className="nav-list" aria-label="Primary">
          <button
            className={activeView === "workspace" ? "active" : ""}
            type="button"
            onClick={() => setActiveView("workspace")}
          >
            <LayoutDashboard size={22} aria-hidden="true" />
            Workspace
          </button>
          <button
            className={activeView === "provider" ? "active" : ""}
            type="button"
            onClick={() => setActiveView("provider")}
          >
            <KeyRound size={22} aria-hidden="true" />
            AI provider
          </button>
          <button
            className={activeView === "permissions" ? "active" : ""}
            type="button"
            onClick={() => setActiveView("permissions")}
          >
            <ShieldCheck size={22} aria-hidden="true" />
            Permissions
          </button>
          <button
            className={activeView === "settings" ? "active" : ""}
            type="button"
            onClick={() => setActiveView("settings")}
          >
            <Settings size={22} aria-hidden="true" />
            Settings
          </button>
        </nav>

        <section className="side-section" aria-labelledby="mode-heading">
          <h2 id="mode-heading">Input mode</h2>
          <div className="mode-stack">
            <div className="mode-item active">
              <Keyboard size={20} aria-hidden="true" />
              <span>Text control</span>
              <strong>Now</strong>
            </div>
            <div className="mode-item muted">
              <Volume2 size={20} aria-hidden="true" />
              <span>Voice</span>
              <strong>Later</strong>
            </div>
            <div className="mode-item muted">
              <MousePointer2 size={20} aria-hidden="true" />
              <span>Switch</span>
              <strong>Later</strong>
            </div>
          </div>
        </section>

        <section className="side-section" aria-labelledby="safety-heading">
          <h2 id="safety-heading">Safety</h2>
          <div className="state-badge">
            <ShieldAlert size={18} aria-hidden="true" />
            {riskText}
          </div>
        </section>
      </aside>

      <section className="workspace" aria-label="Agent workspace">
        <header className="workspace-header">
          <div>
            <p className="eyebrow">Current session</p>
            <h2>
              {activeView === "workspace"
                ? "Agent workspace"
                : "Control center"}
            </h2>
          </div>
          <div className="session-status" role="status">
            <ShieldCheck size={18} aria-hidden="true" />
            {statusText}
          </div>
        </header>

        {activeView === "workspace" && (
          <>
            <section className="task-strip" aria-label="Active task">
              <div>
                <p className="eyebrow">Active task</p>
                <h3>{activeTask}</h3>
              </div>
              <div className="task-actions">
                <button
                  className="icon-button"
                  type="button"
                  onClick={togglePause}
                  aria-label={isPaused ? "Resume agent" : "Pause agent"}
                >
                  {isPaused ? (
                    <Play size={22} aria-hidden="true" />
                  ) : (
                    <Pause size={22} aria-hidden="true" />
                  )}
                </button>
                <button
                  className="icon-button stop"
                  type="button"
                  onClick={stopAgent}
                  aria-label="Stop agent"
                >
                  <Square size={20} aria-hidden="true" />
                </button>
              </div>
            </section>

            <div className="content-grid">
              <section
                className="conversation"
                aria-label="Conversation"
                aria-live="polite"
              >
                {visibleMessages.map((message) => (
                  <article
                    className={`message ${message.author}`}
                    key={message.id}
                  >
                    <div className="avatar" aria-hidden="true">
                      {message.author === "user" ? (
                        <UserRound size={20} />
                      ) : message.author === "system" ? (
                        <ShieldCheck size={20} />
                      ) : (
                        <Bot size={20} />
                      )}
                    </div>
                    <p>{message.text}</p>
                  </article>
                ))}
              </section>

              <section className="timeline" aria-label="Agent action timeline">
                <div className="section-heading">
                  <h3>Action timeline</h3>
                </div>
                {visibleTimeline.map((item) => (
                  <article
                    className={`timeline-item ${item.state}`}
                    key={item.id}
                  >
                    <span className="timeline-dot" aria-hidden="true" />
                    <div>
                      <h4>{item.label}</h4>
                      <p>{item.detail}</p>
                    </div>
                  </article>
                ))}
              </section>
            </div>

            <section className="confirmation" aria-label="Plan confirmation">
              <div>
                <p className="eyebrow">Safety check</p>
                <h3>Confirm before desktop control</h3>
                <ol className="plan-list">
                  {proposedPlan.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ol>
              </div>
              <div className="event-summary" aria-label="Recent events">
                <ul className="event-list">
                  {eventLog.slice(0, 3).map((event) => (
                    <li key={event}>{event}</li>
                  ))}
                </ul>
                <button
                  className="primary-action"
                  type="button"
                  onClick={confirmPlan}
                >
                  <ShieldCheck size={20} aria-hidden="true" />
                  Confirm plan
                </button>
              </div>
            </section>
          </>
        )}

        {activeView === "provider" && (
          <section className="panel-view" aria-labelledby="provider-title">
            <div className="panel-copy">
              <p className="eyebrow">Bring your own key</p>
              <h2 id="provider-title">AI provider setup</h2>
              <p>
                Fluent is open source. Provider credentials should stay under
                local user control and must not appear in logs or agent events.
              </p>
              <div className="quiet-status">
                <LockKeyhole size={20} aria-hidden="true" />
                <span>{savedProvider}</span>
              </div>
            </div>

            <form className="settings-form" onSubmit={saveProvider}>
              <label>
                Provider
                <select
                  value={providerDraft.provider}
                  onChange={(event) =>
                    setProviderDraft((current) => ({
                      ...current,
                      provider: event.target.value as ProviderDraft["provider"],
                    }))
                  }
                >
                  <option>OpenAI</option>
                  <option>Anthropic</option>
                  <option>Local</option>
                </select>
              </label>
              <label>
                Model
                <input
                  type="text"
                  value={providerDraft.model}
                  onChange={(event) =>
                    setProviderDraft((current) => ({
                      ...current,
                      model: event.target.value,
                    }))
                  }
                />
              </label>
              <label>
                API key
                <input
                  type="password"
                  value={providerDraft.key}
                  onChange={(event) =>
                    setProviderDraft((current) => ({
                      ...current,
                      key: event.target.value,
                    }))
                  }
                  placeholder="Stored locally in a later SDK pass"
                />
              </label>
              <div className="form-actions">
                <button className="primary-action" type="submit">
                  <LockKeyhole size={20} aria-hidden="true" />
                  Save provider
                </button>
                <button className="secondary-action" type="button">
                  <Zap size={20} aria-hidden="true" />
                  Test connection
                </button>
              </div>
            </form>
          </section>
        )}

        {activeView === "permissions" && (
          <section className="panel-view" aria-labelledby="permissions-title">
            <div className="panel-copy">
              <p className="eyebrow">Automation boundary</p>
              <h2 id="permissions-title">Windows access</h2>
              <p>
                Fluent should prefer structured OS automation, then use screen
                context only when direct automation is insufficient.
              </p>
              <div className="quiet-status">
                <ShieldCheck size={20} aria-hidden="true" />
                <span>
                  {readyPermissionCount} of {permissions.length} checks ready
                </span>
              </div>
            </div>

            <div className="permission-grid">
              {permissions.map((permission) => (
                <article
                  className={`permission-card ${permission.status}`}
                  key={permission.id}
                >
                  {permission.status === "ready" ? (
                    <Check size={24} aria-hidden="true" />
                  ) : (
                    <CircleAlert size={24} aria-hidden="true" />
                  )}
                  <div>
                    <h3>{permission.label}</h3>
                    <p>{statusLabel(permission.status)}</p>
                  </div>
                </article>
              ))}
            </div>

            <button
              className="primary-action"
              type="button"
              onClick={retryPermissions}
            >
              <RotateCcw size={20} aria-hidden="true" />
              Recheck permissions
            </button>
          </section>
        )}

        {activeView === "settings" && (
          <section className="panel-view" aria-labelledby="settings-title">
            <div className="panel-copy">
              <p className="eyebrow">Accessible defaults</p>
              <h2 id="settings-title">Settings</h2>
              <p>
                These controls model the SDK state the UI will pass back to the
                agent loop as the core implementation matures.
              </p>
            </div>

            <div className="settings-stack">
              <label className="toggle-row">
                <input
                  type="checkbox"
                  checked={largeText}
                  onChange={(event) => setLargeText(event.target.checked)}
                />
                <span>
                  <Eye size={22} aria-hidden="true" />
                  Larger interface text
                </span>
              </label>
              <label className="toggle-row">
                <input
                  type="checkbox"
                  checked={reducedMotion}
                  onChange={(event) => setReducedMotion(event.target.checked)}
                />
                <span>
                  <Gauge size={22} aria-hidden="true" />
                  Reduced motion
                </span>
              </label>
              <div
                className="segmented-control"
                aria-label="Confirmation strictness"
              >
                <button
                  className={safetyLevel === "balanced" ? "active" : ""}
                  type="button"
                  onClick={() => setSafetyLevel("balanced")}
                >
                  Balanced
                </button>
                <button
                  className={safetyLevel === "strict" ? "active" : ""}
                  type="button"
                  onClick={() => setSafetyLevel("strict")}
                >
                  Strict
                </button>
              </div>
            </div>
          </section>
        )}

        <form className="command-bar" onSubmit={submitCommand}>
          <label htmlFor="command-input">Text command</label>
          <div className="command-row">
            <input
              id="command-input"
              type="text"
              value={command}
              onChange={(event) => setCommand(event.target.value)}
              placeholder="Tell Fluent what to do..."
              autoComplete="off"
            />
            <button
              className="send-button"
              type="submit"
              disabled={isWorking || !command.trim()}
              aria-label="Send command"
            >
              <ArrowUp size={24} aria-hidden="true" />
            </button>
          </div>
          <div className="examples" aria-label="Example commands">
            {exampleCommands.map((example) => (
              <button
                key={example}
                type="button"
                onClick={() => setCommand(example)}
              >
                {example}
              </button>
            ))}
          </div>
        </form>
      </section>
    </main>
  );
}

export default App;
