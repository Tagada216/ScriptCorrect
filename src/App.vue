<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <TextCorrector />
    <OllamaSetupGuide />
  </div>
</template>

<script setup>
import OllamaSetupGuide from "./components/OllamaSetupGuide.vue";
import TextCorrector from "./components/TextCorrector.vue";
</script>

<style>
:root {
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  height: 100%;
  width: 100%;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica,
    Arial, sans-serif;
  line-height: 1.5;
  -webkit-text-size-adjust: 100%;
}

#app {
  height: 100%;
  width: 100%;
}

.min-h-screen {
  min-height: 100vh;
}

@media (prefers-color-scheme: dark) {
  body {
    background-color: #1a1a1a;
    color: #ffffff;
  }
}

/* Transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
</style>
