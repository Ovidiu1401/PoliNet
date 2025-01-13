// Funcția care se declanșează pe măsură ce utilizatorul scrie în câmpul de căutare
function searchUser() {
  const searchInput = document.getElementById('search-input').value;
  const noUserFound = document.getElementById('no-user-found');
  const userResult = document.getElementById('user-result');
  const userImage = document.getElementById('user-image');
  const userName = document.getElementById('user-name');
  const followBtn = document.getElementById('follow-btn');

  // Se trimite cererea AJAX pentru a căuta utilizatorul
  fetch(`/search/?q=${searchInput}`)
  .then(response => {
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const contentType = response.headers.get("Content-Type");
    if (!contentType || !contentType.includes("application/json")) {
      return response.text().then(text => {
        throw new Error(`Expected JSON, but received HTML: ${text}`);
      });
    }
    return response.json();
  })
  .then(data => {
    console.log('Data:', data);
    if (data.users && data.users.length > 0) {
      noUserFound.style.display = 'none';
      userResult.style.display = 'block';
      const user = data.users[0];
      userImage.src = user.image || '/static/images/User.png';
      userName.textContent = user.username;
      followBtn.setAttribute('data-user-id', user.id);
    } else {
      noUserFound.style.display = 'block';
      userResult.style.display = 'none';
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert('A apărut o eroare la căutarea utilizatorului. Detaliu: ' + error.message);
  });
}

// Funcție pentru a obține CSRF token din cookie (pentru protecția cererilor POST)
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].trim();
          if (cookie.substring(0, name.length + 1) === (name + '=')) {
              cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
              break;
          }
      }
  }
  return cookieValue;
}

document.querySelector('.logout-btn').addEventListener('click', function() {
  const logoutUrl = this.getAttribute('data-in');
  window.location.href = logoutUrl;
});

document.querySelector('.profile-icon').addEventListener('click', function() {
  const profileUrl = this.getAttribute('data-in');
  window.location.href = profileUrl;
});

function toggleFollow() {
  const followBtn = document.getElementById('follow-btn');
  const userId = followBtn.getAttribute('data-user-id');

  fetch('/follow/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCookie('csrftoken')
    },
    body: JSON.stringify({ user_id: userId })
  })
  .then(response => response.json())
  .then(data => {
    alert(data.message);
    // Schimbă textul butonului
    if (followBtn.textContent === 'Urmărește') {
      followBtn.textContent = 'Urmarit';
    } else {
      followBtn.textContent = 'Urmărește';
    }
  })
  .catch(error => console.error('Error:', error));
}
