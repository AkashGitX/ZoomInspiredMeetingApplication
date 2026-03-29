(function () {
    'use strict';

    const AUTH_REGISTER = '/api/v1/auth/register';

    function getErr() {
        return document.getElementById('registerError');
    }

    function clearErr() {
        var el = getErr();
        if (el) {
            el.textContent = '';
        }
    }

    function showErr(msg) {
        var el = getErr();
        if (el) {
            el.textContent = msg;
        }
    }

    function parseError(response) {
        var ct = response.headers.get('content-type') || '';
        if (ct.indexOf('application/json') !== -1) {
            return response.json().then(function (data) {
                return (data && data.message) ? data.message : 'Registration failed.';
            });
        }
        return response.text().then(function (t) {
            return t || 'Registration failed.';
        });
    }

    function persistSession(data) {
        if (!data || !data.accessToken || !data.user) {
            showErr('Invalid response from server.');
            return;
        }
        localStorage.setItem('authToken', data.accessToken);
        localStorage.setItem('connectedUser', JSON.stringify(data.user));
        window.location.href = 'index.html';
    }

    function handleRegistration(event) {
        event.preventDefault();
        clearErr();

        var username = document.getElementById('username').value.trim();
        var email = document.getElementById('email').value.trim();
        var password = document.getElementById('password').value;

        if (!username || !email || !password) {
            showErr('Please fill in all fields.');
            return;
        }
        if (password.length < 8) {
            showErr('Password must be at least 8 characters.');
            return;
        }

        fetch(AUTH_REGISTER, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: username,
                email: email,
                password: password,
            }),
        })
            .then(function (response) {
                if (response.ok) {
                    return response.json().then(persistSession);
                }
                return parseError(response).then(function (msg) {
                    showErr(msg);
                });
            })
            .catch(function () {
                showErr('Cannot reach the server. Check your connection.');
            });
    }

    function init() {
        var form = document.getElementById('registrationForm');
        if (form) {
            form.addEventListener('submit', handleRegistration);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
