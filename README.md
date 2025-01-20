# Script Correct

<p align="center">
  <img src="https://github.com/user-attachments/assets/208a6219-e4ec-4b1f-be00-6049298458d3" width="150" height="150" alt="ScriptCorrect Logo">
</p>

> Un assistant de correction intelligent qui va au-delà de l'orthographe pour s'adapter à votre contexte d'écriture.

## À propos

ScriptCorrect est une application de correction de texte intelligente qui permet non seulement de corriger l'orthographe et la grammaire, mais aussi d'adapter le style d'écriture selon vos besoins.

## Technologies utilisées

- 🖥️ [Tauri](https://tauri.app/) - Framework desktop multiplateforme
- ⚡ [Vue.js 3](https://vuejs.org/) - Framework frontend moderne
- 🎨 [Tailwind CSS](https://tailwindcss.com/) - Framework CSS utilitaire
- 🤖 [Ollama](https://ollama.ai/) - IA locale pour le traitement du texte

## Fonctionnalités

- 🔍 Correction orthographique et grammaticale
- 🎯 Plusieurs styles de correction disponibles :
  - Standard
  - Formel
  - Décontracté
  - Créatif
  - Académique
  - Business
  - Journalistique
  - Technique
- ✨ Interface simple et intuitive
- 🌙 Mode sombre/clair
- 📋 Copie automatique dans le presse-papiers

## Prérequis

- [Node.js](https://nodejs.org/)
- [Rust](https://www.rust-lang.org/) (pour Tauri)
- [Ollama](https://ollama.ai/)

# Installation

## Windows

1. Téléchargez le fichier .msi
2. Double-cliquez pour installer
3. Suivez les instructions

## macOS

1. Téléchargez le fichier .dmg
2. Ouvrez l'image disque
3. Glissez l'application dans Applications

## Linux

1. Téléchargez l'AppImage
2. Rendez-le exécutable : `chmod +x scriptcorrect.AppImage`
3. Double-cliquez pour lancer

## Installation Manuel

## Prérequis : Installation d'Ollama

## Windows

1. Téléchargez Ollama depuis [ollama.ai](https://ollama.ai/download)
2. Installez le .exe
3. Ouvrez PowerShell et exécutez :

```bash
ollama serve
ollama pull llama3.2
```

## MacOs

```bash
brew install ollama
ollama serve
ollama pull llama3.2
```

## Linux

```bash
curl -fsSL https://ollama.ai/install.sh | sh
ollama serve
ollama pull llama3.2
```

## Clonez le dépôt

```bash
git clone https://github.com/votre-username/scriptcorrect.git
cd scriptcorrect
npm install
npm run tauri dev
npm run tauri build
```
