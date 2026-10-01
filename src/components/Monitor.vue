<template>
  <div class="root">
    <!-- Top Bar -->
    <div class="top-bar">
      <span class="lbl">Show:</span>
      <div class="mode-group">
        <v-btn
          v-for="m in modes"
          :key="m.value"
          :variant="showMode === m.value ? 'tonal' : 'outlined'"
          size="small"
          @click="showMode = m.value"
        >
          {{ m.label }}
        </v-btn>
      </div>
    </div>
    <!-- Panels -->
    <div class="panels">
      <!-- Real Time Panel -->
      <div v-if="showMode !== 'Playback'" class="panel">
        <h2>Real time</h2>
        <div class="video-box">
          <iframe
            ref="rtVideoFrame"
            :src="videoSrc"
            frameborder="0"
            allow="autoplay; fullscreen"
          />
        </div>
        <div class="d-flex align-center meta-row">
          <div class="link-wrap">
            <a
              v-if="videoSrc"
              :href="videoSrc"
              target="_blank"
              rel="noopener noreferrer"
              class="external-link"
            >
              Link Video
            </a>

            <span v-else>No video URL provided</span>
          </div>

          <v-spacer />

          <div class="text-token">Token: {{ payloadState.token }}</div>
        </div>

        <v-row>
          <v-col cols="12" md="6">
            <div class="field">
              <label>Device ID</label>
              <v-text-field
                v-model="payloadState.deviceId"
                density="compact"
                hide-details
                variant="outlined"
              />
            </div>
          </v-col>
          <v-col cols="12" md="6">
            <div class="field">
              <label>Channel</label>
              <v-text-field
                v-model="payloadState.chs"
                density="compact"
                hide-details
                variant="outlined"
              />
            </div>
          </v-col>
        </v-row>
        <v-row>
          <div class="btns">
            <v-btn
              :color="rtState === 'play' ? 'primary' : undefined"
              :variant="rtState === 'play' ? 'tonal' : 'outlined'"
              icon
              size="small"
              aria-label="Play"
              title="Play"
              @click="rtAction('play')"
            >
              <v-icon>mdi-play</v-icon>
            </v-btn>
            <v-btn
              :color="rtState === 'pause' ? 'primary' : undefined"
              :variant="rtState === 'pause' ? 'tonal' : 'outlined'"
              icon
              size="small"
              aria-label="Pause"
              title="Pause"
              @click="rtAction('pause')"
            >
              <v-icon>mdi-pause</v-icon>
            </v-btn>
            <v-btn
              :color="rtState === 'stop' ? 'error' : undefined"
              :variant="rtState === 'stop' ? 'tonal' : 'outlined'"
              icon
              size="small"
              aria-label="Stop"
              title="Stop"
              @click="rtAction('stop')"
            >
              <v-icon>mdi-stop</v-icon>
            </v-btn>

            <v-divider vertical class="mx-1 divider" />

            <v-btn
              :color="rtSound ? 'primary' : undefined"
              :variant="rtSound ? 'tonal' : 'outlined'"
              icon
              size="small"
              :aria-label="rtSound ? 'Sound on' : 'Sound off'"
              :title="rtSound ? 'Sound on' : 'Sound off'"
              @click="rtSound = !rtSound"
            >
              <v-icon>{{
                rtSound ? "mdi-volume-high" : "mdi-volume-off"
              }}</v-icon>
            </v-btn>
            <v-btn
              icon
              size="small"
              variant="outlined"
              aria-label="Screenshot"
              title="Screenshot"
            >
              <v-icon>mdi-camera</v-icon>
            </v-btn>
            <v-btn
              icon
              size="small"
              variant="outlined"
              aria-label="Fullscreen"
              title="Fullscreen"
              @click="fullscreenVideo(rtVideoFrame)"
            >
              <v-icon>mdi-fullscreen</v-icon>
            </v-btn>
          </div></v-row
        >
      </div>

      <!-- Playback Panel -->
      <div v-if="showMode !== 'RealVideo'" class="panel">
        <h2>Playback</h2>
        <div class="video-box">
          <iframe
            ref="pbVideoFrame"
            :src="videoSrc"
            frameborder="0"
            allow="autoplay; fullscreen"
          />
        </div>
        <div class="meta-row">
          <a
            v-if="videoSrc"
            :href="videoSrc"
            target="_blank"
            rel="noopener noreferrer"
            class="external-link"
          >
            link video
          </a>

          <span v-else> No video URL provided </span>
        </div>

        <!-- Info Control -->
        <v-row>
          <v-col cols="12" md="6">
            <div class="field">
              <label>Device ID</label>
              <v-text-field
                v-model="payloadState.deviceId"
                density="compact"
                hide-details
                variant="outlined"
              />
            </div>
          </v-col>
          <v-col cols="12" md="6">
            <div class="field">
              <label>Channel</label>
              <v-text-field
                v-model="payloadState.chs"
                density="compact"
                hide-details
                variant="outlined"
              />
            </div>
          </v-col>

          <v-col cols="12" md="6">
            <div class="field">
              <label>Start time</label>
              <DateTimeComponent v-model="payloadState.startTime" />
            </div>
          </v-col>
          <v-col cols="12" md="6">
            <div class="field">
              <label>End time</label>
              <DateTimeComponent v-model="payloadState.endTime" />
            </div>
          </v-col>
        </v-row>

        <!-- Buttons Controls -->
        <v-row>
          <div class="btns">
            <v-btn
              :color="pbState === 'play' ? 'primary' : undefined"
              :variant="pbState === 'play' ? 'tonal' : 'outlined'"
              icon
              size="small"
              aria-label="Playback"
              title="Playback"
              @click="pbAction('play')"
            >
              <v-icon>mdi-play</v-icon>
            </v-btn>
            <v-btn
              :color="pbState === 'pause' ? 'primary' : undefined"
              :variant="pbState === 'pause' ? 'tonal' : 'outlined'"
              icon
              size="small"
              aria-label="Pause"
              title="Pause"
              @click="pbAction('pause')"
            >
              <v-icon>mdi-pause</v-icon>
            </v-btn>
            <v-btn
              :color="pbState === 'stop' ? 'error' : undefined"
              :variant="pbState === 'stop' ? 'tonal' : 'outlined'"
              icon
              size="small"
              aria-label="Stop"
              title="Stop"
              @click="pbAction('stop')"
            >
              <v-icon>mdi-stop</v-icon>
            </v-btn>

            <v-divider vertical class="mx-1 divider" />

            <div class="speed-group">
              <v-btn
                v-for="s in speeds"
                :key="s"
                :color="pbSpeed === s ? 'primary' : undefined"
                :variant="pbSpeed === s ? 'tonal' : 'outlined'"
                size="small"
                :aria-label="`Speed ×${s}`"
                :title="`×${s}`"
                @click="pbSpeed = s"
              >
                ×{{ s }}
              </v-btn>
            </div>

            <v-divider vertical class="mx-1 divider" />

            <v-btn
              :color="pbSound ? 'primary' : undefined"
              :variant="pbSound ? 'tonal' : 'outlined'"
              icon
              size="small"
              :aria-label="pbSound ? 'Sound on' : 'Sound off'"
              :title="pbSound ? 'Sound on' : 'Sound off'"
              @click="pbSound = !pbSound"
            >
              <v-icon>{{
                pbSound ? "mdi-volume-high" : "mdi-volume-off"
              }}</v-icon>
            </v-btn>
            <v-btn
              icon
              size="small"
              variant="outlined"
              aria-label="Screenshot"
              title="Screenshot"
            >
              <v-icon>mdi-camera</v-icon>
            </v-btn>
            <v-btn
              icon
              size="small"
              variant="outlined"
              aria-label="Fullscreen"
              title="Fullscreen"
              @click="fullscreenVideo(pbVideoFrame)"
            >
              <v-icon>mdi-fullscreen</v-icon>
            </v-btn>
          </div>
        </v-row>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from "vue";
