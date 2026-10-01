<template>
  <v-app>
    <v-main>
      <Monitor :serial="serial" :vdotype="vdotype" :token="token" />
    </v-main>
  </v-app>
</template>

<script setup>
import Monitor from "./components/Monitor.vue";

// https://fleetviews.mobileinnovation.asia/RealVideo?deviceId=31082500070&chs=1&token=7051e1d9b64d4b40b2e7bca6af1d1752
// ---------------- NEW ----------------- //
// https://fleetview/video?serial=31082500070&vdotype=live&token=dmVuZG9yLWFzaWEuYy1tb2JpbGVpbm5vdmF0aW9uLXNlbmRfbG9jYXRpb246cWp1S3Rsa3VKc3J0SVRzRHU2Y3ROT1VJQkpacnBCejU=
// https://fleetview/video?serial=31082500070&vdotype=playback&token=dmVuZG9yLWFzaWEuYy1tb2JpbGVpbm5vdmF0aW9uLXNlbmRfbG9jYXRpb246cWp1S3Rsa3VKc3J0SVRzRHU2Y3ROT1VJQkpacnBCejU=

// http://localhost:6060/video?token=dmVuZG9yLWFzaWEuYy1tb2JpbGVpbm5vdmF0aW9uLXNlbmRfbG9jYXRpb246cWp1S3Rsa3VKc3J0SVRzRHU2Y3ROT1VJQkpacnBCejU%3D&serial=31082500070&vdotype=live

const params = new URLSearchParams(window.location.search);
const urlParams = Object.fromEntries(params.entries());

const { serial, vdotype, token } = urlParams;
</script>
