/**
 * Antigravity Device Manager
 * Universal hardware management with Roccat Kain 120/200 AIMO & gaming presets.
 */

export const BASE_PRESET_DEVICES = [
  {
    id: "mouse-roccat-kain",
    name: "ROCCAT Kain 120 / 200 AIMO",
    type: "mouse",
    icon: "🖱️",
    isDetected: false,
    source: "Roccat Titan Suite",
    capabilities: ["mouse", "rgb"],
    config: {
      dpi: 800,
      dpiStages: [400, 800, 1200, 1600, 3200, 16000],
      activeStage: 1,
      pollingRate: 1000,
      liftOffDistance: 1.0,
      debounceTime: 0, // Zero Debounce / Drag Click Mode (0ms - 10ms)
      angleSnapping: false,
      titanClickTuning: true,
      keybinds: {
        "Titan Click Links": "Left Click",
        "Titan Click Rechts": "Right Click",
        "Titan Wheel Scroll": "Middle Click",
        "Easy-Shift / Daumen 1": "Browser Back",
        "Daumen 2": "Browser Forward",
        "DPI Taste": "Cycle DPI"
      },
      macros: [
        { name: "Butterfly Click", keys: ["Click Left", "Delay 10ms", "Click Left"] }
      ],
      rgb: {
        effect: "wave",
        color: "#00e5ff", // Roccat Cyan / AIMO
        brightness: 100,
        speed: 60,
        syncEnabled: true
      }
    }
  },
  {
    id: "kb-vulcan-pro",
    name: "ROCCAT Vulcan Pro TKL",
    type: "keyboard",
    icon: "⌨️",
    isDetected: false,
    source: "Titan Optical Suite",
    capabilities: ["keyboard", "rgb"],
    config: {
      actuationPoint: 1.0,
      rapidTriggerEnabled: true,
      rapidTriggerSensitivity: 0.1,
      snapTapEnabled: true,
      remaps: {
        "Caps Lock": "Easy-Shift[+]",
        "F1": "Mute Mic",
        "F2": "Volume Down",
        "F3": "Volume Up"
      },
      macros: [],
      rgbZones: {
        wasd: "#00e5ff",
        arrows: "#00e5ff",
        main: "#ff0055",
        functionKeys: "#ffaa00"
      },
      rgb: {
        effect: "wave",
        color: "#00e5ff",
        brightness: 100,
        speed: 70,
        syncEnabled: true
      }
    }
  },
  {
    id: "preset-headset-syn",
    name: "ROCCAT Syn Pro Air 3D",
    type: "headset",
    icon: "🎧",
    isDetected: false,
    source: "Superhuman Hearing",
    capabilities: ["headset", "rgb"],
    config: {
      eqPreset: "esports",
      eqBands: { "64Hz": 3, "250Hz": 1, "1kHz": 2, "4kHz": 5, "16kHz": 3 },
      micGain: 85,
      noiseReduction: true,
      sidetone: 25,
      spatialAudio: true,
      rgb: {
        effect: "breathing",
        color: "#00e5ff",
        brightness: 80,
        speed: 40,
        syncEnabled: true
      }
    }
  },
  {
    id: "preset-gamepad-apex",
    name: "Antigravity Pro Controller",
    type: "gamepad",
    icon: "🎮",
    isDetected: false,
    source: "Gamepad Suite",
    capabilities: ["gamepad", "rgb"],
    config: {
      leftDeadzone: 4,
      rightDeadzone: 4,
      leftTriggerActuation: 8,
      rightTriggerActuation: 8,
      vibrationStrength: 85,
      paddles: {
        "Paddle P1": "A (Jump)",
        "Paddle P2": "B (Crouch)",
        "Paddle P3": "X (Reload)",
        "Paddle P4": "Y (Switch)"
      },
      rgb: {
        effect: "breathing",
        color: "#00e5ff",
        brightness: 90,
        speed: 40,
        syncEnabled: false
      }
    }
  }
];

export class DeviceManager {
  constructor() {
    this.devices = this.loadDevices();
    this.activeDeviceId = this.devices[0]?.id || null;
    this.listeners = [];
    this.setupHardwareDetection();
  }

