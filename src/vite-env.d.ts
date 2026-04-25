/// <reference types="vite/client" />

type FluentPermissionStatus = {
  id: string;
  label: string;
  status: "ready" | "review" | "blocked";
};

interface Window {
  fluent?: {
    agent: {
      sendCommand: (command: string) => Promise<{
        id: string;
        command: string;
        status: string;
      }>;
      stop: () => Promise<{
        stopped: boolean;
        at: string;
      }>;
    };
    system: {
      getPermissionStatus: () => Promise<FluentPermissionStatus[]>;
    };
  };
}
