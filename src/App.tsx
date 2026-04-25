import {
  Activity,
  ArrowUp,
  Bot,
  Check,
  CircleAlert,
  CirclePause,
  KeyRound,
  MonitorCog,
  MousePointer2,
  PanelRight,
  ShieldCheck,
  Square,
  UserRound,
  Zap
} from "lucide-react";
import { FormEvent, useMemo, useState } from "react";

type Message = {
  id: number;
  author: "user" | "agent";
  text: string;
};

type TimelineItem = {
  id: number;
  label: string;
  detail: string;
  state: "done" | "active" | "waiting";
};

type PermissionStatus = {
  id: string;
  label: string;
  status: "ready" | "review" | "blocked";
};

const initialMessages: Message[] = [
  {
    id: 1,
    author: "agent",
    text: "Tell me what you want to do on this computer. I will show the plan before any meaningful desktop action."
  }
];

const baseTimeline: TimelineItem[] = [
  {
    id: 1,
    label: "Ready for a text command",
    detail: "Text input is active for the first validation pass.",
    state: "done"
  },
  {
    id: 2,
    label: "Waiting for user intent",
    detail: "No desktop action will run until a command is submitted.",
    state: "active"
  }
];

const permissions: PermissionStatus[] = [
  { id: "accessibility", label: "Accessibility control", status: "ready" },
  { id: "keyboard", label: "Keyboard simulation", status: "ready" },
  { id: "screen", label: "Screen context", status: "review" },
  { id: "windows", label: "Window inspection", status: "review" }
];

const exampleCommands = [
  "Open Notepad and start a grocery list",
  "Find my latest downloaded PDF",
  "Make the current window easier to read"
];