  loadDevices() {
    const saved = localStorage.getItem("antigravity_devices_kain");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Fehler beim Laden", e);
      }
    }
    return JSON.parse(JSON.stringify(BASE_PRESET_DEVICES));
  }

  saveDevices() {
    localStorage.setItem("antigravity_devices_kain", JSON.stringify(this.devices));
  }

  getDevices() {
    return this.devices;
  }

  getActiveDevice() {
    return this.devices.find(d => d.id === this.activeDeviceId) || this.devices[0];
  }

  setActiveDevice(id) {
    this.activeDeviceId = id;
    this.notify();
  }

  updateActiveConfig(partialConfig) {
    const device = this.getActiveDevice();
    if (device) {
      device.config = { ...device.config, ...partialConfig };
      this.saveDevices();
      this.notify();
    }
  }

  async scanHardware() {
    let detectedList = [];

    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
      try {
        const mediaDevices = await navigator.mediaDevices.enumerateDevices();
        const audioDevices = mediaDevices.filter(d => d.kind === "audiooutput" || d.kind === "audioinput");
        const seenLabels = new Set();
        audioDevices.forEach(d => {
          const label = d.label || (d.kind === "audiooutput" ? "Audioausgabe" : "Audioeingabe");
          if (!seenLabels.has(label) && label !== "") {
            seenLabels.add(label);
            detectedList.push({
              id: `hw-audio-${d.deviceId || Math.random().toString(36).substring(2, 7)}`,
              name: label,
              type: "headset",
              icon: "🎧",
              isDetected: true,
              source: "Hardware Audio",
              capabilities: ["headset", "rgb"],
              config: {
                eqPreset: "gaming",
                eqBands: { "64Hz": 2, "250Hz": 1, "1kHz": 0, "4kHz": 3, "16kHz": 2 },
                micGain: 80,
                noiseReduction: true,
                sidetone: 15,
                spatialAudio: true,
                rgb: { effect: "static", color: "#00e5ff", brightness: 70, speed: 0, syncEnabled: true }
              }
            });
          }
        });
      } catch (err) {
        console.warn("Hardware scan warning:", err);
      }
    }

    if (navigator.getGamepads) {
      const gamepads = navigator.getGamepads();
      for (const gp of gamepads) {
        if (gp) {
          detectedList.push({
            id: `hw-gamepad-${gp.index}`,
            name: gp.id.replace(/\(.*?\)/g, "").trim() || `Controller #${gp.index + 1}`,
            type: "gamepad",
            icon: "🎮",
            isDetected: true,
            gamepadIndex: gp.index,
            source: "Gamepad API",
            capabilities: ["gamepad", "rgb"],
            config: {
              leftDeadzone: 4,
              rightDeadzone: 4,
              leftTriggerActuation: 8,
              rightTriggerActuation: 8,
              vibrationStrength: 90,
              paddles: { "Paddle P1": "A", "Paddle P2": "B", "Paddle P3": "X", "Paddle P4": "Y" },
              rgb: { effect: "breathing", color: "#00e5ff", brightness: 90, speed: 50, syncEnabled: false }
            }
          });
        }
      }
    }

    detectedList.forEach(detected => {
      const existingIdx = this.devices.findIndex(d => d.id === detected.id || (d.isDetected && d.name === detected.name));
      if (existingIdx >= 0) {
        this.devices[existingIdx].isDetected = true;
      } else {
        this.devices.unshift(detected);
      }
    });

    this.saveDevices();
    this.notify();
    return detectedList.length;
  }

  setupHardwareDetection() {
    this.scanHardware();
    window.addEventListener("gamepadconnected", () => this.scanHardware());
    window.addEventListener("gamepaddisconnected", () => this.scanHardware());
    if (navigator.mediaDevices && navigator.mediaDevices.addEventListener) {
      navigator.mediaDevices.addEventListener("devicechange", () => this.scanHardware());
    }
  }

  exportActiveProfile() {
    const device = this.getActiveDevice();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(device, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${device.id}_kain_profile.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }

  importProfile(jsonString) {
    try {
      const imported = JSON.parse(jsonString);
      if (!imported.id || !imported.config) throw new Error("Ungültiges Format");
      const idx = this.devices.findIndex(d => d.id === imported.id);
      if (idx >= 0) {
        this.devices[idx] = imported;
      } else {
        this.devices.push(imported);
      }
      this.activeDeviceId = imported.id;
      this.saveDevices();
      this.notify();
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  notify() {
    const device = this.getActiveDevice();
    this.listeners.forEach(cb => cb(device));
  }
}
