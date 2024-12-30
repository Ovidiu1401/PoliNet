// Simulează datele utilizatorilor urmăriți
const followedUsers = [
  {
      username: "JohnDoe",
      image: "images/Sample.png",
      likes: 50,
      description: "Dream big, act now!"
  },
  {
      username: "JaneSmith",
      image: "images/Sample.png",
      likes: 80,
      description: "Living life to the fullest!"
  }
];

// Referințe HTML
const noContentMessage = document.getElementById("no-content");
const postTemplate = document.getElementById("post-template");
const homeContainer = document.querySelector(".home-container");

// Populează conținutul paginii
if (followedUsers.length === 0) {
  noContentMessage.style.display = "block";
} else {
  noContentMessage.style.display = "none";

  followedUsers.forEach(user => {
      const post = postTemplate.cloneNode(true);
      post.style.display = "block";
      post.querySelector(".post-header").textContent = user.username;
      post.querySelector(".post-image").src = user.image;
      post.querySelector(".like-count").textContent = `❤️ Likes: ${user.likes}`;
      post.querySelector(".post-description").textContent = user.description;

      homeContainer.appendChild(post);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const likeButtons = document.querySelectorAll(".like-button");

  likeButtons.forEach((button) => {
      button.addEventListener("click", () => {
          const likeCountElement = button.nextElementSibling;
          let likeCount = parseInt(likeCountElement.textContent);
          likeCount++;
          likeCountElement.textContent = likeCount;
      });
  });
});

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
