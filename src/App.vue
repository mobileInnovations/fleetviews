<template>
  <v-app>
    <v-main>
      <div class="app-shell">
        <!-- Tab Bar -->
        <div class="tab-bar">
          <div class="tab-list" role="tablist">
            <div
              v-for="(tab, index) in tabs"
              :key="tab.id"
              role="tab"
              tabindex="0"
              :aria-selected="tab.id === activeTab"
              :title="tab.title || `Tab ${index + 1}`"
              :class="['chrome-tab', { active: tab.id === activeTab }]"
              @click="activeTab = tab.id"
              @keydown.enter="activeTab = tab.id"
              @mousedown.middle.prevent="closeTab(tab.id)"
            >
              <v-icon size="16" class="chrome-tab-icon">mdi-cctv</v-icon>
              <span class="chrome-tab-title">
                {{ tab.title || `Tab ${index + 1}` }}
              </span>
              <button
                v-if="tabs.length > 1"
                type="button"
                class="chrome-tab-close"
                aria-label="Close tab"
                title="Close tab"
                @click.stop="closeTab(tab.id)"
              >
                <v-icon size="14">mdi-close</v-icon>
              </button>
            </div>
            <button
              type="button"
              class="chrome-tab-new"
              aria-label="New tab"
              title="New tab"
              @click="openAddDialog"
            >
              <v-icon size="18">mdi-plus</v-icon>
            </button>
          </div>
        </div>

        <!-- Add Device Dialog -->
        <v-dialog v-model="addDialog" max-width="400">
          <v-card title="Add device">
            <v-card-text>
              <v-text-field
                v-model="newSerial"
                label="Device ID (serial)"
                density="compact"
                variant="outlined"
                autofocus
                hide-details
                @keyup.enter="confirmAddTab"
              />
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn variant="text" @click="addDialog = false">Cancel</v-btn>
              <v-btn
                color="primary"
                variant="tonal"
                :disabled="!newSerial.trim()"
                @click="confirmAddTab"
              >
                Open
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- Tab Content (kept alive so each video keeps its state) -->
        <div class="tab-content">
          <div
            v-for="tab in tabs"
            v-show="tab.id === activeTab"
            :key="tab.id"
            class="tab-pane"
          >
            <Monitor
              :appEnv="appEnv"
              :ch="tab.ch"
              :serial="tab.serial"
              :vdotype="vdotype"
              :token="token"
              :active="tab.id === activeTab"
              @update-title="(title) => (tab.title = title)"
            />
          </div>
        </div>
      </div>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from "vue";
import Monitor from "./components/Monitor.vue";
import AlertComponent from "./components/AlertComponent";

const appEnv = import.meta.env.VITE_APP_ENV;

console.log("appEnv:", appEnv);
// ---------------- NEW ----------------- //
// https://fleetview/video?ch=1&serial=31082500070&vdotype=live&token=dmVuZG9yLWFzaWEuYy1tb2JpbGVpbm5vdmF0aW9uLXNlbmRfbG9jYXRpb246cWp1S3Rsa3VKc3J0SVRzRHU2Y3ROT1VJQkpacnBCejU=
// https://fleetview/video?ch=1&serial=31082500070&vdotype=playback&token=dmVuZG9yLWFzaWEuYy1tb2JpbGVpbm5vdmF0aW9uLXNlbmRfbG9jYXRpb246cWp1S3Rsa3VKc3J0SVRzRHU2Y3ROT1VJQkpacnBCejU=

// http://localhost:6060/video?ch=1&token=dmVuZG9yLWFzaWEuYy1tb2JpbGVpbm5vdmF0aW9uLXNlbmRfbG9jYXRpb246cWp1S3Rsa3VKc3J0SVRzRHU2Y3ROT1VJQkpacnBCejU%3D&serial=31082500070&vdotype=live

const params = new URLSearchParams(window.location.search);
const urlParams = Object.fromEntries(params.entries());

const { ch, serial, vdotype, token } = urlParams;

if (!ch || !serial || !vdotype || !token) {
  AlertComponent.info(
    "Missing required parameters",
    `Please provide <b>'ch'</b>, <b>'serial'</b>, <b>'vdotype'</b>, and <b>'token'</b> in the URL.<br><br>`,
  );
}

// ── Tabs (1 tab = 1 device) ───────────────────────────────────────────────────
let nextTabId = 1;
const createTab = (tabSerial, tabCh = "1") => ({
  id: nextTabId++,
  serial: tabSerial || "",
  ch: tabCh,
  title: "",
});

