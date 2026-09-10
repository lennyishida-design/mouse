(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))t(n);new MutationObserver(n=>{for(const a of n)if(a.type==="childList")for(const r of a.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&t(r)}).observe(document,{childList:!0,subtree:!0});function i(n){const a={};return n.integrity&&(a.integrity=n.integrity),n.referrerPolicy&&(a.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?a.credentials="include":n.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function t(n){if(n.ep)return;n.ep=!0;const a=i(n);fetch(n.href,a)}})();const b=[{id:"preset-mouse-pro",name:"Antigravity Viper Pro",type:"mouse",icon:"🖱️",isDetected:!1,source:"Profil",capabilities:["mouse","rgb"],config:{dpi:1600,dpiStages:[400,800,1600,3200,6400],activeStage:2,pollingRate:1e3,liftOffDistance:1,keybinds:{"Taste 1 (Links)":"Left Click","Taste 2 (Rechts)":"Right Click","Taste 3 (Mitte)":"Middle Click","Taste 4 (Daumen 1)":"Browser Back","Taste 5 (Daumen 2)":"Browser Forward","DPI Switch":"Cycle DPI"},macros:[{name:"Fast Tap",keys:["Click Left","Delay 30ms","Click Left"]}],rgb:{effect:"breathing",color:"#10b981",brightness:80,speed:50,syncEnabled:!0}}},{id:"preset-kb-analog",name:"Antigravity Huntsman Analog",type:"keyboard",icon:"⌨️",isDetected:!1,source:"Profil",capabilities:["keyboard","rgb"],config:{actuationPoint:1.2,rapidTriggerEnabled:!0,rapidTriggerSensitivity:.15,snapTapEnabled:!0,remaps:{"Caps Lock":"Left Ctrl",F1:"Mute Mic",F2:"Volume Down",F3:"Volume Up"},macros:[],rgbZones:{wasd:"#3b82f6",arrows:"#3b82f6",main:"#10b981",functionKeys:"#f59e0b"},rgb:{effect:"wave",color:"#3b82f6",brightness:100,speed:70,syncEnabled:!0}}},{id:"preset-headset-blackshark",name:"Antigravity Spatial Headset",type:"headset",icon:"🎧",isDetected:!1,source:"Profil",capabilities:["headset","rgb"],config:{eqPreset:"gaming",eqBands:{"64Hz":3,"250Hz":1,"1kHz":0,"4kHz":4,"16kHz":2},micGain:80,noiseReduction:!0,sidetone:20,spatialAudio:!0,rgb:{effect:"static",color:"#8b5cf6",brightness:70,speed:0,syncEnabled:!0}}},{id:"preset-gamepad-elite",name:"Antigravity Apex Wireless Controller",type:"gamepad",icon:"🎮",isDetected:!1,source:"Profil",capabilities:["gamepad","rgb"],config:{leftDeadzone:5,rightDeadzone:5,leftTriggerActuation:10,rightTriggerActuation:10,vibrationStrength:80,paddles:{"Paddle P1":"A (Springen)","Paddle P2":"B (Ducken)","Paddle P3":"X (Nachladen)","Paddle P4":"Y (Waffenwechsel)"},rgb:{effect:"breathing",color:"#ec4899",brightness:90,speed:40,syncEnabled:!1}}}];class y{constructor(){var e;this.devices=this.loadDevices(),this.activeDeviceId=((e=this.devices[0])==null?void 0:e.id)||null,this.listeners=[],this.setupHardwareDetection()}loadDevices(){const e=localStorage.getItem("antigravity_devices");if(e)try{return JSON.parse(e)}catch(i){console.error("Fehler beim Laden gespeicherter Profile",i)}return JSON.parse(JSON.stringify(b))}saveDevices(){localStorage.setItem("antigravity_devices",JSON.stringify(this.devices))}getDevices(){return this.devices}getActiveDevice(){return this.devices.find(e=>e.id===this.activeDeviceId)||this.devices[0]}setActiveDevice(e){this.activeDeviceId=e,this.notify()}updateActiveConfig(e){const i=this.getActiveDevice();i&&(i.config={...i.config,...e},this.saveDevices(),this.notify())}async scanHardware(){let e=[];if(navigator.mediaDevices&&navigator.mediaDevices.enumerateDevices)try{const t=(await navigator.mediaDevices.enumerateDevices()).filter(a=>a.kind==="audiooutput"||a.kind==="audioinput"),n=new Set;t.forEach(a=>{const r=a.label||(a.kind==="audiooutput"?"Audioausgabegerät":"Audioeingabegerät");!n.has(r)&&r!==""&&(n.add(r),e.push({id:`hw-audio-${a.deviceId||Math.random().toString(36).substring(2,7)}`,name:r,type:"headset",icon:"🎧",isDetected:!0,source:"Hardware (MediaDevices)",capabilities:["headset","rgb"],config:{eqPreset:"gaming",eqBands:{"64Hz":2,"250Hz":1,"1kHz":0,"4kHz":3,"16kHz":2},micGain:80,noiseReduction:!0,sidetone:15,spatialAudio:!0,rgb:{effect:"static",color:"#3b82f6",brightness:70,speed:0,syncEnabled:!0}}}))})}catch(i){console.warn("MediaDevices detection warning:",i)}if(navigator.getGamepads){const i=navigator.getGamepads();for(const t of i)t&&e.push({id:`hw-gamepad-${t.index}`,name:t.id.replace(/\(.*?\)/g,"").trim()||`Gamepad #${t.index+1}`,type:"gamepad",icon:"🎮",isDetected:!0,gamepadIndex:t.index,source:"Hardware (Gamepad API)",capabilities:["gamepad","rgb"],config:{leftDeadzone:4,rightDeadzone:4,leftTriggerActuation:8,rightTriggerActuation:8,vibrationStrength:100,paddles:{"Paddle P1":"A","Paddle P2":"B","Paddle P3":"X","Paddle P4":"Y"},rgb:{effect:"breathing",color:"#10b981",brightness:90,speed:50,syncEnabled:!1}}})}return e.forEach(i=>{const t=this.devices.findIndex(n=>n.id===i.id||n.isDetected&&n.name===i.name);t>=0?this.devices[t].isDetected=!0:this.devices.unshift(i)}),this.saveDevices(),this.notify(),e.length}setupHardwareDetection(){this.scanHardware(),window.addEventListener("gamepadconnected",()=>{this.scanHardware()}),window.addEventListener("gamepaddisconnected",()=>{this.scanHardware()}),navigator.mediaDevices&&navigator.mediaDevices.addEventListener&&navigator.mediaDevices.addEventListener("devicechange",()=>{this.scanHardware()})}exportActiveProfile(){const e=this.getActiveDevice(),i="data:text/json;charset=utf-8,"+encodeURIComponent(JSON.stringify(e,null,2)),t=document.createElement("a");t.setAttribute("href",i),t.setAttribute("download",`${e.id}_antigravity.json`),document.body.appendChild(t),t.click(),t.remove()}importProfile(e){try{const i=JSON.parse(e);if(!i.id||!i.config)throw new Error("Ungültiges Profil");const t=this.devices.findIndex(n=>n.id===i.id);return t>=0?this.devices[t]=i:this.devices.push(i),this.activeDeviceId=i.id,this.saveDevices(),this.notify(),!0}catch(i){return console.error(i),!1}}subscribe(e){return this.listeners.push(e),()=>{this.listeners=this.listeners.filter(i=>i!==e)}}notify(){const e=this.getActiveDevice();this.listeners.forEach(i=>i(e))}}class k{constructor(e){this.deviceManager=e,this.name="Maus",this.id="mouse",this.icon="🖱️"}isSupported(e){return e.capabilities.includes("mouse")||e.type==="mouse"}render(e){var n;const t=this.deviceManager.getActiveDevice().config;e.innerHTML=`
      <div class="module-panel">
        <div class="panel-header">
          <div>
            <h2 class="panel-title">Maus & Sensor‑Leistung</h2>
            <p class="panel-desc">Optischer Sensor, Abtastrate, Lift‑Off‑Distance und Tastenbelegung</p>
          </div>
        </div>

        <div class="grid-2">
          <!-- DPI Settings -->
          <div class="card-box">
            <div class="card-title">
              <span>DPI‑Empfindlichkeit</span>
              <span class="badge-value" id="dpi-val">${t.dpi||1600} DPI</span>
            </div>
            <div class="slider-group">
              <input type="range" min="100" max="30000" step="50" value="${t.dpi||1600}" class="range-slider" id="dpi-slider">
            </div>
            <div class="card-title" style="margin-top: 8px;">
              <span>DPI‑Stufen</span>
            </div>
            <div class="dpi-stages" id="dpi-stages-container">
              ${(t.dpiStages||[400,800,1600,3200,6400]).map((a,r)=>`
                <button class="dpi-stage-btn ${r===t.activeStage?"active":""}" data-stage="${r}" data-dpi="${a}">
                  ${a}
                </button>
              `).join("")}
            </div>
          </div>

          <!-- Polling & LOD -->
          <div class="card-box">
            <div class="card-title">
              <span>Polling‑Rate (Abtastrate)</span>
            </div>
            <select id="polling-select" class="custom-select">
              ${[125,250,500,1e3,2e3,4e3,8e3].map(a=>`
                <option value="${a}" ${t.pollingRate===a?"selected":""}>${a} Hz (${(1e3/a).toFixed(2)}ms)</option>
              `).join("")}
            </select>

            <div class="card-title" style="margin-top: 12px;">
              <span>Lift‑Off‑Distance (LOD)</span>
              <span class="badge-value" id="lod-val">${t.liftOffDistance||1} mm</span>
            </div>
            <div class="slider-group">
              <input type="range" min="0.5" max="3.0" step="0.1" value="${t.liftOffDistance||1}" class="range-slider" id="lod-slider">
            </div>
          </div>
        </div>

        <!-- Keybinds & Macro Section -->
        <div class="grid-2">
          <!-- Keybinds -->
          <div class="card-box">
            <div class="card-title">
              <span>Tastenbelegung (Keybinds)</span>
            </div>
            <div class="keybind-list">
              ${Object.entries(t.keybinds||{"Taste 1 (Links)":"Left Click","Taste 2 (Rechts)":"Right Click","Taste 3 (Mitte)":"Middle Click","Taste 4 (Daumen 1)":"Browser Back","Taste 5 (Daumen 2)":"Browser Forward","DPI Switch":"Cycle DPI"}).map(([a,r])=>`
                <div class="keybind-row">
                  <span class="key-name">${a}</span>
                  <select class="custom-select key-action-select" data-btn="${a}" style="width: 150px; font-size: 0.8rem; padding: 4px 8px;">
                    <option value="Left Click" ${r==="Left Click"?"selected":""}>Linksklick</option>
                    <option value="Right Click" ${r==="Right Click"?"selected":""}>Rechtsklick</option>
                    <option value="Middle Click" ${r==="Middle Click"?"selected":""}>Mittelklick</option>
                    <option value="Browser Back" ${r==="Browser Back"?"selected":""}>Zurück</option>
                    <option value="Browser Forward" ${r==="Browser Forward"?"selected":""}>Vorwärts</option>
                    <option value="Cycle DPI" ${r==="Cycle DPI"?"selected":""}>DPI-Wechsel</option>
                    <option value="Fast Tap" ${r==="Fast Tap"?"selected":""}>Makro ausführen</option>
                    <option value="Disabled" ${r==="Disabled"?"selected":""}>Deaktiviert</option>
                  </select>
                </div>
              `).join("")}
            </div>
          </div>

          <!-- Minimal Macro Editor -->
          <div class="card-box">
            <div class="card-title">
              <span>Makro‑Editor</span>
              <button class="btn btn-secondary btn-sm" id="add-macro-step-btn">+ Schritt</button>
            </div>
            <div class="macro-steps" id="macro-steps-list">
              ${(t.macros&&((n=t.macros[0])==null?void 0:n.keys)||["Click Left","Delay 30ms","Click Left"]).map((a,r)=>`
                <div class="macro-step-item">
                  <span>${a}</span>
                  <button class="btn btn-ghost btn-sm remove-macro-step" data-idx="${r}" style="color: #ef4444;">✕</button>
                </div>
              `).join("")}
            </div>
            <div style="display: flex; gap: 8px; margin-top: 8px;">
              <input type="text" id="macro-step-input" class="custom-input" placeholder="z.B. Taste [F] oder 20ms" style="flex: 1;">
              <button class="btn btn-primary btn-sm" id="save-step-btn">Hinzufügen</button>
            </div>
          </div>
        </div>
      </div>
    `,this.attachEvents(e)}attachEvents(e){const i=e.querySelector("#dpi-slider"),t=e.querySelector("#dpi-val");i&&i.addEventListener("input",c=>{const s=parseInt(c.target.value,10);t.textContent=`${s} DPI`,this.deviceManager.updateActiveConfig({dpi:s})});const n=e.querySelectorAll(".dpi-stage-btn");n.forEach(c=>{c.addEventListener("click",()=>{const s=parseInt(c.dataset.stage,10),p=parseInt(c.dataset.dpi,10);n.forEach(o=>o.classList.remove("active")),c.classList.add("active"),i&&(i.value=p),t&&(t.textContent=`${p} DPI`),this.deviceManager.updateActiveConfig({activeStage:s,dpi:p})})});const a=e.querySelector("#polling-select");a&&a.addEventListener("change",c=>{this.deviceManager.updateActiveConfig({pollingRate:parseInt(c.target.value,10)})});const r=e.querySelector("#lod-slider"),g=e.querySelector("#lod-val");r&&r.addEventListener("input",c=>{const s=parseFloat(c.target.value);g.textContent=`${s.toFixed(1)} mm`,this.deviceManager.updateActiveConfig({liftOffDistance:s})}),e.querySelectorAll(".key-action-select").forEach(c=>{c.addEventListener("change",s=>{const o={...this.deviceManager.getActiveDevice().config.keybinds,[c.dataset.btn]:s.target.value};this.deviceManager.updateActiveConfig({keybinds:o})})});const d=e.querySelector("#save-step-btn"),l=e.querySelector("#macro-step-input");if(d&&l){const c=()=>{const s=l.value.trim();if(!s)return;const o=this.deviceManager.getActiveDevice().config.macros||[{name:"Standard",keys:[]}];o[0]||(o[0]={name:"Standard",keys:[]}),o[0].keys.push(s),this.deviceManager.updateActiveConfig({macros:o}),l.value="",this.render(e)};d.addEventListener("click",c),l.addEventListener("keydown",s=>{s.key==="Enter"&&c()})}e.querySelectorAll(".remove-macro-step").forEach(c=>{c.addEventListener("click",()=>{const s=parseInt(c.dataset.idx,10),o=this.deviceManager.getActiveDevice().config.macros;o&&o[0]&&o[0].keys&&(o[0].keys.splice(s,1),this.deviceManager.updateActiveConfig({macros:o}),this.render(e))})})}}class S{constructor(e){this.deviceManager=e,this.name="Tastatur",this.id="keyboard",this.icon="⌨️"}isSupported(e){return e.capabilities.includes("keyboard")||e.type==="keyboard"}render(e){const t=this.deviceManager.getActiveDevice().config;e.innerHTML=`
      <div class="module-panel">
        <div class="panel-header">
          <div>
            <h2 class="panel-title">Tastatur & Schalter</h2>
            <p class="panel-desc">Analoge Tastenmechanik, Rapid Trigger, SOCD Snap Tap und RGB‑Zonen</p>
          </div>
        </div>

        <!-- Rapid Trigger & Snap Tap -->
        <div class="grid-2">
          <div class="card-box">
            <div class="card-title">
              <span>Rapid Trigger & Betätigung</span>
              <span class="badge-value" id="actuation-val">${t.actuationPoint||1.2} mm</span>
            </div>
            
            <div class="slider-group">
              <label class="switch-label" style="font-size: 0.75rem; color: var(--text-muted);">Betätigungspunkt (Actuation Point)</label>
              <input type="range" min="0.1" max="4.0" step="0.1" value="${t.actuationPoint||1.2}" class="range-slider" id="actuation-slider">
            </div>

            <div class="switch-control" style="margin-top: 12px;">
              <div>
                <div class="switch-label">Rapid Trigger</div>
                <div style="font-size: 0.725rem; color: var(--text-light);">Dynamisches Zurücksetzen bei Tastenhub</div>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" id="rapid-trigger-toggle" ${t.rapidTriggerEnabled?"checked":""}>
                <span class="toggle-slider"></span>
              </label>
            </div>

            <div class="slider-group" style="margin-top: 10px;">
              <div style="display: flex; justify-content: space-between;">
                <span style="font-size: 0.75rem; color: var(--text-muted);">RT‑Sensitivität</span>
                <span style="font-size: 0.75rem; font-weight: 600;" id="rt-sens-val">${t.rapidTriggerSensitivity||.15} mm</span>
              </div>
              <input type="range" min="0.05" max="2.0" step="0.05" value="${t.rapidTriggerSensitivity||.15}" class="range-slider" id="rt-sens-slider">
            </div>
          </div>

          <div class="card-box">
            <div class="card-title">
              <span>Snap Tap (SOCD)</span>
            </div>
            
            <div class="switch-control">
              <div>
                <div class="switch-label">Snap Tap Modus</div>
                <div style="font-size: 0.725rem; color: var(--text-light);">Priorisiert die zuletzt gedrückte Richtungstaste (A/D)</div>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" id="snaptap-toggle" ${t.snapTapEnabled?"checked":""}>
                <span class="toggle-slider"></span>
              </label>
            </div>

            <div class="card-title" style="margin-top: 20px;">
              <span>RGB‑Zonen</span>
            </div>
            <div style="display: flex; justify-content: space-between; gap: 8px;">
              ${Object.entries(t.rgbZones||{wasd:"#3b82f6",arrows:"#3b82f6",main:"#10b981",functionKeys:"#f59e0b"}).map(([n,a])=>`
                <div style="display: flex; flex-direction: column; align-items: center; gap: 4px;">
                  <input type="color" value="${a}" class="color-picker-native rgb-zone-picker" data-zone="${n}" style="width: 36px; height: 36px;">
                  <span style="font-size: 0.675rem; font-weight: 600; text-transform: uppercase; color: var(--text-muted);">${n}</span>
                </div>
              `).join("")}
            </div>
          </div>
        </div>

        <!-- Key Remapping -->
        <div class="grid-2">
          <div class="card-box">
            <div class="card-title">
              <span>Key‑Remapping</span>
            </div>
            <div class="keybind-list">
              ${Object.entries(t.remaps||{"Caps Lock":"Left Ctrl",F1:"Mute Mic",F2:"Volume Down",F3:"Volume Up"}).map(([n,a])=>`
                <div class="keybind-row">
                  <span class="key-name">${n}</span>
                  <input type="text" class="custom-input remap-input" data-key="${n}" value="${a}" style="width: 140px; padding: 4px 8px; font-size: 0.8rem;">
                </div>
              `).join("")}
            </div>
          </div>

          <div class="card-box">
            <div class="card-title">
              <span>Makro‑Zuweisung</span>
            </div>
            <div class="keybind-list">
              <div class="keybind-row">
                <span class="key-name">Makrotaste M1</span>
                <select class="custom-select" style="width: 140px; padding: 4px 8px; font-size: 0.8rem;">
                  <option>Build Macro</option>
                  <option>Schnellfeuer</option>
                  <option>Kein Makro</option>
                </select>
              </div>
              <div class="keybind-row">
                <span class="key-name">Makrotaste M2</span>
                <select class="custom-select" style="width: 140px; padding: 4px 8px; font-size: 0.8rem;">
                  <option>Discord Mute</option>
                  <option>Clip aufnehmen</option>
                  <option>Kein Makro</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    `,this.attachEvents(e)}attachEvents(e){const i=e.querySelector("#actuation-slider"),t=e.querySelector("#actuation-val");i&&i.addEventListener("input",v=>{const d=parseFloat(v.target.value);t.textContent=`${d.toFixed(1)} mm`,this.deviceManager.updateActiveConfig({actuationPoint:d})});const n=e.querySelector("#rapid-trigger-toggle");n&&n.addEventListener("change",v=>{this.deviceManager.updateActiveConfig({rapidTriggerEnabled:v.target.checked})});const a=e.querySelector("#rt-sens-slider"),r=e.querySelector("#rt-sens-val");a&&a.addEventListener("input",v=>{const d=parseFloat(v.target.value);r.textContent=`${d.toFixed(2)} mm`,this.deviceManager.updateActiveConfig({rapidTriggerSensitivity:d})});const g=e.querySelector("#snaptap-toggle");g&&g.addEventListener("change",v=>{this.deviceManager.updateActiveConfig({snapTapEnabled:v.target.checked})}),e.querySelectorAll(".rgb-zone-picker").forEach(v=>{v.addEventListener("input",d=>{const l=d.target.dataset.zone,s={...this.deviceManager.getActiveDevice().config.rgbZones,[l]:d.target.value};this.deviceManager.updateActiveConfig({rgbZones:s})})}),e.querySelectorAll(".remap-input").forEach(v=>{v.addEventListener("change",d=>{const l=d.target.dataset.key,s={...this.deviceManager.getActiveDevice().config.remaps,[l]:d.target.value};this.deviceManager.updateActiveConfig({remaps:s})})})}}class x{constructor(e){this.deviceManager=e,this.name="Headset",this.id="headset",this.icon="🎧"}isSupported(e){return e.capabilities.includes("headset")||e.type==="headset"}render(e){const t=this.deviceManager.getActiveDevice().config,n=t.eqBands||{"64Hz":0,"250Hz":0,"1kHz":0,"4kHz":0,"16kHz":0};e.innerHTML=`
      <div class="module-panel">
        <div class="panel-header">
          <div>
            <h2 class="panel-title">Headset & Akustik</h2>
            <p class="panel-desc">THX Spatial Audio, Equalizer‑Profile und Mikrofonfilter</p>
          </div>
        </div>

        <div class="grid-2">
          <!-- Equalizer -->
          <div class="card-box">
            <div class="card-title">
              <span>Equalizer & Presets</span>
              <select id="eq-preset-select" class="custom-select" style="width: 125px; padding: 3px 8px; font-size: 0.8rem;">
                <option value="gaming" ${t.eqPreset==="gaming"?"selected":""}>Gaming</option>
                <option value="esports" ${t.eqPreset==="esports"?"selected":""}>Esports / FPS</option>
                <option value="music" ${t.eqPreset==="music"?"selected":""}>Musik</option>
                <option value="movie" ${t.eqPreset==="movie"?"selected":""}>Film</option>
                <option value="custom" ${t.eqPreset==="custom"?"selected":""}>Benutzerdefiniert</option>
              </select>
            </div>

            <!-- Graphic EQ -->
            <div class="eq-bars-container">
              ${Object.entries(n).map(([a,r])=>`
                <div class="eq-band">
                  <span style="font-size: 0.7rem; font-weight: 600;" id="eq-val-${a}">${r>0?"+"+r:r}dB</span>
                  <input type="range" min="-12" max="12" step="1" value="${r}" class="eq-slider" data-freq="${a}">
                  <span class="eq-freq-label">${a}</span>
                </div>
              `).join("")}
            </div>
          </div>

          <!-- Microphone & Enhancements -->
          <div class="card-box">
            <div class="card-title">
              <span>Mikrofon‑Einstellungen</span>
              <span class="badge-value" id="mic-gain-val">${t.micGain||80}%</span>
            </div>

            <div class="slider-group">
              <label class="switch-label" style="font-size: 0.75rem; color: var(--text-muted);">Mikrofonverstärkung (Gain)</label>
              <input type="range" min="0" max="100" step="1" value="${t.micGain||80}" class="range-slider" id="mic-gain-slider">
            </div>

            <div class="switch-control" style="margin-top: 14px;">
              <div>
                <div class="switch-label">Aktive Rauschunterdrückung</div>
                <div style="font-size: 0.725rem; color: var(--text-light);">Tastaturgeräusche und Lüfterrauschen eliminieren</div>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" id="noise-reduction-toggle" ${t.noiseReduction?"checked":""}>
                <span class="toggle-slider"></span>
              </label>
            </div>

            <div class="switch-control" style="margin-top: 14px;">
              <div>
                <div class="switch-label">Spatial Audio 7.1 Surround</div>
                <div style="font-size: 0.725rem; color: var(--text-light);">Präzise ortbare 360° Klangkulisse</div>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" id="spatial-toggle" ${t.spatialAudio?"checked":""}>
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>
      </div>
    `,this.attachEvents(e)}attachEvents(e){const i=e.querySelector("#eq-preset-select"),t=e.querySelectorAll(".eq-slider"),n={gaming:{"64Hz":4,"250Hz":2,"1kHz":0,"4kHz":4,"16kHz":3},esports:{"64Hz":-3,"250Hz":-1,"1kHz":2,"4kHz":6,"16kHz":4},music:{"64Hz":5,"250Hz":3,"1kHz":0,"4kHz":2,"16kHz":5},movie:{"64Hz":6,"250Hz":4,"1kHz":-1,"4kHz":3,"16kHz":2},custom:{"64Hz":0,"250Hz":0,"1kHz":0,"4kHz":0,"16kHz":0}};i&&i.addEventListener("change",d=>{const l=d.target.value;if(n[l]){const c=n[l];this.deviceManager.updateActiveConfig({eqPreset:l,eqBands:c}),t.forEach(s=>{const p=s.dataset.freq;s.value=c[p]||0;const o=e.querySelector(`#eq-val-${p}`);o&&(o.textContent=`${s.value>0?"+"+s.value:s.value}dB`)})}}),t.forEach(d=>{d.addEventListener("input",l=>{const c=l.target.dataset.freq,s=parseInt(l.target.value,10),p=e.querySelector(`#eq-val-${c}`);p&&(p.textContent=`${s>0?"+"+s:s}dB`);const u={...this.deviceManager.getActiveDevice().config.eqBands||{},[c]:s};this.deviceManager.updateActiveConfig({eqBands:u,eqPreset:"custom"}),i&&(i.value="custom")})});const a=e.querySelector("#mic-gain-slider"),r=e.querySelector("#mic-gain-val");a&&a.addEventListener("input",d=>{const l=parseInt(d.target.value,10);r.textContent=`${l}%`,this.deviceManager.updateActiveConfig({micGain:l})});const g=e.querySelector("#noise-reduction-toggle");g&&g.addEventListener("change",d=>{this.deviceManager.updateActiveConfig({noiseReduction:d.target.checked})});const v=e.querySelector("#spatial-toggle");v&&v.addEventListener("change",d=>{this.deviceManager.updateActiveConfig({spatialAudio:d.target.checked})})}}class M{constructor(e){this.deviceManager=e,this.name="Controller",this.id="gamepad",this.icon="🎮",this.animFrameId=null}isSupported(e){return e.capabilities.includes("gamepad")||e.type==="gamepad"}render(e){const i=this.deviceManager.getActiveDevice(),t=i.config;e.innerHTML=`
      <div class="module-panel">
        <div class="panel-header">
          <div>
            <h2 class="panel-title">Controller & Gamepad</h2>
            <p class="panel-desc">Stick‑Kalibrierung, Hair‑Trigger, Paddle‑Belegung und Vibration</p>
          </div>
        </div>

        <!-- Live Stick & Trigger Inspector -->
        <div class="card-box">
          <div class="card-title">
            <span>Live‑Stick & Trigger Visualizer</span>
            <span class="badge-value" id="gamepad-status-badge">${i.isDetected?"Hardware aktiv":"Emulation"}</span>
          </div>

          <div class="gamepad-visualizer">
            <!-- Left Stick -->
            <div class="stick-container">
              <div class="stick-circle">
                <div class="stick-nub" id="left-stick-nub"></div>
              </div>
              <span class="stick-label">Linker Stick</span>
            </div>

            <!-- Triggers LT / RT -->
            <div class="trigger-meters">
              <div class="trigger-bar-wrapper">
                <div class="trigger-meter">
                  <div class="trigger-fill" id="lt-meter-fill" style="height: 0%;"></div>
                </div>
                <span class="stick-label">LT</span>
              </div>
              <div class="trigger-bar-wrapper">
                <div class="trigger-meter">
                  <div class="trigger-fill" id="rt-meter-fill" style="height: 0%;"></div>
                </div>
                <span class="stick-label">RT</span>
              </div>
            </div>

            <!-- Right Stick -->
            <div class="stick-container">
              <div class="stick-circle">
                <div class="stick-nub" id="right-stick-nub"></div>
              </div>
              <span class="stick-label">Rechter Stick</span>
            </div>
          </div>
        </div>

        <div class="grid-2">
          <!-- Stick Deadzones -->
          <div class="card-box">
            <div class="card-title">
              <span>Stick‑Totzonen (Deadzones)</span>
            </div>

            <div class="slider-group">
              <div style="display: flex; justify-content: space-between;">
                <span style="font-size: 0.75rem; color: var(--text-muted);">Linker Stick Totzone</span>
                <span style="font-size: 0.75rem; font-weight: 600;" id="ldz-val">${t.leftDeadzone||5}%</span>
              </div>
              <input type="range" min="0" max="30" step="1" value="${t.leftDeadzone||5}" class="range-slider" id="ldz-slider">
            </div>

            <div class="slider-group" style="margin-top: 10px;">
              <div style="display: flex; justify-content: space-between;">
                <span style="font-size: 0.75rem; color: var(--text-muted);">Rechter Stick Totzone</span>
                <span style="font-size: 0.75rem; font-weight: 600;" id="rdz-val">${t.rightDeadzone||5}%</span>
              </div>
              <input type="range" min="0" max="30" step="1" value="${t.rightDeadzone||5}" class="range-slider" id="rdz-slider">
            </div>
          </div>

          <!-- Trigger Actuation & Vibration -->
          <div class="card-box">
            <div class="card-title">
              <span>Trigger & Haptik</span>
            </div>

            <div class="slider-group">
              <div style="display: flex; justify-content: space-between;">
                <span style="font-size: 0.75rem; color: var(--text-muted);">Hair‑Trigger Ansprechpunkt</span>
                <span style="font-size: 0.75rem; font-weight: 600;" id="trigger-act-val">${t.leftTriggerActuation||10}%</span>
              </div>
              <input type="range" min="1" max="100" step="1" value="${t.leftTriggerActuation||10}" class="range-slider" id="trigger-act-slider">
            </div>

            <div class="slider-group" style="margin-top: 10px;">
              <div style="display: flex; justify-content: space-between;">
                <span style="font-size: 0.75rem; color: var(--text-muted);">Vibrationsstärke</span>
                <span style="font-size: 0.75rem; font-weight: 600;" id="vib-val">${t.vibrationStrength||80}%</span>
              </div>
              <input type="range" min="0" max="100" step="5" value="${t.vibrationStrength||80}" class="range-slider" id="vib-slider">
            </div>

            <button class="btn btn-secondary btn-sm" id="test-vibration-btn" style="margin-top: 6px;">
              Vibration testen
            </button>
          </div>
        </div>

        <!-- Paddle Keybinds -->
        <div class="card-box">
          <div class="card-title">
            <span>Rückseitige Paddles / Sondertasten</span>
          </div>

          <div class="keybind-list">
            ${Object.entries(t.paddles||{"Paddle P1":"A (Springen)","Paddle P2":"B (Ducken)","Paddle P3":"X (Nachladen)","Paddle P4":"Y (Waffenwechsel)"}).map(([n,a])=>`
              <div class="keybind-row">
                <span class="key-name">${n}</span>
                <select class="custom-select paddle-action-select" data-paddle="${n}" style="width: 170px; font-size: 0.8rem; padding: 4px 8px;">
                  <option value="A" ${a.includes("A")?"selected":""}>A / Kreuz</option>
                  <option value="B" ${a.includes("B")?"selected":""}>B / Kreis</option>
                  <option value="X" ${a.includes("X")?"selected":""}>X / Quadrat</option>
                  <option value="Y" ${a.includes("Y")?"selected":""}>Y / Dreieck</option>
                  <option value="LB" ${a.includes("LB")?"selected":""}>LB / L1</option>
                  <option value="RB" ${a.includes("RB")?"selected":""}>RB / R1</option>
                  <option value="L3" ${a.includes("L3")?"selected":""}>Linker Stick Klick (L3)</option>
                  <option value="R3" ${a.includes("R3")?"selected":""}>Rechter Stick Klick (R3)</option>
                  <option value="None" ${a==="None"?"selected":""}>Deaktiviert</option>
                </select>
              </div>
            `).join("")}
          </div>
        </div>
      </div>
    `,this.attachEvents(e),this.startGamepadLoop(e)}attachEvents(e){const i=e.querySelector("#ldz-slider"),t=e.querySelector("#ldz-val");i&&i.addEventListener("input",c=>{const s=parseInt(c.target.value,10);t.textContent=`${s}%`,this.deviceManager.updateActiveConfig({leftDeadzone:s})});const n=e.querySelector("#rdz-slider"),a=e.querySelector("#rdz-val");n&&n.addEventListener("input",c=>{const s=parseInt(c.target.value,10);a.textContent=`${s}%`,this.deviceManager.updateActiveConfig({rightDeadzone:s})});const r=e.querySelector("#trigger-act-slider"),g=e.querySelector("#trigger-act-val");r&&r.addEventListener("input",c=>{const s=parseInt(c.target.value,10);g.textContent=`${s}%`,this.deviceManager.updateActiveConfig({leftTriggerActuation:s,rightTriggerActuation:s})});const v=e.querySelector("#vib-slider"),d=e.querySelector("#vib-val");v&&v.addEventListener("input",c=>{const s=parseInt(c.target.value,10);d.textContent=`${s}%`,this.deviceManager.updateActiveConfig({vibrationStrength:s})});const l=e.querySelector("#test-vibration-btn");l&&l.addEventListener("click",()=>{const s=(this.deviceManager.getActiveDevice().config.vibrationStrength||80)/100;if(navigator.getGamepads){const p=navigator.getGamepads();for(const o of p)o&&o.vibrationActuator&&o.vibrationActuator.playEffect("dual-rumble",{startDelay:0,duration:400,weakMagnitude:s,strongMagnitude:s})}navigator.vibrate&&navigator.vibrate(300)}),e.querySelectorAll(".paddle-action-select").forEach(c=>{c.addEventListener("change",s=>{const p=s.target.dataset.paddle,u={...this.deviceManager.getActiveDevice().config.paddles||{},[p]:s.target.value};this.deviceManager.updateActiveConfig({paddles:u})})})}startGamepadLoop(e){this.animFrameId&&cancelAnimationFrame(this.animFrameId);const i=e.querySelector("#left-stick-nub"),t=e.querySelector("#right-stick-nub"),n=e.querySelector("#lt-meter-fill"),a=e.querySelector("#rt-meter-fill");if(!i)return;let r=0;const g=()=>{var l,c;const v=navigator.getGamepads?navigator.getGamepads():[];let d=null;for(const s of v)if(s){d=s;break}if(d){const s=(d.axes[0]||0)*22,p=(d.axes[1]||0)*22,o=(d.axes[2]||0)*22,u=(d.axes[3]||0)*22;i.style.transform=`translate(${s}px, ${p}px)`,t.style.transform=`translate(${o}px, ${u}px)`;const f=((l=d.buttons[6])==null?void 0:l.value)||0,m=((c=d.buttons[7])==null?void 0:c.value)||0;n&&(n.style.height=`${f*100}%`),a&&(a.style.height=`${m*100}%`)}else{r+=.03;const s=Math.sin(r)*5,p=Math.cos(r)*5;i.style.transform=`translate(${s}px, ${p}px)`,t.style.transform=`translate(${-s}px, ${-p}px)`}this.animFrameId=requestAnimationFrame(g)};g()}}class ${constructor(e){this.deviceManager=e,this.name="Beleuchtung",this.id="rgb",this.icon="💡",this.animationId=null}isSupported(e){return!0}render(e){const i=this.deviceManager.getActiveDevice(),t=i.config.rgb||{effect:"breathing",color:"#10b981",brightness:100,speed:50,syncEnabled:!1};e.innerHTML=`
      <div class="module-panel">
        <div class="panel-header">
          <div>
            <h2 class="panel-title">RGB & Chroma‑Beleuchtung</h2>
            <p class="panel-desc">Farben, dynamische Lichteffekte und geräteübergreifende Synchronisation</p>
          </div>
        </div>

        <div class="grid-2">
          <!-- RGB Live Preview & Effect Selector -->
          <div class="card-box">
            <div class="card-title">
              <span>Licht‑Vorschau</span>
              <span class="badge-value" id="effect-name-badge">${t.effect.toUpperCase()}</span>
            </div>
            
            <div class="rgb-preview-box" id="rgb-preview-container">
              <div class="rgb-preview-glow" id="rgb-glow-element" style="background: ${t.color};"></div>
              <span style="position: absolute; font-size: 0.75rem; font-weight: 600; color: rgba(255,255,255,0.8);">${i.name}</span>
            </div>

            <div class="card-title" style="margin-top: 10px;">
              <span>Lichteffekt</span>
            </div>
            <select id="rgb-effect-select" class="custom-select">
              <option value="static" ${t.effect==="static"?"selected":""}>Statisch (Static)</option>
              <option value="breathing" ${t.effect==="breathing"?"selected":""}>Atmen (Breathing)</option>
              <option value="wave" ${t.effect==="wave"?"selected":""}>Welle (Wave)</option>
              <option value="spectrum" ${t.effect==="spectrum"?"selected":""}>Farbspektrum (Spectrum)</option>
              <option value="reactive" ${t.effect==="reactive"?"selected":""}>Reaktiv (Reactive)</option>
              <option value="off" ${t.effect==="off"?"selected":""}>Ausgeschaltet (Off)</option>
            </select>
          </div>

          <!-- Color Chooser & Parameters -->
          <div class="card-box">
            <div class="card-title">
              <span>Primärfarbe</span>
            </div>
            
            <div class="color-input-wrapper">
              <input type="color" id="rgb-color-picker" class="color-picker-native" value="${t.color}">
              <div class="color-palette-presets">
                ${["#10b981","#3b82f6","#8b5cf6","#ec4899","#ef4444","#f59e0b","#ffffff"].map(n=>`
                  <button class="palette-btn" data-color="${n}" style="background-color: ${n};" title="${n}"></button>
                `).join("")}
              </div>
            </div>

            <!-- Brightness & Speed -->
            <div class="slider-group" style="margin-top: 12px;">
              <div style="display: flex; justify-content: space-between;">
                <span style="font-size: 0.75rem; color: var(--text-muted);">Helligkeit</span>
                <span style="font-size: 0.75rem; font-weight: 600;" id="brightness-val">${t.brightness}%</span>
              </div>
              <input type="range" min="0" max="100" step="1" value="${t.brightness}" class="range-slider" id="brightness-slider">
            </div>

            <div class="slider-group" style="margin-top: 10px;">
              <div style="display: flex; justify-content: space-between;">
                <span style="font-size: 0.75rem; color: var(--text-muted);">Geschwindigkeit</span>
                <span style="font-size: 0.75rem; font-weight: 600;" id="speed-val">${t.speed}%</span>
              </div>
              <input type="range" min="10" max="100" step="1" value="${t.speed}" class="range-slider" id="speed-slider">
            </div>

            <!-- Global Sync Toggle -->
            <div class="switch-control" style="margin-top: 14px;">
              <div>
                <div class="switch-label">Alle Geräte synchronisieren</div>
                <div style="font-size: 0.725rem; color: var(--text-light);">Farbe & Effekt auf das gesamte Setup übertragen</div>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" id="sync-all-toggle" ${t.syncEnabled?"checked":""}>
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>
      </div>
    `,this.attachEvents(e),this.startAnimation(e)}attachEvents(e){const i=e.querySelector("#rgb-effect-select"),t=e.querySelector("#rgb-color-picker"),n=e.querySelector("#effect-name-badge"),a=e.querySelector("#brightness-slider"),r=e.querySelector("#brightness-val"),g=e.querySelector("#speed-slider"),v=e.querySelector("#speed-val"),d=e.querySelector("#sync-all-toggle"),l=c=>{const s=this.deviceManager.getActiveDevice(),o={...s.config.rgb||{},...c};this.deviceManager.updateActiveConfig({rgb:o}),o.syncEnabled&&(this.deviceManager.getDevices().forEach(u=>{u.id!==s.id&&(u.config.rgb={...u.config.rgb||{},...c,syncEnabled:!0})}),this.deviceManager.saveDevices())};i&&i.addEventListener("change",c=>{const s=c.target.value;n&&(n.textContent=s.toUpperCase()),l({effect:s})}),t&&t.addEventListener("input",c=>{l({color:c.target.value})}),e.querySelectorAll(".palette-btn").forEach(c=>{c.addEventListener("click",()=>{const s=c.dataset.color;t&&(t.value=s),l({color:s})})}),a&&a.addEventListener("input",c=>{const s=parseInt(c.target.value,10);r&&(r.textContent=`${s}%`),l({brightness:s})}),g&&g.addEventListener("input",c=>{const s=parseInt(c.target.value,10);v&&(v.textContent=`${s}%`),l({speed:s})}),d&&d.addEventListener("change",c=>{l({syncEnabled:c.target.checked})})}startAnimation(e){this.animationId&&cancelAnimationFrame(this.animationId);const i=e.querySelector("#rgb-glow-element");if(!i)return;let t=0;const n=()=>{const r=this.deviceManager.getActiveDevice().config.rgb||{effect:"breathing",color:"#10b981",brightness:80,speed:50};if(t+=r.speed/50*.04,r.effect==="off")i.style.opacity="0";else if(r.effect==="static")i.style.background=r.color,i.style.opacity=`${r.brightness/100}`;else if(r.effect==="breathing"){const g=(Math.sin(t)+1)/2;i.style.background=r.color,i.style.opacity=`${(g*(r.brightness/100)).toFixed(2)}`}else if(r.effect==="spectrum"||r.effect==="wave"){const g=t*50%360;i.style.background=`hsl(${g}, 100%, 50%)`,i.style.opacity=`${r.brightness/100}`}else if(r.effect==="reactive"){const g=Math.abs(Math.sin(t*2));i.style.background=r.color,i.style.opacity=`${(g*(r.brightness/100)).toFixed(2)}`}this.animationId=requestAnimationFrame(n)};n()}}class w{constructor(){this.deviceManager=new y,this.modules=[new k(this.deviceManager),new S(this.deviceManager),new x(this.deviceManager),new M(this.deviceManager),new $(this.deviceManager)],this.activeModuleId=null,this.initDOM(),this.bindEvents(),this.autoSelectFirstModule(),this.render(),this.deviceManager.subscribe(()=>{this.renderSidebarDevices(),this.renderModuleNav(),this.renderActiveModule()})}initDOM(){this.deviceSidebarList=document.getElementById("device-sidebar-list"),this.deviceCountBadge=document.getElementById("device-count-badge"),this.moduleNavList=document.getElementById("module-nav-list"),this.mainViewport=document.getElementById("main-viewport"),this.rescanBtn=document.getElementById("rescan-devices-btn"),this.profileInput=document.getElementById("profile-name-input"),this.saveProfileBtn=document.getElementById("save-profile-btn"),this.exportProfileBtn=document.getElementById("export-profile-btn"),this.importProfileBtn=document.getElementById("import-profile-btn"),this.importFileInput=document.getElementById("import-file-input"),this.toastContainer=document.getElementById("toast-container"),this.statusText=document.getElementById("detection-status-text")}bindEvents(){this.rescanBtn.addEventListener("click",async()=>{this.statusText.textContent="Scanne Hardware...";const e=await this.deviceManager.scanHardware();this.statusText.textContent=`${e} Hardware‑Geräte erfasst`,this.showToast(`Hardware‑Scan abgeschlossen (${e} Geräte gefunden).`),this.render()}),this.saveProfileBtn.addEventListener("click",()=>{this.deviceManager.saveDevices(),this.showToast(`Profil "${this.profileInput.value}" erfolgreich gesichert.`)}),this.exportProfileBtn.addEventListener("click",()=>{this.deviceManager.exportActiveProfile(),this.showToast("Antigravity JSON‑Profil exportiert.")}),this.importProfileBtn.addEventListener("click",()=>{this.importFileInput.click()}),this.importFileInput.addEventListener("change",e=>{const i=e.target.files[0];if(!i)return;const t=new FileReader;t.onload=n=>{this.deviceManager.importProfile(n.target.result)?(this.showToast("Profil importiert!"),this.autoSelectFirstModule(),this.render()):this.showToast("Ungültige Profil‑JSON.","error")},t.readAsText(i),e.target.value=""})}autoSelectFirstModule(){const e=this.deviceManager.getActiveDevice(),i=this.modules.filter(t=>t.isSupported(e));i.length>0?i.some(t=>t.id===this.activeModuleId)||(this.activeModuleId=i[0].id):this.activeModuleId=null}render(){this.renderSidebarDevices(),this.renderModuleNav(),this.renderActiveModule()}renderSidebarDevices(){const e=this.deviceManager.getDevices(),i=this.deviceManager.getActiveDevice();this.deviceCountBadge.textContent=e.length,this.deviceSidebarList.innerHTML=e.map(t=>`
      <div class="device-item ${t.id===i.id?"active":""}" data-device-id="${t.id}">
        <div class="device-item-main">
          <span class="device-item-icon">${t.icon}</span>
          <div class="device-item-info">
            <span class="device-item-name">${t.name}</span>
            <span class="device-item-source">${t.source||t.type}</span>
          </div>
        </div>
        <span class="device-live-badge ${t.isDetected?"connected":""}" title="${t.isDetected?"Echte Hardware verbunden":"Virtuelles Profil"}"></span>
      </div>
    `).join(""),this.deviceSidebarList.querySelectorAll(".device-item").forEach(t=>{t.addEventListener("click",()=>{const n=t.dataset.deviceId;this.deviceManager.setActiveDevice(n),this.autoSelectFirstModule(),this.render()})})}renderModuleNav(){const e=this.deviceManager.getActiveDevice(),i=this.modules.filter(t=>t.isSupported(e));!this.activeModuleId&&i.length>0&&(this.activeModuleId=i[0].id),this.moduleNavList.innerHTML=i.map(t=>`
      <button class="module-nav-btn ${t.id===this.activeModuleId?"active":""}" data-module-id="${t.id}">
        <span>${t.icon}</span>
        <span>${t.name}</span>
      </button>
    `).join(""),this.moduleNavList.querySelectorAll(".module-nav-btn").forEach(t=>{t.addEventListener("click",()=>{this.activeModuleId=t.dataset.moduleId,this.renderModuleNav(),this.renderActiveModule()})})}renderActiveModule(){const e=this.deviceManager.getActiveDevice(),i=this.modules.find(t=>t.id===this.activeModuleId&&t.isSupported(e));i?i.render(this.mainViewport):this.mainViewport.innerHTML=`
        <div style="display: flex; height: 100%; min-height: 300px; align-items: center; justify-content: center; color: var(--text-muted);">
          Kein aktives Modul für dieses Gerät ausgewählt.
        </div>
      `}showToast(e,i="success"){const t=document.createElement("div");t.className="toast",t.innerHTML=`<span>${i==="success"?"✓":"⚠"}</span> <span>${e}</span>`,this.toastContainer.appendChild(t),setTimeout(()=>{t.style.opacity="0",t.style.transform="translateY(8px)",t.style.transition="all 0.3s ease",setTimeout(()=>t.remove(),300)},2800)}}document.addEventListener("DOMContentLoaded",()=>{new w});
