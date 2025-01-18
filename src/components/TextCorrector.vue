<template>
  <div
    class="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800"
  >
    <Toast ref="toastRef" />
    <div class="max-w-2xl mx-auto pt-16 px-6">
      <!-- En-tête -->
      <div class="space-y-2 mb-8">
        <h1
          class="text-3xl font-semibold tracking-tight text-gray-900 dark:text-white"
        >
          Correcteur de texte
        </h1>
        <p class="text-base text-gray-600 dark:text-gray-400">
          Collez votre texte pour une correction instantanée
        </p>
      </div>

      <!-- Zone de texte principale -->
      <div
        class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 overflow-hidden backdrop-blur-xl"
      >
        <textarea
          v-model="text"
          class="w-full h-64 p-6 bg-transparent text-gray-800 dark:text-gray-200 resize-none focus:outline-none text-base leading-relaxed placeholder-gray-400 dark:placeholder-gray-500"
          placeholder="Collez votre texte ici..."
        />

        <!-- Après la zone de texte -->
        <div v-if="correctionResult" class="mt-8 space-y-6">
          <!-- Score et stats -->
          <div
            class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                Analyse du texte
              </h3>
              <div class="flex items-center">
                <div
                  class="text-2xl font-bold"
                  :class="[
                    correctionResult.score_initial >= 80
                      ? 'text-green-500'
                      : correctionResult.score_initial >= 60
                      ? 'text-yellow-500'
                      : 'text-red-500',
                  ]"
                >
                  {{ correctionResult.score_initial }}/100
                </div>
              </div>
            </div>

            <!-- Corrections -->
            <div v-if="correctionResult.corrections.length > 0" class="mb-6">
              <h4
                class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Corrections effectuées
              </h4>
              <ul class="space-y-1">
                <li
                  v-for="(correction, index) in correctionResult.corrections"
                  :key="index"
                  class="text-sm text-gray-600 dark:text-gray-400 flex items-center space-x-2"
                >
                  <span class="text-blue-500">•</span>
                  <span>{{ correction }}</span>
                </li>
              </ul>
            </div>

            <!-- Suggestions -->
            <div v-if="correctionResult.suggestions.length > 0">
              <h4
                class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Suggestions d'amélioration
              </h4>
              <ul class="space-y-1">
                <li
                  v-for="(suggestion, index) in correctionResult.suggestions"
                  :key="index"
                  class="text-sm text-gray-600 dark:text-gray-400 flex items-center space-x-2"
                >
                  <span class="text-yellow-500">💡</span>
                  <span>{{ suggestion }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Barre d'actions -->
        <!-- Barre d'actions et styles -->
        <div class="p-4 space-y-4 overflow-hidden">
          <!-- Styles de correction en scrollable -->
          <div class="relative">
            <!-- Container de défilement avec padding pour les gradients -->
            <div class="px-8">
              <!-- Wrapper scrollable -->
              <div class="flex overflow-x-auto gap-2 no-scrollbar pb-2">
                <button
                  v-for="style in correctionStyles"
                  :key="style.id"
                  @click="handleCorrection(style.id)"
                  :disabled="!text || isProcessing"
                  class="flex-none min-w-fit"
                  :class="[
                    'px-3 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-all relative group',
                    !text || isProcessing
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                      : selectedStyle === style.id
                      ? 'bg-blue-500 text-white shadow-sm hover:shadow active:scale-95'
                      : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300',
                  ]"
                >
                  <span class="text-lg">{{ style.icon }}</span>
                  <span class="whitespace-nowrap text-sm">{{
                    style.name
                  }}</span>

                  <!-- Tooltip -->
                  <div
                    class="hidden group-hover:block absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10"
                  >
                    {{ style.tooltip }}
                  </div>
                </button>
              </div>
            </div>

            <!-- Gradients de défilement -->
            <div
              class="absolute left-0 top-0 bottom-2 w-8 bg-gradient-to-r from-white dark:from-gray-900 to-transparent pointer-events-none"
            ></div>
            <div
              class="absolute right-0 top-0 bottom-2 w-8 bg-gradient-to-l from-white dark:from-gray-900 to-transparent pointer-events-none"
            ></div>
          </div>

          <!-- Barre d'actions -->
          <div
            class="flex justify-between items-center pt-2 border-t border-gray-100 dark:border-gray-700"
          >
            <!-- État de traitement -->
            <div
              v-if="isProcessing"
              class="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2"
            >
              <div
                class="w-4 h-4 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"
              />
              Correction en cours...
            </div>

            <!-- Bouton copier -->
            <button
              @click="handleCopy"
              :disabled="!text"
              :class="[
                'p-2.5 rounded-full transition-all',
                !text
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 active:scale-95',
              ]"
            >
              <template v-if="isCopied">
                <svg
                  class="w-5 h-5 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </template>
              <template v-else>
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
              </template>
            </button>
          </div>
        </div>
      </div>

      <!-- Instructions -->
      <div
        class="mt-8 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-xl"
      >
        <h2 class="text-sm font-medium text-gray-900 dark:text-white mb-4">
          Comment utiliser
        </h2>
        <ol class="space-y-3 text-sm text-gray-600 dark:text-gray-400">
          <li class="flex items-center space-x-3">
            <span
              class="flex-none w-6 h-6 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center font-medium"
              >1</span
            >
            <span>Collez votre texte dans la zone ci-dessus</span>
          </li>
          <li class="flex items-center space-x-3">
            <span
              class="flex-none w-6 h-6 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center font-medium"
              >2</span
            >
            <span>Cliquez sur "Corriger" pour lancer la correction</span>
          </li>
          <li class="flex items-center space-x-3">
            <span
              class="flex-none w-6 h-6 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center font-medium"
              >3</span
            >
            <span
              >Le texte corrigé sera automatiquement copié dans votre
              presse-papiers</span
            >
          </li>
        </ol>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { writeText, readText } from "@tauri-apps/plugin-clipboard-manager";
