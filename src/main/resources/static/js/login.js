(function () {
    'use strict';

    const AUTH_LOGIN = '/api/v1/auth/login';

    function getErr() {
        return document.getElementById('loginError');
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
                return (data && data.message) ? data.message : 'Sign in failed.';
            });
        }
        return response.text().then(function (t) {
            return t || 'Sign in failed.';
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

    function handleLogin(event) {
        event.preventDefault();
        clearErr();

        var email = document.getElementById('email').value.trim();
        var password = document.getElementById('password').value;

        if (!email || !password) {
            showErr('Please enter your email and password.');
            return;
        }

        fetch(AUTH_LOGIN, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, password: password }),
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
        var form = document.getElementById('loginForm');
        if (form) {
            form.addEventListener('submit', handleLogin);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
