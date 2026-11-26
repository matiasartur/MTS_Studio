// =========================================================
// Lumen Studio — Menu do celular
// Abre e fecha o menu ao tocar no botão ☰
// =========================================================

var botao = document.getElementById('menuBtn');
var menu = document.getElementById('menuMobile');

// Alterna o menu entre aberto e fechado
botao.addEventListener('click', function () {
  menu.classList.toggle('aberto');
  var aberto = menu.classList.contains('aberto');
  botao.setAttribute('aria-expanded', aberto);
});

// Fecha o menu quando clicar em um link
var links = menu.querySelectorAll('a');
for (var i = 0; i < links.length; i++) {
  links[i].addEventListener('click', function () {
    menu.classList.remove('aberto');
    botao.setAttribute('aria-expanded', false);
  });
}
