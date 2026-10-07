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
          @click="switchMode(m.value)"
        >
          {{ m.label }}
        </v-btn>
      </div>
      <v-spacer />
      <div class="app-env">mode: {{ appEnv }}</div>
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
          <span class="text-token">Token: {{ fleetviewState.token }}</span>
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
        </div>

        <v-row>
          <v-col cols="12" md="6">
            <div class="field">
              <label>Device ID</label>
              <v-text-field
                v-model="heroParams.deviceId"
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
                v-model="heroParams.chs"
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
                v-model="heroParams.deviceId"
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
                v-model="heroParams.chs"
                density="compact"
                hide-details
                variant="outlined"
              />
            </div>
          </v-col>

          <v-col cols="12" md="6">
            <div class="field">
              <label>Start time</label>
              <DateTimeComponent v-model="heroParams.startTime" />
            </div>
          </v-col>
          <v-col cols="12" md="6">
            <div class="field">
              <label>End time</label>
              <DateTimeComponent v-model="heroParams.endTime" />
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
import {
  getDeviceCameraInfo,
  getVideoSystemById,
  genNewTokenFromHero,
  updateNewToken,
  checkToken,
} from "@/stores/api.js";
import AlertComponent from "@/components/AlertComponent.js";

dayjs.extend(customParseFormat);

const props = defineProps({
  appEnv: {
    type: String,
    default: "",
  },
  ch: {
    type: String,
    default: "1",
  },
  serial: {
    type: String,
    default: "",
  },
  vdotype: {
    type: String,
    default: "live", // "live" | "playback"
  },
  token: {
    type: String,
    default: "",
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

const fleetviewState = reactive({
  serial: props.serial || "",
  vdotype: props.vdotype || "",
  token: props.token || "",
  ch: props.ch || "",
});

const heroParams = reactive({
  deviceId: props.serial || "",
  chs: props.ch || "1",
  startTime: dayjs().subtract(1, "hour").format("YYYYMMDDHHmmss"),
  endTime: dayjs().format("YYYYMMDDHHmmss"),
  apiToken: "",
});

const videoSrc = ref(
  `https://superhero.mobileinnovation.asia/vss/apiPage/${showMode.value}.html?token=${heroParams.apiToken}&deviceId=${heroParams.deviceId}&chs=${heroParams.chs}&stream=0&wnum=1&panel=1&buffer=2000`,
);

const updateUrl = () => {
  const params = new URLSearchParams();
  if (heroParams.chs) params.set("ch", heroParams.chs);
  if (heroParams.deviceId) params.set("serial", heroParams.deviceId);
  if (fleetviewState.vdotype) params.set("vdotype", fleetviewState.vdotype);
  if (fleetviewState.token) params.set("token", fleetviewState.token);

  const query = params.toString();

  const newUrl =
    "video" + `${query ? `?${query}` : ""}` + `${window.location.hash}`;

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
  if (props.vdotype === "live") {
    showMode.value = "RealVideo";
  } else if (props.vdotype === "playback") {
    showMode.value = "Playback";
  }
  updateUrl();
  fetchDeviceCameraInfo();
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
    () => heroParams.deviceId,
    () => heroParams.chs,
    () => heroParams.startTime,
    () => heroParams.endTime,
    () => heroParams.token,
    () => showMode.value,
    () => pbSpeed.value,
  ],
  () => {
    updateUrl();

    if (showMode.value === "Playback") {
      const st = dayjs(heroParams.startTime, "YYYYMMDDHHmmss").format(
        "YYYYMMDDHHmmss",
      );

      const et = dayjs(heroParams.endTime, "YYYYMMDDHHmmss").format(
        "YYYYMMDDHHmmss",
      );

      videoSrc.value =
        `https://superhero.mobileinnovation.asia/vss/apiPage/ReplayVideo.html` +
        `?token=${heroParams.token}` +
        `&deviceId=${heroParams.deviceId}` +
        `&chs=${heroParams.chs}` +
        `&wnum=1` +
        `&panel=1` +
        `&buffer=2000` +
        `&st=${st}` +
        `&et=${et}` +
        `&speed=${pbSpeed.value}`;
    } else {
      videoSrc.value =
        `https://superhero.mobileinnovation.asia/vss/apiPage/${showMode.value}.html` +
        `?token=${heroParams.token}` +
        `&deviceId=${heroParams.deviceId}` +
        `&chs=${heroParams.chs}` +
        `&stream=0` +
        `&wnum=1` +
        `&panel=1` +
        `&buffer=2000`;
    }
  },
  { deep: true },
);

const fetchDeviceCameraInfo = async () => {
  try {
    await getDeviceCameraInfo(fleetviewState.serial, fleetviewState.token)
      .then(async (res) => {
        if (res.success) {
          heroParams.chs = res.data.VideoSystemId;
          await fetchVideoSystemInfo(res.data.VideoSystemId);
        } else {
          console.error(res.error || "Failed to fetch device camera info");
        }
      })
      .catch((error) => {
        console.error("Error fetching device camera info:", error);
      });
  } catch (error) {
    console.error("Error fetching device camera info:", error);
  }
};

const fetchVideoSystemInfo = async (id) => {
  try {
    const { success, data } = await getVideoSystemById(id);
    console.log("Video system info:", { success, data });
    if (success) {
      if (!data.ApiToken || data.ApiTokenExpire < Date.now()) {
        const newToken = await genNewTokenAPI(data.Username, data.Password);
        // Update the video system with the new token
        await updateNewToken(id, newToken);
      } else {
        heroParams.token = data.ApiToken;
      }
    } else {
      AlertComponent.error(
        "Failed to fetch video system info",
        data.error || "Unknown error",
      );
      console.error(data.error || "Failed to fetch video system info");
    }
    return { success, data };
  } catch (error) {
    console.error("Error fetching video system info:", error);
    throw error;
  }
};

const genNewTokenAPI = async (username, password) => {
  // {status: 10000, msg: "Success", error: null, data: {token: "e9f23d1cd3ad45538db77ad3816e5988",…},…}

  try {
    const response = await genNewTokenFromHero(username, password);
    console.log("New token response:", response);
    if (response.success) {
      return response.token || "";
    } else {
      AlertComponent.error(
        "Failed to generate new API token",
        response.message || "Unknown error",
      );
    }
  } catch (error) {
    console.error("Error generating new token:", error);
    throw error;
  }
};

const switchMode = (mode) => {
  showMode.value = mode;
  fleetviewState.vdotype = mode === "RealVideo" ? "live" : "playback";
};

const verifyToken = async () => {
  if (!fleetviewState.token) {
    console.warn("No token available to check.");
    return;
  }

  try {
    await checkToken(fleetviewState.token);
  } catch (error) {
    if (error.response?.status === 404) {
      const message = error.response?.data?.message || "Token not found";

      AlertComponent.error("Invalid Token", `${message} [${fleetviewState.token}]`);
      return;
    }

    console.error("Error checking token:", error);
    AlertComponent.error("Error", "Unable to verify token. Please try again.");
  }
};

onMounted(() => {
  verifyToken();
  initialize();
});
</script>

<style scoped>
.app-env {
  font-size: 12px;
  color: #64748b;
}

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
    font-size: 8px;

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
  font-size: 8px;
  color: #64748b;
}
</style>
