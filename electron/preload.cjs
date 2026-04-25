const { contextBridge } = require("electron");
const { randomUUID } = require("node:crypto");

const mockPermissionStatus = [
  { id: "accessibility", label: "Accessibility control", status: "ready" },
  { id: "keyboard", label: "Keyboard simulation", status: "ready" },
  { id: "screen", label: "Screen context", status: "review" },
  { id: "apps", label: "App and window inspection", status: "review" }
];

contextBridge.exposeInMainWorld("fluent", {
  agent: {
    sendCommand: async (command) => ({
      id: randomUUID(),
      command,
      status: "mocked"
    }),
    stop: async () => ({
      stopped: true,
      at: new Date().toISOString()
    })
  },
  system: {
    getPermissionStatus: async () => mockPermissionStatus
  }
});
