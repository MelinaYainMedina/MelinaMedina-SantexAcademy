import { Injectable } from '@nestjs/common';
import Groq from 'groq-sdk';

@Injectable()
export class AiService {
  private groq: Groq;

  constructor() {
    this.groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }

  async analizarEvolucion(playerName: string, history: any[]): Promise<string> {
    const historialTexto = history.map(h =>
      `FIFA ${h.year}: velocidad=${h.pace}, disparo=${h.shooting}, pase=${h.passing}, dribbling=${h.dribbling}, defensa=${h.defending}, físico=${h.physic}, rating=${h.overall}`
    ).join('\n');

    const prompt = `Sos un analista experto en FIFA. Analizá la evolución del jugador ${playerName} a lo largo de los años basándote en estos datos:

${historialTexto}

Escribí UN párrafo en español (máximo 100 palabras) describiendo cómo evolucionaron sus habilidades, destacando picos, declives y transiciones importantes. Sé específico con los años y valores.`;

    const completion = await this.groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.1-8b-instant',
      max_tokens: 200,
    });

    return completion.choices[0]?.message?.content || 'No se pudo generar el análisis.';
  }
}