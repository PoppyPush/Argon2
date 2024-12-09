document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form');
    const secretForm = document.getElementById('secret-form');

    const registerResponse = document.getElementById('register-response');
    const loginResponse = document.getElementById('login-response');
    const secretResponse = document.getElementById('secret-response');
    const secretList = document.getElementById('secret-list');
    const addSecretDiv = document.getElementById('add-secret');
    const secretsDiv = document.getElementById('secrets');

    // Đăng ký
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('reg-username').value;
        const password = document.getElementById('reg-password').value;

        const response = await fetch('/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const result = await response.json();
        registerResponse.textContent = result.message || result.error;
    });

    // Đăng nhập
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;

        const response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const result = await response.json();

        loginResponse.textContent = result.message || result.error;

        if (response.ok) {
            addSecretDiv.style.display = 'block';
            secretsDiv.style.display = 'block';

            // Hiển thị danh sách bí mật
            secretList.innerHTML = '';
            result.secrets.forEach((s) => {
                const li = document.createElement('li');
                li.textContent = s.secret;
                secretList.appendChild(li);
            });
        }
    });

    // Thêm bí mật
    secretForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('login-username').value;
        const secret = document.getElementById('secret-content').value;

        const response = await fetch('/add-secret', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, secret })
        });
        const result = await response.json();
        secretResponse.textContent = result.message || result.error;

        if (response.ok) {
            const li = document.createElement('li');
            li.textContent = secret;
            secretList.appendChild(li);
        }
    });
});
