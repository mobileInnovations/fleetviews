<template>
  <v-app>
    <v-main>
      <Monitor
        :appEnv="appEnv"
        :ch="ch"
        :serial="serial"
        :vdotype="vdotype"
        :token="token"
      />
    </v-main>
  </v-app>
</template>

<script setup>
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
</script>