import ollamaService from "../services/ollama.service";
import Toast from "./Toast.vue";

type CorrectionStyle =
  | "standard"
  | "formal"
  | "casual"
  | "creative"
  | "academique"
  | "business"
  | "journalistique"
  | "technique";

interface CorrectionStyleConfig {
  id: CorrectionStyle;
  name: string;
  icon: string;
  tooltip: string;
}

const text: any = ref("");
const isProcessing = ref(false);
const isCopied = ref(false);
const isOllamaAvailable = ref(true);
const toastRef = ref();
const selectedStyle = ref<CorrectionStyle>("standard");

interface CorrectionResult {
  texte_corrige: string;
  corrections: string[];
  score_initial: number;
  suggestions: string[];
}

const correctionResult = ref<CorrectionResult | null>(null);

const correctionStyles: CorrectionStyleConfig[] = [
  {
    id: "standard",
    name: "Standard",
    icon: "✓",
    tooltip: "Correction standard",
  },
  {
    id: "formal",
    name: "Formel",
    icon: "👔",
    tooltip: "Style formel, professionnel",
  },
  {
    id: "casual",
    name: "Décontracté",
    icon: "😊",
    tooltip: "Style décontracté, amical",
  },
  {
    id: "creative",
    name: "Créatif",
    icon: "✨",
    tooltip: "Style créatif et expressif",
  },
  {
    id: "academique",
    name: "Académique",
    icon: "📚",
    tooltip: "Style académique et recherché",
  },
  {
    id: "business",
    name: "Business",
    icon: "💼",
    tooltip: "Style professionnel et concis",
  },
  {
    id: "journalistique",
    name: "Journalistique",
    icon: "📰",
    tooltip: "Style journalistique",
  },
  {
    id: "technique",
    name: "Technique",
    icon: "⚙️",
    tooltip: "Documentation technique",
  },
] as const;

// Fonction pour corriger le texte
const handleCorrection = async (
  style: CorrectionStyle = selectedStyle.value
) => {
  if (!text.value || isProcessing.value) return;

  if (!isOllamaAvailable.value) {
    toastRef.value?.addToast(
      "error",
      "Ollama non disponible",
      "Veuillez vérifier qu'Ollama est bien lancé sur votre machine et redémarrer l'application."
    );
    return;
  }

  isProcessing.value = true;
  try {
    correctionResult.value = await ollamaService.correctText(text.value, style);
    text.value = correctionResult.value.texte_corrige;

    // Copie automatique du texte corrigé
    await handleCopy();

    // Notification de succès avec le score
    toastRef.value?.addToast(
      "success",
      "Correction effectuée",
      `Score de qualité: ${correctionResult.value.score_initial}/100`
    );
  } catch (error) {
    console.error(error);
    toastRef.value?.addToast(
      "error",
      "Erreur lors de la correction",
      "Une erreur est survenue lors de la correction du texte. Vérifiez la connexion avec Ollama."
    );
  } finally {
    isProcessing.value = false;
  }
};

// Fonction pour copier le texte dans le presse-papiers
const handleCopy = async () => {
  try {
    await writeText(text.value);
    isCopied.value = true;
    setTimeout(() => {
      isCopied.value = false;
    }, 2000);
  } catch (error) {
    console.error("Erreur lors de la copie:", error);
  }
};

// Vérification de la disponibilité d'Ollama au chargement
onMounted(async () => {
  try {
    isOllamaAvailable.value = await ollamaService.checkAvailability();
    if (!isOllamaAvailable.value) {
      toastRef.value?.addToast(
        "error",
        "Ollama non disponible",
        "Veuillez vérifier qu'Ollama est bien lancé sur votre machine et redémarrer l'application."
      );
    }
  } catch (error) {
    toastRef.value?.addToast(
      "error",
      "Erreur de connexion",
      "Impossible de se connecter à Ollama. Vérifiez que le service est bien lancé sur le port 11434."
    );
  }
});
</script>

<style scoped>
.scrollbar-thin::-webkit-scrollbar {
  height: 4px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: rgb(209, 213, 219);
  border-radius: 2px;
}

.dark .scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: rgb(75, 85, 99);
}

/* Masquer la scrollbar sur mobile tout en gardant la fonctionnalité */
@media (max-width: 640px) {
  .scrollbar-thin {
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  .scrollbar-thin::-webkit-scrollbar {
    display: none;
  }
}
</style>
