// script.js
async function verifyApiKey() {
  const apiKey = document.getElementById('apiKey').value;
  const apiType = document.getElementById('apiType').value;

  const response = await fetch('http://localhost:3000/verify-api-key', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ apiKey, apiType })
  });

  const result = await response.json();
  const isValid = result.valid;

  const keyStatus = document.getElementById('keyStatus');
  if (isValid) {
    keyStatus.textContent = 'Valid API Key';
    keyStatus.className = 'valid';
    document.getElementById('apiKey').style.borderColor = 'green';
  } else {
    keyStatus.textContent = 'Invalid API Key';
    keyStatus.className = 'invalid';
    document.getElementById('apiKey').style.borderColor = 'red';
  }
}

  
  async function validateOpenAiKey(apiKey) {
    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      });
      return response.ok;
    } catch (error) {
      console.error('Error validating API key:', error);
      return false;
    }
  }
  
  async function generateWebPage() {
    const apiKey = document.getElementById('apiKey').value;
    const prompt = document.getElementById('prompt').value;
    const apiType = document.getElementById('apiType').value;
  
    if (!apiKey || !prompt) {
      alert('Please enter both API key and prompt.');
      return;
    }
  
    document.getElementById('loading').style.display = 'block';
    document.getElementById('webPage').style.display = 'none';
  
    let response;
    if (apiType === 'openai') {
      response = await fetchOpenAiPage(apiKey, prompt);
    } else if (apiType === 'anthropic') {
      response = await fetchAnthropicPage(apiKey, prompt);
    }
  
    if (response) {
      document.getElementById('loading').style.display = 'none';
      const iframe = document.getElementById('webPageFrame');
      iframe.srcdoc = response;
      document.getElementById('webPage').style.display = 'block';
    } else {
      document.getElementById('loading').style.display = 'none';
      alert('Failed to generate the web page.');
    }
  }
  
  async function fetchOpenAiPage(apiKey, prompt) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [{ role: 'system', content: `You are an immersive web simulator. Create a realistic web page based on the following prompt. Be sure to embed styling directly into the html: ${prompt}` }],
          max_tokens: 2000
        })
      });
      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Error generating web page with OpenAI:', error);
      return null;
    }
  }
  
  async function fetchAnthropicPage(apiKey, prompt) {
    const anthropic = new Anthropic({
      apiKey: apiKey, // defaults to process.env["ANTHROPIC_API_KEY"]
    });
      
    try {
      const message = await anthropic.messages.create({
        model: "claude-3-opus-20240229",
        max_tokens: 1024,
        messages: [
          {"role": "user", "content": `You are an immersive web simulator. Create a realistic web page based on the following prompt. Be sure to embed styling directly into the html: ${prompt}`}
        ]
      });
      console.log(message)
      return data.completion;
    } catch (error) {
      console.error('Error generating web page with Anthropic:', error);
      return null;
    }
  }
  