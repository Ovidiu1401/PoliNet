document.addEventListener("DOMContentLoaded", function() {
  // Încarcă datele profilului din LocalStorage la încărcarea paginii
  loadProfileData();

  // Încarcă postările utilizatorului
  loadUserPosts();

  // Adaugă eveniment pentru butonul de salvare a modificărilor
  document.getElementById("save-changes-btn").addEventListener("click", saveChanges);

  // Adaugă eveniment pentru butonul de închidere a ferestrei de editare
  document.getElementById("close-edit-btn").addEventListener("click", closeEditProfile);
});

// Funcție pentru a încărca datele profilului din LocalStorage
function loadProfileData() {
  const profileData = JSON.parse(localStorage.getItem("profileData"));

  // Dacă există date salvate, le aplicăm
  if (profileData) {
      document.getElementById("username").textContent = profileData.username;
      document.getElementById("post-count").textContent = profileData.postCount;
      document.getElementById("follower-count").textContent = profileData.followerCount;
  } else {
      // Dacă nu există date salvate, folosim valorile implicite
      document.getElementById("username").textContent = "Nume Utilizator";
      document.getElementById("post-count").textContent = 12;
      document.getElementById("follower-count").textContent = 300;
  }
}

// Funcție pentru a salva modificările profilului în LocalStorage
function saveChanges() {
  const username = document.getElementById("edit-username").value;

  // Actualizează numele de utilizator, numărul de postări și urmăritori
  if (username) {
      document.getElementById("username").textContent = username;
  }

  // Salvăm datele în LocalStorage
  const profileData = {
      username: document.getElementById("username").textContent,
  };
  localStorage.setItem("profileData", JSON.stringify(profileData));

  // Închide fereastra de editare
  closeEditProfile();
}

// Funcție pentru deschiderea modului de editare profil
function openEditProfile() {
  document.getElementById("edit-modal").style.display = "flex";
}

// Funcție pentru închiderea modului de editare profil
function closeEditProfile() {
  document.getElementById("edit-modal").style.display = "none";
}

// Simulează postările utilizatorului
const userPosts = [
  {
      username: "Nume Utilizator",
      image: "images/Sample.png",
      likes: 45,
      description: "Prima postare! #PrimulPost"
  },
  {
      username: "Nume Utilizator",
      image: "images/Sample.png",
      likes: 78,
      description: "A doua postare! #AlDoileaPost"
  },
  {
      username: "Nume Utilizator",
      image: "images/Sample.png",
      likes: 120,
      description: "Postare recentă! #PostNou"
  }
];

// Funcție pentru a încărca postările utilizatorului
function loadUserPosts() {
  const userPostsContainer = document.getElementById("user-posts");

  // Verifică dacă există postări
  if (userPosts.length === 0) {
      userPostsContainer.innerHTML = "<p>Nu ai postări încă.</p>";
  } else {
      // Crează carduri pentru fiecare postare
      userPosts.forEach(post => {
          const postCard = document.createElement("div");
          postCard.classList.add("post-card");

          postCard.innerHTML = `
              <div class="post-header">${post.username}</div>
              <img src="${post.image}" alt="Post Image" class="post-image">
              <div class="post-footer">
                  <span class="like-count">❤️ Likes: ${post.likes}</span>
                  <p class="post-description">${post.description}</p>
              </div>
          `;
          userPostsContainer.appendChild(postCard);
      });
  }
}
