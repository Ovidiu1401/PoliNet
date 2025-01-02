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
      .then(response => response.json())
      .then(data => {
          if (data.users.length > 0) {
              noUserFound.style.display = 'none';
              userResult.style.display = 'block';

              // Afișează informațiile despre utilizatorul găsit
              const user = data.users[0];  // Poți extinde pentru a arăta mai mulți utilizatori
              userImage.src = user.image || 'path/to/default/image.jpg'; // Imaginea utilizatorului
              userName.textContent = user.username;
              followBtn.setAttribute('data-user-id', user.id); // Setează ID-ul utilizatorului pentru urmărire
          } else {
              noUserFound.style.display = 'block';
              userResult.style.display = 'none';
          }
      })
      .catch(error => console.error('Error:', error));
}

// Funcția care se declanșează când utilizatorul apasă butonul de urmărire
function toggleFollow() {
  const userId = document.getElementById('follow-btn').getAttribute('data-user-id');

  fetch('/follow/', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken') // CSRF token pentru a proteja cererile POST
      },
      body: JSON.stringify({ user_id: userId })
  })
  .then(response => response.json())
  .then(data => {
      if (data.message) {
          alert(data.message); // Afișează mesajul de succes
      } else {
          alert('Eroare la urmărire');
      }
  })
  .catch(error => console.error('Error:', error));
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