const OLLAMA_API_URL = "http://localhost:11434/api/generate";

type CorrectionStyle =
  | "standard"
  | "formal"
  | "casual"
  | "creative"
  | "academique"
  | "business"
  | "journalistique"
  | "technique";

interface OllamaResponse {
  response: string;
  model: string;
  created_at: string;
}

interface CorrectionResult {
  texte_corrige: string;
  corrections: string[];
  score_initial: number;
  suggestions: string[];
}

export class OllamaService {
  private _defaultModel: string;
  private readonly stylePrompts: Record<CorrectionStyle, string>;

  constructor() {
    this._defaultModel = "mistral";
    this.stylePrompts = {
      standard: `Tu es un assistant spécialisé dans la correction de texte en français.
        Format de réponse attendu en JSON :
        {
          "texte_corrige": "le texte corrigé",
          "corrections": ["liste des corrections effectuées"],
          "score_initial": "score de qualité sur 100",
          "suggestions": ["suggestions d'amélioration"]
        }
        
        Instructions:
        - Corrige uniquement les erreurs
        - Conserve le même sens
        - Liste toutes les corrections
        - Évalue la qualité initiale
        - Suggère des améliorations`,

      formal: `Tu es un assistant spécialisé dans la correction et l'amélioration de textes formels.
        Format de réponse attendu en JSON...`,

      casual: `Tu es un assistant spécialisé dans la correction de textes décontractés.
        Format de réponse attendu en JSON...`,

      creative: `Tu es un assistant spécialisé dans l'amélioration créative de textes.
        Format de réponse attendu en JSON...`,

      academique: `Tu es un assistant spécialisé dans la correction de textes académiques.
        Instructions spécifiques :
        - Utilise un vocabulaire académique précis
        - Privilégie les tournures savantes
        - Vérifie les citations et références
        Format de réponse attendu en JSON...`,

      business: `Tu es un assistant spécialisé dans la correction de textes professionnels.
        Instructions spécifiques :
        - Style concis et efficace
        - Vocabulaire business approprié
        - Clarté et impact
        Format de réponse attendu en JSON...`,

      journalistique: `Tu es un assistant spécialisé dans la correction de textes journalistiques.
        Instructions spécifiques :
        - Style journalistique percutant
        - Phrases courtes et dynamiques
        - Clarté et objectivité
        Format de réponse attendu en JSON...`,

      technique: `Tu es un assistant spécialisé dans la correction de documentation technique.
        Instructions spécifiques :
        - Précision technique maximale
        - Terminologie spécialisée
        - Clarté des instructions
        Format de réponse attendu en JSON...`,
    };
  }

  async correctText(
    text: string,
    style: CorrectionStyle = "standard",
    model: string = this._defaultModel
  ): Promise<CorrectionResult> {
    try {
      const response = await fetch(OLLAMA_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          prompt: this.buildPrompt(text, style),
          stream: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data: OllamaResponse = await response.json();

      try {
        // Tente de parser la réponse JSON
        const result: CorrectionResult = JSON.parse(data.response);
        return result;
      } catch (parseError) {
        // Si le parsing échoue, retourne un format par défaut
        return {
          texte_corrige: data.response.trim(),
          corrections: [],
          score_initial: 0,
          suggestions: [],
        };
      }
    } catch (error) {
      console.error("Erreur lors de la correction:", error);
      throw error;
    }
  }

  private buildPrompt(text: string, style: CorrectionStyle): string {
    return `${this.stylePrompts[style]}
    
    Texte à corriger : ${text}
    
    Réponds uniquement avec un objet JSON valide contenant:
    {
      "texte_corrige": "le texte corrigé",
      "corrections": ["liste des corrections effectuées"],
      "score_initial": "score de qualité sur 100",
      "suggestions": ["suggestions d'amélioration"]
    }`;
  }

  private cleanResponse(response: string): string {
    return response
      .trim()
      .replace(/^["']|["']$/g, "")
      .replace(/\\n/g, "\n");
  }

  async checkAvailability(): Promise<boolean> {
    try {
      const response = await fetch(OLLAMA_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: this._defaultModel,
          prompt: "test",
          stream: false,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error("Erreur de disponibilité:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Erreur de connexion:", error);
      return false;
    }
  }

  setDefaultModel(model: string): void {
    this._defaultModel = model;
  }

  getDefaultModel(): string {
    return this._defaultModel;
  }

  getAvailableStyles(): CorrectionStyle[] {
    return Object.keys(this.stylePrompts) as CorrectionStyle[];
  }
}

export default new OllamaService();
