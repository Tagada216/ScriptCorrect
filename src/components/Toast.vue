<template>
  <TransitionGroup
    tag="div"
    class="fixed top-4 right-4 z-50 flex flex-col gap-2"
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="transform translate-x-full opacity-0"
    enter-to-class="transform translate-x-0 opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="transform translate-x-0 opacity-100"
    leave-to-class="transform translate-x-full opacity-0"
  >
    <div
      v-for="toast in toasts"
      :key="toast.id"
      class="flex items-start gap-2 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-red-200 dark:border-red-800"
      :class="[toast.type === 'error' ? 'border-l-4 border-l-red-500' : '']"
    >
      <div class="flex-shrink-0 text-red-500">
        <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clip-rule="evenodd"
          />
        </svg>
      </div>
      <div class="flex-1 pt-0.5">
        <p class="text-sm font-medium text-gray-900 dark:text-white">
          {{ toast.title }}
        </p>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {{ toast.message }}
        </p>
      </div>
      <button
        @click="removeToast(toast.id)"
        class="flex-shrink-0 ml-4 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
      >
        <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
          <path
            fill-rule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </div>
  </TransitionGroup>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { TransitionGroup } from "vue";

interface Toast {
  id: number;
  type: "error" | "success" | "warning";
  title: string;
  message: string;
}

const toasts = ref<Toast[]>([]);
let toastId = 0;

const addToast = (type: Toast["type"], title: string, message: string) => {
  const id = toastId++;
  toasts.value.push({ id, type, title, message });
  setTimeout(() => removeToast(id), 5000);
};

const removeToast = (id: number) => {
  toasts.value = toasts.value.filter((t) => t.id !== id);
};

// Expose methods to parent components
defineExpose({
  addToast,
});
</script>
