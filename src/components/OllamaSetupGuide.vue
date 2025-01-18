<template>
  <div
    v-if="showGuide"
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
  >
    <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-lg w-full m-4">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">
          Configuration d'Ollama nécessaire
        </h2>
        <button
          @click="closeGuide"
          class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div class="space-y-6">
        <!-- Status actuel -->
        <div
          class="p-4 rounded-lg"
          :class="[
            status.error
              ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
              : status.isRunning && status.modelInstalled
              ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
              : 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300',
          ]"
        >
          <p class="text-sm font-medium">
            {{ getStatusMessage }}
          </p>
        </div>

        <!-- Étapes d'installation -->
        <div class="space-y-4">
          <div
            v-for="(step, index) in installSteps"
            :key="index"
            class="flex items-start gap-3 p-3 rounded-lg"
            :class="{ 'bg-gray-50 dark:bg-gray-700/50': step.current }"
          >
            <div
              class="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 flex items-center justify-center flex-shrink-0"
            >
              {{ index + 1 }}
            </div>
            <div class="flex-1">
              <h3 class="font-medium text-gray-900 dark:text-white">
                {{ step.title }}
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {{ step.description }}
              </p>

              <div v-if="step.command" class="mt-2">
                <div
                  class="flex items-center justify-between bg-gray-100 dark:bg-gray-800 rounded p-2"
                >
                  <code class="text-sm text-gray-800 dark:text-gray-200">{{
                    step.command
                  }}</code>
                  <button
                    @click="copyCommand(step.command)"
                    class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    title="Copier la commande"
                  >
                    <svg
                      class="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M8 5a2 2 0 012 2h2a2 2 0 012-2M8 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div v-if="step.downloadLink" class="mt-2">
                <a
                  :href="step.downloadLink.url"
                  target="_blank"
                  class="inline-flex items-center gap-2 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <span>{{ step.downloadLink.text }}</span>
                  <svg
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-3 mt-6">
          <button
            @click="recheckOllama"
            class="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors"
            :disabled="isChecking"
          >
            <span v-if="isChecking">Vérification...</span>
            <span v-else>Vérifier l'installation</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

interface OllamaStatus {
  isRunning: boolean;
  modelInstalled: boolean;
  error: string | null;
}

interface InstallStep {
  title: string;
  description: string;
  command?: string;
  downloadLink?: {
    url: string;
    text: string;
  };
  current: boolean;
}

const showGuide = ref(true);
const isChecking = ref(false);
const status = ref<OllamaStatus>({
  isRunning: false,
  modelInstalled: false,
  error: null,
});

// Installation steps based on detected OS
const os = computed(() => {
  const platform = window.navigator.platform.toLowerCase();
  if (platform.includes("win")) return "windows";
  if (platform.includes("mac")) return "mac";
  return "linux";
});

const installSteps = computed<InstallStep[]>(() => {
  const steps: InstallStep[] = [
    {
      title: "Télécharger Ollama",
      description: `Téléchargez la dernière version d'Ollama pour ${
        os.value === "windows"
          ? "Windows"
          : os.value === "mac"
          ? "macOS"
          : "Linux"
      }`,
      downloadLink: {
        url: "https://ollama.ai/download",
        text: "Télécharger Ollama",
      },
      current: !status.value.isRunning,
    },
    {
      title: "Installer et démarrer Ollama",
      description:
        os.value === "mac"
          ? "Ouvrez le Terminal et exécutez la commande :"
          : os.value === "windows"
          ? "Installez Ollama puis ouvrez PowerShell en tant qu'administrateur et exécutez :"
          : "Ouvrez un terminal et exécutez :",
      command:
        os.value === "mac"
          ? "brew install ollama && ollama serve"
          : os.value === "linux"
          ? "curl -fsSL https://ollama.ai/install.sh | sh && ollama serve"
          : "ollama serve",
      current: status.value.isRunning && !status.value.modelInstalled,
    },
    {
      title: "Installer le modèle llama3.2",
      description: "Dans un nouveau terminal, exécutez :",
      command: "ollama pull llama3.2",
      current: status.value.isRunning && !status.value.modelInstalled,
    },
  ];

  return steps;
});

const getStatusMessage = computed(() => {
  if (status.value.error) {
    return `Erreur : ${status.value.error}`;
  }
  if (status.value.isRunning && status.value.modelInstalled) {
    return "✅ Ollama est correctement configuré et prêt à l'emploi !";
  }
  if (status.value.isRunning && !status.value.modelInstalled) {
    return "⚠️ Ollama est en cours d'exécution mais le modèle llama3.2 n'est pas installé.";
  }
  return "⚠️ Ollama n'est pas en cours d'exécution.";
});

async function recheckOllama() {
  isChecking.value = true;
  try {
    const response = await fetch("http://localhost:11434/api/tags");
    status.value.isRunning = response.ok;

    if (response.ok) {
      const data = await response.json();
      console.log("🚀 ~ recheckOllama ~ data:", data);
      status.value.modelInstalled = data.models?.some(
        (m: any) => m.name === "llama3.2:latest"
      );
      status.value.error = null;
    } else {
      status.value.error = "Le service Ollama n'est pas accessible.";
    }
  } catch (error) {
    status.value.error =
      "Impossible de se connecter à Ollama. Vérifiez qu'il est bien lancé.";
  } finally {
    isChecking.value = false;
  }
}

async function copyCommand(command: string) {
  try {
    await navigator.clipboard.writeText(command);
  } catch (err) {
    console.error("Erreur lors de la copie :", err);
  }
}

function closeGuide() {
  if (!status.value.isRunning || !status.value.modelInstalled) {
    if (
      confirm(
        "Ollama n'est pas complètement configuré. Êtes-vous sûr de vouloir fermer le guide ?"
      )
    ) {
      showGuide.value = false;
    }
  } else {
    showGuide.value = false;
  }
}

// Vérification initiale au montage du composant
recheckOllama();
</script>
```
