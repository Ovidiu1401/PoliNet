let isFollowing = false;

function searchUser() {
    const query = document.getElementById('search-input').value; // Valoarea din input
    const userResult = document.getElementById('user-result');
    const noUserFound = document.getElementById('no-user-found');
    const followBtn = document.getElementById('follow-btn');
    const userName = document.getElementById('user-name');
    const userImage = document.getElementById('user-image');

    // Reset UI elements
    userResult.style.display = 'none';
    noUserFound.style.display = 'none';

    if (query === "") return;

    // Simulăm găsirea unui utilizator pe baza interogării (de obicei se face o cerere către server)
    // Presupunem că am găsit un utilizator în funcție de căutare
    const foundUser = {
        name: query, // Înlocuiește cu valoarea căutată
        image: "images/User.png", // Imaginea utilizatorului
    };

    if (foundUser) {
        // Arată rezultatul
        userName.textContent = foundUser.name;  // Afișează numele utilizatorului căutat
        userImage.src = foundUser.image;        // Afișează imaginea utilizatorului
        userResult.style.display = 'block';     // Arată cardul cu utilizatorul
        noUserFound.style.display = 'none';     // Ascunde mesajul de "Utilizator negăsit"
    } else {
        // Afișează mesajul de "Utilizator negăsit"
        noUserFound.style.display = 'block';
        userResult.style.display = 'none';
    }
}

function toggleFollow() {
    const followBtn = document.getElementById('follow-btn');
    
    if (isFollowing) {
        followBtn.textContent = "Urmărește";
        isFollowing = false;
    } else {
        followBtn.textContent = "Urmarit";
        isFollowing = true;
    }
}

function navigateTo(page) {
  // Ascunde toate paginile
  document.getElementById('home-page').style.display = 'none';
  document.getElementById('search-page').style.display = 'none';

  // Afișează pagina selectată
  if (page === 'home') {
      document.getElementById('home-page').style.display = 'block';
  } else if (page === 'search') {
      document.getElementById('search-page').style.display = 'block';
  }
}

// Inițial, pagina Home este vizibilă
navigateTo('home');
