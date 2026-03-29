(function () {
    'use strict';

    var API_USERS = '/api/v1/users';
    var AUTH_LOGOUT = '/api/v1/auth/logout';

    function authHeaders() {
        var token = localStorage.getItem('authToken');
        var h = { 'Content-Type': 'application/json' };
        if (token) {
            h['Authorization'] = 'Bearer ' + token;
        }
        return h;
    }

    function clearSession() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('connectedUser');
    }

    function requireUser() {
        var raw = localStorage.getItem('connectedUser');
        var token = localStorage.getItem('authToken');
        if (!raw || !token) {
            clearSession();
            window.location.href = 'login.html';
            return null;
        }
        try {
            return JSON.parse(raw);
        } catch (e) {
            clearSession();
            window.location.href = 'login.html';
            return null;
        }
    }

    function initials(name) {
        if (!name) {
            return '?';
        }
        var p = name.trim().split(/\s+/);
        return (p[0][0] + (p[1] ? p[1][0] : '')).toUpperCase().slice(0, 2);
    }

    function displayUsers(userList, container) {
        container.innerHTML = '';
        userList.forEach(function (user) {
            var li = document.createElement('li');
            var badgeClass = user.status === 'online' ? 'badge-online' : 'badge-offline';
            var badgeText = user.status === 'online' ? 'Online' : 'Offline';
            li.innerHTML =
                '<div class="u-main">' +
                '<div class="avatar">' + initials(user.username) + '</div>' +
                '<div style="min-width:0">' +
                '<div class="u-name">' + escapeHtml(user.username) + '</div>' +
                '<div class="u-email">' + escapeHtml(user.email) + '</div>' +
                '</div></div>' +
                '<span class="' + badgeClass + '">' + badgeText + '</span>';
            container.appendChild(li);
        });
    }

    function escapeHtml(s) {
        var d = document.createElement('div');
        d.textContent = s;
        return d.innerHTML;
    }

    function loadAndDisplayUsers() {
        var user = requireUser();
        if (!user) {
            return;
        }

        var chip = document.getElementById('chipLabel');
        if (chip) {
            chip.textContent = user.username + ' · ' + user.email;
        }

        var userListElement = document.getElementById('userList');
        if (!userListElement) {
            return;
        }

        userListElement.innerHTML = '<li class="loading-text">Loading…</li>';

        fetch(API_USERS, { headers: authHeaders() })
            .then(function (response) {
                if (response.status === 401) {
                    clearSession();
                    window.location.href = 'login.html';
                    return null;
                }
                if (!response.ok) {
                    throw new Error('load failed');
                }
                return response.json();
            })
            .then(function (data) {
                if (!data) {
                    return;
                }
                displayUsers(data, userListElement);
            })
            .catch(function () {
                userListElement.innerHTML = '<li class="loading-text">Could not load people.</li>';
            });
    }

    function handleLogout() {
        fetch(AUTH_LOGOUT, {
            method: 'POST',
            headers: authHeaders(),
            body: '{}',
        })
            .finally(function () {
                clearSession();
                window.location.href = 'login.html';
            });
    }

    function handleNewMeeting() {
        var user = requireUser();
        if (!user) {
            return;
        }
        window.open('videocall.html?username=' + encodeURIComponent(user.username), '_blank');
    }

    function handleJoinMeeting() {
        var errEl = document.getElementById('joinError');
        if (errEl) {
            errEl.textContent = '';
        }

        var roomId = document.getElementById('meetingName').value.trim();
        var user = requireUser();
        if (!user) {
            return;
        }
        if (!roomId) {
            if (errEl) {
                errEl.textContent = 'Enter a meeting ID to join.';
            }
            return;
        }

        var url =
            'videocall.html?roomID=' +
            encodeURIComponent(roomId) +
            '&username=' +
            encodeURIComponent(user.username);
        window.open(url, '_blank');
    }

    function init() {
        loadAndDisplayUsers();

        var logoutBtn = document.getElementById('logoutBtn');
        var newMeetingBtn = document.getElementById('newMeetingBtn');
        var joinMeetingBtn = document.getElementById('joinMeetingBtn');

        if (logoutBtn) {
            logoutBtn.addEventListener('click', handleLogout);
        }
        if (newMeetingBtn) {
            newMeetingBtn.addEventListener('click', handleNewMeeting);
        }
        if (joinMeetingBtn) {
            joinMeetingBtn.addEventListener('click', handleJoinMeeting);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
