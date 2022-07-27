import { defineManifest } from "@crxjs/vite-plugin";

export default defineManifest({
  name: "Pins",
  description: "Pin any reminder on your cursor",
  version: "0.0.1",
  manifest_version: 3,
  icons: {
    16: "img/favicon-16x16.png",
    32: "img/favicon-32x32.png",
    128: "img/favicon-128x128.png",
    192: "img/favicon-192x192.png",
    512: "img/favicon-512x512.png",
  },
  action: {
    default_popup: "popup.html",
    default_icon: "img/favicon-32x32.png",
  },
  options_page: "options.html",
  background: {
    service_worker: "src/background/index.ts",
    type: "module",
  },
  content_scripts: [
    {
      matches: ["http://*/*", "https://*/*"],
      js: ["src/content/index.ts"],
    },
  ],
  web_accessible_resources: [
    {
      resources: [
        "img/favicon-16x16.png",
        "img/favicon-32x32.png",
        "img/favicon-128x128.png",
        "img/favicon-192x192.png",
        "img/favicon-512x512.png",
      ],
      matches: [],
    },
  ],
  permissions: ["storage"],
});
