// Așteaptă ca documentul să fie complet încărcat
document.addEventListener("DOMContentLoaded", function() {
  // Găsește butonul 'Cancel' folosind clasa 'cancel-btn'
  document.querySelector('.cancel-btn').addEventListener('click', function() {
      // Redirecționează utilizatorul către URL-ul specificat în atributul 'data-url'
      window.location.href = this.getAttribute('data-url');
  });
});