const tabs = ref([createTab(serial, ch)]);
const activeTab = ref(tabs.value[0].id);

const addDialog = ref(false);
const newSerial = ref("");

const openAddDialog = () => {
  newSerial.value = "";
  addDialog.value = true;
};

const confirmAddTab = () => {
  const value = newSerial.value.trim();
  if (!value) return;

  // Device already open → just switch to its tab
  const existing = tabs.value.find((t) => t.serial === value);
  if (existing) {
    activeTab.value = existing.id;
  } else {
    const tab = createTab(value);
    tabs.value.push(tab);
    activeTab.value = tab.id;
  }

  addDialog.value = false;
};

const closeTab = (id) => {
  if (tabs.value.length <= 1) return;

  const index = tabs.value.findIndex((t) => t.id === id);
  if (index === -1) return;

  tabs.value.splice(index, 1);

  if (activeTab.value === id) {
    const fallback = tabs.value[Math.max(0, index - 1)];
    activeTab.value = fallback.id;
  }
};
</script>

<style scoped>
.app-shell {
  display: flex;
  flex-direction: column;
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
}

/* ── Chrome-style tab strip ─────────────────────────────────────────────── */
.tab-bar {
  --tab-strip-bg: rgba(var(--v-theme-primary), 0.14);
  --tab-active-bg: rgb(var(--v-theme-surface));
  --tab-radius: 10px;

  display: flex;
  align-items: flex-end;
  padding: 8px 8px 0;
  background: var(--tab-strip-bg);
  flex-shrink: 0;
}

.tab-list {
  display: flex;
  align-items: flex-end;
  min-width: 0;
  flex: 1;
  overflow-x: auto;
  scrollbar-width: none;
  /* room for the active tab's outer curves */
  padding: 0 var(--tab-radius);
}

.tab-list::-webkit-scrollbar {
  display: none;
}

.chrome-tab {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 0 1 240px;
  min-width: 56px;
  height: 36px;
  padding: 0 8px 0 12px;
  border-radius: var(--tab-radius) var(--tab-radius) 0 0;
  color: rgba(var(--v-theme-on-surface), 0.8);
  font-size: 13px;
  cursor: pointer;
  user-select: none;
  outline: none;
}

/* thin divider between inactive tabs */
.chrome-tab:not(:first-child)::before {
  content: "";
  position: absolute;
  left: 0;
  top: 10px;
  bottom: 10px;
  width: 1px;
  background: rgba(var(--v-theme-on-surface), 0.25);
}

.chrome-tab.active::before,
.chrome-tab.active + .chrome-tab::before,
.chrome-tab:hover::before,
.chrome-tab:hover + .chrome-tab::before {
  opacity: 0;
}

.chrome-tab:hover:not(.active) {
  background: rgba(var(--v-theme-surface), 0.5);
}

.chrome-tab:focus-visible {
  box-shadow: inset 0 0 0 2px rgb(var(--v-theme-primary));
}

.chrome-tab.active {
  z-index: 1;
  background: var(--tab-active-bg);
  color: rgb(var(--v-theme-on-surface));
}

/* inverse curves that blend the active tab into the content area */
.chrome-tab.active::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: calc(var(--tab-radius) * -1);
  right: calc(var(--tab-radius) * -1);
  height: var(--tab-radius);
  pointer-events: none;
  background:
    radial-gradient(
        circle at 0 0,
        transparent calc(var(--tab-radius) - 0.5px),
        var(--tab-active-bg) var(--tab-radius)
      )
      left bottom / var(--tab-radius) var(--tab-radius) no-repeat,
    radial-gradient(
        circle at 100% 0,
        transparent calc(var(--tab-radius) - 0.5px),
        var(--tab-active-bg) var(--tab-radius)
      )
      right bottom / var(--tab-radius) var(--tab-radius) no-repeat;
}

.chrome-tab-icon {
  flex-shrink: 0;
  color: rgb(var(--v-theme-primary));
}

.chrome-tab-title {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.chrome-tab-close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: inherit;
}

.chrome-tab-close:hover {
  background: rgba(var(--v-theme-on-surface), 0.12);
}

.chrome-tab-new {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  margin: 0 0 4px 6px;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: rgba(var(--v-theme-on-surface), 0.8);
}

.chrome-tab-new:hover {
  background: rgba(var(--v-theme-on-surface), 0.1);
}

.tab-content {
  flex: 1;
  min-height: 0;
}

.tab-pane {
  height: 100%;
}
</style>

<style>
/* Lock the page to the viewport; content fits instead of scrolling */
html,
body {
  height: 100%;
  overflow: hidden;
}
</style>
