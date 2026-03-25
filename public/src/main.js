// src/main.js
import App from "./app/App.js";

window.addEventListener("DOMContentLoaded", () => {
  window.app = new App();
  console.log("App ready. You can now layer more JS onto window.app.");
});
