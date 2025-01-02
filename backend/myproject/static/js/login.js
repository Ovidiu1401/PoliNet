document.querySelector('.login-form').addEventListener('submit', function (event) {
  console.log('Form submitted'); // Adaugă acest mesaj pentru debugging
});

document.querySelector('.register-btn').addEventListener('click', function() {
  window.location.href = this.getAttribute('data-url');
});
