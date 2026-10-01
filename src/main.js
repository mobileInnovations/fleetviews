// Composables
import { createApp } from "vue";

// Plugins
import { registerPlugins } from "./plugins/index.ts";

// Components
import App from "./App.vue";

const app = createApp(App);

registerPlugins(app);

app.mount("#app");
