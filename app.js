document.getElementById('api-key-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const apiKey = document.getElementById('api-key').value;
    localStorage.setItem('apiKey', apiKey);
    document.getElementById('api-key-form').style.display = 'none';
    document.getElementById('prompt-form').style.display = 'block';
});

document.getElementById('prompt-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    const prompt = document.getElementById('prompt').value;
    const apiKey = localStorage.getItem('apiKey');
    const response = await fetch('https://api.example.com/generate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({ prompt })
    });
    const data = await response.json();
    document.getElementById('output').innerHTML = data.html;
});
