const checkOllamaSetup = async () => {
  try {
    const checks = {
      isRunning: false,
      modelInstalled: false,
      error: null as string | null,
    };

    try {
      const response = await fetch("http://localhost:11434/api/tags");
      checks.isRunning = response.ok;
    } catch {
      checks.error =
        "Ollama n'est pas lancé. Veuillez démarrer le service Ollama.";
      return checks;
    }

    try {
      const response = await fetch("http://localhost:11434/api/tags");
      const data = await response.json();
      checks.modelInstalled = data.models?.some(
        (m: any) => m.name === "llama3.2"
      );

      if (!checks.modelInstalled) {
        checks.error =
          "Le modèle Mistral n'est pas installé. Installation nécessaire.";
      }
    } catch {
      checks.error = "Impossible de vérifier les modèles installés.";
    }

    return checks;
  } catch (error) {
    console.error("Erreur lors de la vérification d'Ollama:", error);
    return {
      isRunning: false,
      modelInstalled: false,
      error: "Erreur lors de la vérification d'Ollama",
    };
  }
};