import DateTimeComponent from "./input/DateTimeComponent.vue";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

const props = defineProps({
  videoType: {
    type: String,
    default: "",
  },
  payload: {
    type: Object,
    default: () => ({}),
  },
});

const modes = [
  { label: "Real time", value: "RealVideo" },
  { label: "Playback", value: "Playback" },
];

const speeds = [0, 1, 2, 4, 8, 16];

// ── State ─────────────────────────────────────────────────────────────────────
const showMode = ref("RealVideo"); // "RealVideo" | "Playback"

const rtState = ref("play"); // "play" | "pause" | "stop"
const rtSound = ref(true);

const pbState = ref("play"); // "play" | "pause" | "stop"
const pbSound = ref(true);
const pbSpeed = ref(1);

const rtVideoFrame = ref(null);
const pbVideoFrame = ref(null);

const payloadState = reactive({
  deviceId: props.payload.deviceId || "",
  chs: props.payload.chs || "",
  startTime: props.payload.startTime || "",
  endTime: props.payload.endTime || "",

  serial: props.payload.serial || "",
  vdotype: props.payload.vdotype || "",
  token: props.payload.token || "",
});

const videoSrc = ref(
  `https://superhero.mobileinnovation.asia/vss/apiPage/${showMode.value}.html?token=${payloadState.token}&deviceId=${payloadState.deviceId}&chs=${payloadState.chs}&stream=0&wnum=1&panel=1&buffer=2000`,
);

