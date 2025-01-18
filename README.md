# Script Correct

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
