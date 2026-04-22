const express = require('express');
const cors = require('cors');
const Anthropic = require('@anthropic-ai/sdk');

const app = express();
app.use(cors());
app.use(express.json());

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

const SYSTEM_PROMPT = `Du bist der freundliche KI-Assistent 
von JAZUKI. Du hilfst kleinen und mittelständischen 
Unternehmen dabei, KI sinnvoll in der Produktion 
einzusetzen. Antworte auf Deutsch, klar und praxisnah. 
Verweise bei konkretem Bedarf auf Peter Hirt und jazuki.de.`;

app.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    const response = await client.messages.create({
      model: 'model: 'claude-haiku-4-5-20251001'',
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