const updateUrl = () => {
  // https://fleetviews.mobileinnovation.asia/RealVideo?deviceId=31082500070&chs=1&token=7051e1d9b64d4b40b2e7bca6af1d1752
  // ---------------- NEW ----------------- //
  // https://fleetview/video?serial=123456&vdotype=live&token=abc
  // https://fleetview/video?serial=123456&vdotype=playback&token=abc
  // -------------------------------------- //
  const params = new URLSearchParams();

  if (payloadState.deviceId) params.set("deviceId", payloadState.deviceId);
  if (payloadState.chs) params.set("chs", payloadState.chs);
  if (payloadState.startTime) params.set("startTime", payloadState.startTime);
  if (payloadState.endTime) params.set("endTime", payloadState.endTime);

  if (payloadState.token) params.set("token", payloadState.token);
  if (payloadState.serial) params.set("serial", payloadState.serial);
  if (payloadState.vdotype) params.set("vdotype", payloadState.vdotype);

  const query = params.toString();

  const newUrl =
    `${showMode.value}` +
    `${query ? `?${query}` : ""}` +
    `${window.location.hash}`;

  console.log("Updating URL to:", newUrl);

  window.history.replaceState(null, "", newUrl);
};

const RT_MESSAGE_TYPE = {
  play: "PLAY_VIDEO",
  pause: "PAUSE_VIDEO",
  stop: "STOP_VIDEO",
};

const rtAction = (state) => {
  rtState.value = state;
  rtVideoFrame.value?.contentWindow?.postMessage(
    { type: RT_MESSAGE_TYPE[state] },
    "*",
  );
};

const pbAction = (state) => {
  pbState.value = state;
  pbVideoFrame.value?.contentWindow?.postMessage(
    { type: RT_MESSAGE_TYPE[state] },
    "*",
  );
};

const initialize = () => {
  if (props.videoType === "RealVideo") {
    showMode.value = "RealVideo";
  } else if (props.videoType === "Playback") {
    showMode.value = "Playback";
  }
  updateUrl();
};

window.addEventListener("message", (event) => {
  console.log("Received message from iframe:", event);
  if (event.data?.type === "STOP_VIDEO") {
    const video = document.querySelector("video");

    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  }
});

const fullscreenVideo = (frame) => {
  const el = frame?.value;
  if (!el) return;

  if (el.requestFullscreen) {
    el.requestFullscreen();
  } else if (el.webkitRequestFullscreen) {
    // Safari
    el.webkitRequestFullscreen();
  }
};

