document.getElementById('api-key-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    const apiKey = document.getElementById('api-key').value;
    const provider = document.getElementById('api-provider').value;

    let valid = false;

    if (provider === 'openai') {
        valid = await validateOpenAIKey(apiKey);
    } else if (provider === 'anthropic') {
        valid = await validateAnthropicKey(apiKey);
    }

    if (valid) {
        localStorage.setItem('apiKey', apiKey);
        localStorage.setItem('provider', provider);
        document.getElementById('api-key-form').style.display = 'none';
        document.getElementById('prompt-form').style.display = 'block';
    } else {
        alert('Invalid API key');
    }
});

document.getElementById('prompt-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    const prompt = document.getElementById('prompt').value;
    const apiKey = localStorage.getItem('apiKey');
    const provider = localStorage.getItem('provider');
    
    let response;
    
    if (provider === 'openai') {
        response = await fetch('https://api.openai.com/v1/engines/davinci-codex/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({ prompt })
        });
    } else if (provider === 'anthropic') {
        response = await fetch('https://api.anthropic.com/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({ prompt })
        });
    }

    const data = await response.json();
    document.getElementById('modal-output').innerHTML = data.html;
    openModal();
});

function openModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'block';

    const closeButton = document.getElementsByClassName('close-button')[0];
    closeButton.onclick = function () {
        modal.style.display = 'none';
    };

    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
}

async function validateOpenAIKey(apiKey) {
    try {
        const response = await fetch('https://api.openai.com/v1/engines', {
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
    try {
        const response = await fetch('https://api.anthropic.com/validate', {
            headers: {
                'Authorization': `Bearer ${apiKey}`
            }
        });
        return response.ok;
    } catch (error) {
        console.error('Error validating Anthropic API key:', error);
        return false;
    }
}
