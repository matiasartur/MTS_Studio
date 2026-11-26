// =========================================================
// MTS Studio — Scripts da página
// 1. Menu do celular
// 2. Carrossel de planos
// =========================================================


// ---------- 1. Menu do celular ----------
// Abre e fecha o menu ao tocar no botão ☰

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


// ---------- 2. Carrossel de planos ----------
// Gira sozinho a cada alguns segundos, pausa com o mouse em cima,
// e pode ser controlado pelas setas, bolinhas, clique ou arrastando.

(function () {
  var carrossel = document.getElementById('planosCarrossel');
  if (!carrossel) return;

  var cards = carrossel.querySelectorAll('.plano');
  var controles = document.getElementById('carrosselControles');
  var pontosBox = document.getElementById('carrosselPontos');
  var total = cards.length;

  var INTERVALO = 4000; // tempo (ms) que cada plano fica no centro
  var reduzMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var atual = 1;        // começa pelo plano do meio ("Profissional")
  var timer = null;
  var pausado = false;
  var inicioX = null;   // posição onde o dedo/mouse começou a arrastar
  var arrastou = false; // evita que um arrasto conte também como clique

  // Ativa o modo carrossel no CSS e mostra os controles
  carrossel.classList.add('carrossel-ativo');
  controles.hidden = false;

  // Cria uma bolinha para cada plano
  var pontos = [];
  for (var p = 0; p < total; p++) {
    var ponto = document.createElement('button');
    ponto.className = 'carrossel-ponto';
    ponto.setAttribute('aria-label', 'Ver plano ' + (p + 1));
    ponto.addEventListener('click', irPara.bind(null, p));
    pontosBox.appendChild(ponto);
    pontos.push(ponto);
  }

  // Posiciona cada card: -1 (esquerda), 0 (centro), 1 (direita)
  function atualizar() {
    for (var i = 0; i < total; i++) {
      var pos = i - atual;
      // Faz o carrossel "dar a volta": o último fica à esquerda do primeiro
      if (pos > total / 2) pos -= total;
      if (pos < -total / 2) pos += total;

      cards[i].style.setProperty('--pos', pos);
      cards[i].classList.toggle('is-ativo', pos === 0);
      cards[i].classList.toggle('is-escondido', Math.abs(pos) > 1);
      pontos[i].classList.toggle('is-ativo', pos === 0);
      pontos[i].setAttribute('aria-current', pos === 0 ? 'true' : 'false');
    }
  }

  function irPara(indice) {
    atual = (indice + total) % total;
    atualizar();
    reiniciarTimer();
  }

  function proximo()  { irPara(atual + 1); }
  function anterior() { irPara(atual - 1); }

  // Giro automático
  function reiniciarTimer() {
    clearInterval(timer);
    if (reduzMovimento || pausado) return;
    timer = setInterval(function () {
      atual = (atual + 1) % total;
      atualizar();
    }, INTERVALO);
  }

  function pausar()   { pausado = true;  clearInterval(timer); }
  function retomar()  { pausado = false; reiniciarTimer(); }

  // Setas
  document.getElementById('carrosselProximo').addEventListener('click', proximo);
  document.getElementById('carrosselAnterior').addEventListener('click', anterior);

  // Clicar (ou navegar com Tab) em um card lateral traz ele para o centro
  for (var c = 0; c < total; c++) {
    (function (indice) {
      cards[indice].addEventListener('click', function (evento) {
        if (arrastou) {             // foi um arrasto, não um clique
          evento.preventDefault();
          arrastou = false;
          return;
        }
        if (indice !== atual) {
          evento.preventDefault(); // não segue o link do botão ainda
          irPara(indice);
        }
      });
      // Só pelo teclado (Tab): o clique do mouse já é tratado acima
      cards[indice].addEventListener('focusin', function (evento) {
        if (indice !== atual && evento.target.matches(':focus-visible')) irPara(indice);
      });
    })(c);
  }

  // Pausa enquanto o mouse está em cima ou algo dentro tem foco
  carrossel.addEventListener('mouseenter', pausar);
  carrossel.addEventListener('mouseleave', retomar);
  carrossel.addEventListener('focusin', pausar);
  carrossel.addEventListener('focusout', retomar);

  // Arrastar para os lados (celular e mouse)
  carrossel.addEventListener('pointerdown', function (e) {
    inicioX = e.clientX;
    arrastou = false;
  });
  carrossel.addEventListener('pointerup', function (e) {
    if (inicioX === null) return;
    var distancia = e.clientX - inicioX;
    inicioX = null;
    if (Math.abs(distancia) > 40) {
      arrastou = true;
      if (distancia < 0) proximo();
      else anterior();
    }
  });

  // Não gira enquanto a aba do navegador está escondida
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) clearInterval(timer);
    else reiniciarTimer();
  });

  atualizar();
  reiniciarTimer();
})();
