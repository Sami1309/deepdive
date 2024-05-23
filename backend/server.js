import express from 'express';
import fetch from 'node-fetch';
import Anthropic from '@anthropic-ai/sdk';


const app = express();
const port = 3000;
const anthropic = new Anthropic();


app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.post('/verify-api-key', async (req, res) => {
  const { apiKey, apiType } = req.body;

  if (apiType === 'openai') {
    const isValid = await validateOpenAiKey(apiKey);
    res.json({ valid: isValid });
  } else if (apiType === 'anthropic') {
    const isValid = await validateAnthropicKey(apiKey);
    res.json({ valid: isValid });
  } else {
    res.json({ valid: false });
  }
});

async function validateOpenAiKey(apiKey) {
  try {
    const response = await fetch('https://api.openai.com/v1/models', {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });
    return response.ok;
  } catch (error) {
    console.error('Error validating OpenAI API key:', error);
    return false;
  }
}

async function validateAnthropicKey(apiKey) {
    const anthropic = new Anthropic({
        apiKey: apiKey, // defaults to process.env["ANTHROPIC_API_KEY"]
      });
    console.log("validating anthropic key")
    console.log(apiKey)
    try {
        const message = await anthropic.messages.create({
            model: "claude-3-opus-20240229",
            max_tokens: 1,
            messages: [
              {"role": "user", "content": "0"}
            ]
          });
    } catch (error) {
      console.error('Error validating Anthropic API key:', error);
      return false;
    }
    return true
  }

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
