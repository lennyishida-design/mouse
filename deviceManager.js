/**
 * Antigravity Device Manager
 * Handles hardware detection (MediaDevices, Gamepad API), JSON profiles & persistence.
 */

export const BASE_PRESET_DEVICES = [
  {
    id: "preset-mouse-pro",
    name: "Antigravity Viper Pro",
    type: "mouse",
    icon: "🖱️",
    isDetected: false,
    source: "Profil",
    capabilities: ["mouse", "rgb"],
    config: {
      dpi: 1600,
      dpiStages: [400, 800, 1600, 3200, 6400],
      activeStage: 2,
      pollingRate: 1000,
      liftOffDistance: 1.0,
      keybinds: {
        "Taste 1 (Links)": "Left Click",
        "Taste 2 (Rechts)": "Right Click",
        "Taste 3 (Mitte)": "Middle Click",
        "Taste 4 (Daumen 1)": "Browser Back",
        "Taste 5 (Daumen 2)": "Browser Forward",
        "DPI Switch": "Cycle DPI"
      },
      macros: [
        { name: "Fast Tap", keys: ["Click Left", "Delay 30ms", "Click Left"] }
      ],
      rgb: {
        effect: "breathing",
        color: "#10b981",
        brightness: 80,
        speed: 50,
        syncEnabled: true
      }
    }
  },
  {
    id: "preset-kb-analog",
    name: "Antigravity Huntsman Analog",
    type: "keyboard",
    icon: "⌨️",
    isDetected: false,
    source: "Profil",
    capabilities: ["keyboard", "rgb"],
    config: {
      actuationPoint: 1.2,
      rapidTriggerEnabled: true,
      rapidTriggerSensitivity: 0.15,
      snapTapEnabled: true,
      remaps: {
        "Caps Lock": "Left Ctrl",
        "F1": "Mute Mic",
        "F2": "Volume Down",
        "F3": "Volume Up"
      },
      macros: [],
      rgbZones: {
        wasd: "#3b82f6",
        arrows: "#3b82f6",
        main: "#10b981",
        functionKeys: "#f59e0b"
      },
      rgb: {
        effect: "wave",
        color: "#3b82f6",
        brightness: 100,
        speed: 70,
        syncEnabled: true
      }
    }
  },
  {
    id: "preset-headset-blackshark",
    name: "Antigravity Spatial Headset",
    type: "headset",
    icon: "🎧",
    isDetected: false,
    source: "Profil",
    capabilities: ["headset", "rgb"],
    config: {
      eqPreset: "gaming",
      eqBands: { "64Hz": 3, "250Hz": 1, "1kHz": 0, "4kHz": 4, "16kHz": 2 },
      micGain: 80,
      noiseReduction: true,
      sidetone: 20,
      spatialAudio: true,
      rgb: {
        effect: "static",
        color: "#8b5cf6",
        brightness: 70,
        speed: 0,
        syncEnabled: true
      }
    }
  },
  {
    id: "preset-gamepad-elite",
    name: "Antigravity Apex Wireless Controller",
    type: "gamepad",
    icon: "🎮",
    isDetected: false,
    source: "Profil",
    capabilities: ["gamepad", "rgb"],
    config: {
      leftDeadzone: 5, // %
      rightDeadzone: 5, // %
      leftTriggerActuation: 10, // %
      rightTriggerActuation: 10, // %
      vibrationStrength: 80, // %
      paddles: {
        "Paddle P1": "A (Springen)",
        "Paddle P2": "B (Ducken)",
        "Paddle P3": "X (Nachladen)",
        "Paddle P4": "Y (Waffenwechsel)"
      },
      rgb: {
        effect: "breathing",
        color: "#ec4899",
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
    const saved = localStorage.getItem("antigravity_devices");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Fehler beim Laden gespeicherter Profile", e);
      }
    }
    return JSON.parse(JSON.stringify(BASE_PRESET_DEVICES));
  }

  saveDevices() {
    localStorage.setItem("antigravity_devices", JSON.stringify(this.devices));
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

  // --- Hardware Detection Systems ---
  async scanHardware() {
    let detectedList = [];

    // 1. Audio MediaDevices (Headsets, Mics, Speakers)
    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
      try {
        const mediaDevices = await navigator.mediaDevices.enumerateDevices();
        const audioDevices = mediaDevices.filter(d => d.kind === "audiooutput" || d.kind === "audioinput");
        
        // Group distinct physical audio devices
        const seenLabels = new Set();
        audioDevices.forEach(d => {
          const label = d.label || (d.kind === "audiooutput" ? "Audioausgabegerät" : "Audioeingabegerät");
          if (!seenLabels.has(label) && label !== "") {
            seenLabels.add(label);
            detectedList.push({
              id: `hw-audio-${d.deviceId || Math.random().toString(36).substring(2, 7)}`,
              name: label,
              type: "headset",
              icon: "🎧",
              isDetected: true,
              source: "Hardware (MediaDevices)",
              capabilities: ["headset", "rgb"],
              config: {
                eqPreset: "gaming",
                eqBands: { "64Hz": 2, "250Hz": 1, "1kHz": 0, "4kHz": 3, "16kHz": 2 },
                micGain: 80,
                noiseReduction: true,
                sidetone: 15,
                spatialAudio: true,
                rgb: { effect: "static", color: "#3b82f6", brightness: 70, speed: 0, syncEnabled: true }
              }
            });
          }
        });
      } catch (err) {
        console.warn("MediaDevices detection warning:", err);
      }
    }

    // 2. Gamepad API
    if (navigator.getGamepads) {
      const gamepads = navigator.getGamepads();
      for (const gp of gamepads) {
        if (gp) {
          detectedList.push({
            id: `hw-gamepad-${gp.index}`,
            name: gp.id.replace(/\(.*?\)/g, "").trim() || `Gamepad #${gp.index + 1}`,
            type: "gamepad",
            icon: "🎮",
            isDetected: true,
            gamepadIndex: gp.index,
            source: "Hardware (Gamepad API)",
            capabilities: ["gamepad", "rgb"],
            config: {
              leftDeadzone: 4,
              rightDeadzone: 4,
              leftTriggerActuation: 8,
              rightTriggerActuation: 8,
              vibrationStrength: 100,
              paddles: {
                "Paddle P1": "A",
                "Paddle P2": "B",
                "Paddle P3": "X",
                "Paddle P4": "Y"
              },
              rgb: { effect: "breathing", color: "#10b981", brightness: 90, speed: 50, syncEnabled: false }
            }
          });
        }
      }
    }

    // Merge detected devices without overwriting user customizations if already present
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
    // Initial scan
    this.scanHardware();

    // Listen for Gamepad Connections
    window.addEventListener("gamepadconnected", () => {
      this.scanHardware();
    });

    window.addEventListener("gamepaddisconnected", () => {
      this.scanHardware();
    });

    // Listen for MediaDevice Changes (USB Headset plugged/unplugged)
    if (navigator.mediaDevices && navigator.mediaDevices.addEventListener) {
      navigator.mediaDevices.addEventListener("devicechange", () => {
        this.scanHardware();
      });
    }
  }

  exportActiveProfile() {
    const device = this.getActiveDevice();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(device, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${device.id}_antigravity.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }

  importProfile(jsonString) {
    try {
      const imported = JSON.parse(jsonString);
      if (!imported.id || !imported.config) throw new Error("Ungültiges Profil");
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