function App() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [timeline, setTimeline] = useState<TimelineItem[]>(baseTimeline);
  const [command, setCommand] = useState("");
  const [isWorking, setIsWorking] = useState(false);
  const [statusText, setStatusText] = useState("Text mode active");
  const [eventLog, setEventLog] = useState([
    "Windows permission check prepared",
    "Mock provider layer ready",
    "No automation running"
  ]);

  const currentPlan = useMemo(() => {
    if (!isWorking && messages.length === 1) {
      return [
        "Listen for a text command",
        "Summarize intent",
        "Ask before risky actions"
      ];
    }

    return [
      "Interpret the submitted command",
      "Choose OS automation before vision",
      "Request confirmation for meaningful risk"
    ];
  }, [isWorking, messages.length]);

  const submitCommand = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = command.trim();

    if (!trimmed || isWorking) {
      return;
    }

    setCommand("");
    setIsWorking(true);
    setStatusText("Interpreting command");
    setMessages((current) => [
      ...current,
      { id: Date.now(), author: "user", text: trimmed }
    ]);
    setTimeline([
      {
        id: 1,
        label: "Command received",
        detail: trimmed,
        state: "done"
      },
      {
        id: 2,
        label: "Interpreting intent",
        detail: "Mapping the request to safe desktop actions.",
        state: "active"
      },
      {
        id: 3,
        label: "Confirmation required",
        detail: "The first pass shows the safety UX before real automation is wired.",
        state: "waiting"
      }
    ]);
    setEventLog((current) => [
      `Command queued: ${trimmed}`,
      "Mock agent started planning",
      ...current.slice(0, 3)
    ]);

    await window.fluent?.agent.sendCommand(trimmed);

    window.setTimeout(() => {
      setMessages((current) => [
        ...current,
        {
          id: Date.now() + 1,
          author: "agent",
          text: "I can help with that. For this first build, I am showing the proposed desktop plan and confirmation flow without running real automation yet."
        }
      ]);
      setTimeline((current) =>
        current.map((item) => (item.id === 2 ? { ...item, state: "done" } : item))
      );
      setStatusText("Waiting for confirmation");
      setIsWorking(false);
    }, 900);
  };

  const stopAgent = async () => {
    await window.fluent?.agent.stop();
    setIsWorking(false);
    setStatusText("Stopped by user");
    setTimeline((current) => [
      ...current,
      {
        id: Date.now(),
        label: "Stopped",
        detail: "The visible stop control interrupted the mocked agent flow.",
        state: "done"
      }
    ]);
    setEventLog((current) => ["Agent stopped by user", ...current.slice(0, 4)]);
  };

  return (
    <main className="app-shell">
      <aside className="sidebar" aria-label="Fluent status">
        <div className="brand-block">
          <div className="brand-mark" aria-hidden="true">
            F
          </div>
          <div>
            <p className="eyebrow">Desktop AI agent</p>
            <h1>Fluent</h1>
          </div>
        </div>

        <nav className="mode-list" aria-label="Input modes">
          <button className="mode-button active" type="button">
            <KeyRound size={20} aria-hidden="true" />
            Text control
          </button>
          <button className="mode-button" type="button" disabled>
            <Bot size={20} aria-hidden="true" />
            Voice later
          </button>
          <button className="mode-button" type="button" disabled>
            <MousePointer2 size={20} aria-hidden="true" />
            Switch later
          </button>
        </nav>

        <section className="status-section" aria-labelledby="provider-heading">
          <h2 id="provider-heading">AI Provider</h2>
          <div className="status-pill">
            <Zap size={18} aria-hidden="true" />
            Bring your own key
          </div>
          <p>
            Provider access is mocked for this pass. The UI is ready for local key setup
            and provider selection later.
          </p>
        </section>

        <section className="status-section" aria-labelledby="permission-heading">
          <h2 id="permission-heading">Windows Access</h2>
          <ul className="permission-list">
            {permissions.map((permission) => (
              <li key={permission.id}>
                {permission.status === "ready" ? (
                  <Check size={18} aria-hidden="true" />
                ) : (
                  <CircleAlert size={18} aria-hidden="true" />
                )}
                <span>{permission.label}</span>
                <strong>{permission.status}</strong>
              </li>
            ))}
          </ul>
        </section>
      </aside>

      <section className="workspace" aria-label="Agent workspace">
        <header className="workspace-header">
          <div>
            <p className="eyebrow">Current session</p>
            <h2>Agent workspace</h2>
          </div>
          <div className="session-status" role="status">
            <Activity size={18} aria-hidden="true" />
            {statusText}
          </div>
        </header>

        <section className="task-strip" aria-label="Active task">
          <div>
            <p className="eyebrow">Active task</p>
            <h3>{messages.length > 1 ? "Plan desktop assistance" : "Await command"}</h3>
          </div>
          <button className="icon-button pause" type="button" aria-label="Pause agent">
            <CirclePause size={22} aria-hidden="true" />
          </button>
          <button
            className="icon-button stop"
            type="button"
            onClick={stopAgent}
            aria-label="Stop agent"
          >
            <Square size={20} aria-hidden="true" />
          </button>
        </section>

        <div className="content-grid">
          <section className="conversation" aria-label="Conversation">
            {messages.map((message) => (
              <article className={`message ${message.author}`} key={message.id}>
                <div className="avatar" aria-hidden="true">
                  {message.author === "agent" ? (
                    <Bot size={20} />
                  ) : (
                    <UserRound size={20} />
                  )}
                </div>
                <p>{message.text}</p>
              </article>
            ))}
          </section>

          <section className="timeline" aria-label="Agent action timeline">
            <div className="section-heading">
              <h3>Action timeline</h3>
              <span>Mocked</span>
            </div>
            {timeline.map((item) => (
              <article className={`timeline-item ${item.state}`} key={item.id}>
                <span className="timeline-dot" aria-hidden="true" />
                <div>
                  <h4>{item.label}</h4>
                  <p>{item.detail}</p>
                </div>
              </article>
            ))}
          </section>
        </div>

        <section className="confirmation" aria-label="Confirmation prompt">
          <div>
            <p className="eyebrow">Safety check</p>
            <h3>Confirm before desktop control</h3>
            <p>
              When real automation is connected, Fluent will ask before actions that
              change files, send messages, purchase items, or affect privacy.
            </p>
          </div>
          <button className="primary-action" type="button">
            <ShieldCheck size={20} aria-hidden="true" />
            Confirm plan
          </button>
        </section>

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
              <ArrowUp size={22} aria-hidden="true" />
            </button>
          </div>
          <div className="examples" aria-label="Example commands">
            {exampleCommands.map((example) => (
              <button key={example} type="button" onClick={() => setCommand(example)}>
                {example}
              </button>
            ))}
          </div>
        </form>
      </section>

      <aside className="inspector" aria-label="Session inspector">
        <div className="inspector-heading">
          <PanelRight size={22} aria-hidden="true" />
          <h2>Inspector</h2>
        </div>

        <section>
          <h3>Current plan</h3>
          <ol className="plan-list">
            {currentPlan.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </section>

        <section>
          <h3>Target context</h3>
          <div className="target-box">
            <MonitorCog size={22} aria-hidden="true" />
            <div>
              <strong>Windows desktop</strong>
              <span>No app selected yet</span>
            </div>
          </div>
        </section>

        <section>
          <h3>Recent events</h3>
          <ul className="event-list">
            {eventLog.map((event) => (
              <li key={event}>{event}</li>
            ))}
          </ul>
        </section>
      </aside>
    </main>
  );
}

export default App;
