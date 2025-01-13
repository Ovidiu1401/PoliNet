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
// function getCookie(name) {
//   let cookieValue = null;
//   if (document.cookie && document.cookie !== '') {
//       const cookies = document.cookie.split(';');
//       for (let i = 0; i < cookies.length; i++) {
//           const cookie = cookies[i].trim();
//           if (cookie.substring(0, name.length + 1) === (name + '=')) {
//               cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
//               break;
//           }
//       }
//   }
//   return cookieValue;
// }

document.querySelector('.logout-btn').addEventListener('click', function() {
  const logoutUrl = this.getAttribute('data-in');
  window.location.href = logoutUrl;
});

document.querySelector('.profile-icon').addEventListener('click', function() {
  const profileUrl = this.getAttribute('data-in');
  window.location.href = profileUrl;
});

// function toggleFollow(userId) {
//   fetch('/toggle_follow/', {
//       method: 'POST',
//       headers: {
//           'Content-Type': 'application/json',
//           'X-CSRFToken': getCookie('csrftoken')
//       },
//       body: JSON.stringify({ 'user_id': userId })
//   })
//   .then(response => response.json())
//   .then(data => {
//       if (data.message) {
//           alert(data.message);
//           const followBtn = document.getElementById(`follow-btn-${userId}`);
//           if (data.followed) {
//               followBtn.textContent = "Nu mai urmări";
//           } else {
//               followBtn.textContent = "Urmărește";
//           }
//       } else if (data.error) {
//           alert(data.error);
//       }
//   })
//   .catch(error => {
//       console.error('Error:', error);
//       alert('A apărut o eroare.');
//   });
// }



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

// function toggleFollow(userId) {
//   console.log(`Toggle follow pentru userId: ${userId}`);
//   let followedUsers = JSON.parse(localStorage.getItem('followedUsers')) || {};
//   const followBtn = document.querySelector(`button[data-user-id='${userId}']`);

//   if (!followBtn) {
//     console.error(`Butonul cu data-user-id="${userId}" nu a fost găsit.`);
//     return;  // Dacă butonul nu este găsit, ieșim din funcție
//   }

//   if (followedUsers[userId]) {
//       delete followedUsers[userId];
//       followBtn.textContent = "Urmărește";
//   } else {
//       followedUsers[userId] = true;
//       followBtn.textContent = "Nu mai urmări";
//   }

//   localStorage.setItem('followedUsers', JSON.stringify(followedUsers));
// }

// Funcție pentru a comuta starea de urmărire
function toggleFollow(userId) {
  let followedUsers = JSON.parse(localStorage.getItem('followedUsers')) || {};
  const followBtn = document.querySelector(`#follow-btn-${userId}`);

  if (followedUsers[userId]) {
      delete followedUsers[userId];
      followBtn.textContent = "Urmărește";
  } else {
      followedUsers[userId] = true;
      followBtn.textContent = "Nu mai urmări";
  }

  localStorage.setItem('followedUsers', JSON.stringify(followedUsers));
}

// La încărcarea paginii
window.onload = function() {
  let followedUsers = JSON.parse(localStorage.getItem('followedUsers')) || {};

  // Asigură-te că butoanele sunt corect actualizate
  document.querySelectorAll('.follow-btn').forEach(button => {
      const userId = button.getAttribute('data-user-id');
      if (followedUsers[userId]) {
          button.textContent = "Nu mai urmări";
      } else {
          button.textContent = "Urmărește";
      }

      // Adaugă un event listener pentru fiecare buton de urmărire
      button.addEventListener('click', () => toggleFollow(userId));
  });
};