watch(
  [
    () => payloadState.deviceId,
    () => payloadState.chs,
    () => payloadState.startTime,
    () => payloadState.endTime,
    () => payloadState.token,
    () => showMode.value,
    () => pbSpeed.value,
  ],
  () => {
    console.log("payloadState changed", payloadState);

    updateUrl();

    if (showMode.value === "Playback") {
      const st = dayjs(payloadState.startTime, "YYYYMMDDHHmmss").format(
        "YYYYMMDDHHmmss",
      );

      const et = dayjs(payloadState.endTime, "YYYYMMDDHHmmss").format(
        "YYYYMMDDHHmmss",
      );

      videoSrc.value =
        `https://superhero.mobileinnovation.asia/vss/apiPage/ReplayVideo.html` +
        `?token=${payloadState.token}` +
        `&deviceId=${payloadState.deviceId}` +
        `&chs=${payloadState.chs}` +
        `&wnum=1` +
        `&panel=1` +
        `&buffer=2000` +
        `&st=${st}` +
        `&et=${et}` +
        `&speed=${pbSpeed.value}`;
    } else {
      videoSrc.value =
        `https://superhero.mobileinnovation.asia/vss/apiPage/${showMode.value}.html` +
        `?token=${payloadState.token}` +
        `&deviceId=${payloadState.deviceId}` +
        `&chs=${payloadState.chs}` +
        `&stream=0` +
        `&wnum=1` +
        `&panel=1` +
        `&buffer=2000`;
    }
  },
  { deep: true },
);

onMounted(() => {
  initialize();
});
</script>

<style scoped>
.root {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px;
  height: 100vh;
  overflow: hidden; /* was implicit; now enforced */
  font-family: Arial, sans-serif;
  box-sizing: border-box;
}

.root * {
  box-sizing: border-box;
}

/* ── Top bar ─────────────────────────────────────────── */
.top-bar {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  padding: 8px 12px;
  background: #f5f7fa;
  border: 1px solid #e1e5eb;
  border-radius: 10px;
  flex-shrink: 0;
}

.lbl {
  font-size: 12px;
  font-weight: 600;
  color: #334155;
  white-space: nowrap;
}

.mode-group {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

/* ── Panels grid ─────────────────────────────────────── */
.panels {
  min-width: 50%;
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
  flex: 1;
  min-height: 0;
}

/* ── Individual panel ────────────────────────────────── */
.panel {
  background: #fff;
  border: 1px solid #e1e5eb;
  border-radius: 12px;
  padding: 10px;
  min-width: 0;
  min-height: 0; /* lets flex children shrink instead of overflowing */
  overflow-y: auto; /* was overflow: hidden */
}

.panel h2 {
  font-size: 13px;
  font-weight: 600;
  color: #64748b;
  flex-shrink: 0;
  margin: 0;
}

/* ── Video (16:9 landscape) ───────────────────────────── */
.video-box {
  width: 100%;
  aspect-ratio: 16 / 9;
  background: #000;
  overflow: hidden;
  position: relative;
}

.video-box iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
}

/* ── Meta row (link + token) ──────────────────────────── */
.meta-row {
  flex-shrink: 0;
  flex-wrap: wrap;
  row-gap: 2px;
}

.link-wrap {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ── Fields ──────────────────────────────────────────── */
.fields {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 6px;
  flex-shrink: 0;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.field label {
  font-size: 11px;
  color: #64748b;
}

/* ── Button row ──────────────────────────────────────── */
.btns {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
  flex-shrink: 0;
}

.speed-group {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.divider {
  align-self: stretch;
  height: auto;
}

/* Touch-friendly tap targets on coarse pointers (mobile/tablet) */
@media (pointer: coarse) {
  .btns :deep(.v-btn) {
    min-width: 40px;
    min-height: 40px;
  }
}

/* ── Responsive breakpoints ──────────────────────────── */

/* Large tablet / small laptop: tighten side margins, keep 2-col */
@media (max-width: 1200px) {
  .panels {
    max-width: 100%;
  }
}

/* Tablet: stack panels */
@media (max-width: 960px) {
  .root {
    height: auto;
    min-height: 100vh;
  }

  .panels {
    grid-template-columns: 1fr;
  }
}

/* Mobile: single-column fields, wrapped top bar, larger tap targets */
@media (max-width: 640px) {
  .root {
    padding: 6px;
    gap: 6px;
  }

  .fields {
    grid-template-columns: 1fr;
  }

  .top-bar {
    justify-content: space-between;
  }

  .mode-group :deep(.v-btn) {
    flex: 1;
  }

  .meta-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  .text-token {
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .btns {
    justify-content: flex-start;
  }
}

/* Very small phones: shrink panel padding */
@media (max-width: 380px) {
  .panel {
    padding: 8px;
  }
}

.external-link {
  font-size: 12px;
  color: #3b82f6;
  text-decoration: none;
}

.text-token {
  font-size: 12px;
  color: #64748b;
}
</style>
