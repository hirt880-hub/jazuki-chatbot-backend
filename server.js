const express = require('express');
const cors = require('cors');
const Anthropic = require('@anthropic-ai/sdk');

const app = express();
app.use(cors());
app.use(express.json());

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

const SYSTEM_PROMPT = `Du bist der KI-Assistent von JAZUKI. Du hilfst ausschließlich bei Fragen zu folgenden Themen: KI-Einsatz in der Fertigung und Produktion, Mitarbeiterschulung zu KI-Themen, JAZUKI-Angeboten sowie Kontakt zu Peter Hirt und jazuki.de. Bei allen anderen Themen antwortest du höflich: "Dazu kann ich leider keine Auskunft geben. Ich bin spezialisiert auf KI in der Fertigung und Mitarbeiterschulung. Kann ich Ihnen dazu weiterhelfen?" Antworte auf Deutsch, sachlich und ohne Emojis oder Sonderformatierungen wie Sternchen.`;

app.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: message }]
    });
    res.json({ reply: response.content[0].text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Fehler beim Verarbeiten' });
  }
});

app.get('/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server läuft auf Port ${PORT}`));
