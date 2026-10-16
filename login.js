/* ============================================================
   SGAE • Login
   ============================================================ */

var USERS = [
  { email:"professor@edu.gov.br",   senha:"123456", perfil:"professor",   nome:"Prof. Ana Souza",      escola:"EE Dom Pedro II" },
  { email:"coordenador@edu.gov.br", senha:"123456", perfil:"coordenador", nome:"Coord. Marcos Reis",   escola:"EE Dom Pedro II" },
  { email:"diretor@edu.gov.br",     senha:"123456", perfil:"diretor",     nome:"Dir. Carlos Mendes",   escola:"EE Dom Pedro II" },
  { email:"rede@edu.gov.br",        senha:"123456", perfil:"rede",        nome:"Admin. Rede Estadual", escola:"Todas as unidades" }
];

var K_SESSION = "sgae.session.v1";
var K_FAILS   = "sgae.fails.v1";
var SESSION_HOURS = 8;
var MAX_FAILS = 5;

var perfilSelecionado = "professor";

/* Perfil */
document.querySelectorAll(".perfil-btn").forEach(function (btn) {
  btn.addEventListener("click", function () {
    document.querySelectorAll(".perfil-btn").forEach(function (b) { b.classList.remove("is-active"); });
    btn.classList.add("is-active");
    perfilSelecionado = btn.dataset.perfil;
  });
});

/* Chips demo */
document.querySelectorAll(".demo-chip").forEach(function (chip) {
  chip.addEventListener("click", function () {
    document.querySelector("#loginEmail").value = chip.dataset.email;
    document.querySelector("#loginSenha").value = chip.dataset.senha;
    perfilSelecionado = chip.dataset.perfil;
    document.querySelectorAll(".perfil-btn").forEach(function (b) {
      b.classList.toggle("is-active", b.dataset.perfil === perfilSelecionado);
    });
  });
});

/* Toggle senha */
document.querySelector("#toggleSenha").addEventListener("click", function () {
  var i = document.querySelector("#loginSenha");
  i.type = i.type === "password" ? "text" : "password";
});

/* Submit */
document.querySelector("#loginForm").addEventListener("submit", function (e) {
  e.preventDefault();
  var email = document.querySelector("#loginEmail").value.trim().toLowerCase();
  var senha = document.querySelector("#loginSenha").value;
  var erro = document.querySelector("#loginErro");

  if (!email || !senha) {
    erro.textContent = "⚠️ Preencha e-mail e senha.";
    erro.hidden = false;
    return;
  }

  /* Bloqueio por tentativas */
  var fails = {};
  try { fails = JSON.parse(localStorage.getItem(K_FAILS)) || {}; } catch (e2) {}
  var f = fails[email] || { count: 0, since: 0 };
  if (f.count >= MAX_FAILS && Date.now() - f.since < 15 * 60 * 1000) {
    erro.textContent = "🔒 Conta temporariamente bloqueada. Tente novamente em 15 minutos.";
    erro.hidden = false;
    return;
  }

  var user = null;
  for (var i = 0; i < USERS.length; i++) {
    if (USERS[i].email === email && USERS[i].senha === senha && USERS[i].perfil === perfilSelecionado) {
      user = USERS[i];
      break;
    }
  }

  if (!user) {
    f.count = (f.count || 0) + 1;
    f.since = f.since || Date.now();
    fails[email] = f;
    try { localStorage.setItem(K_FAILS, JSON.stringify(fails)); } catch (e3) {}
    erro.textContent = "❌ Credenciais inválidas para o perfil selecionado.";
    erro.hidden = false;
    return;
  }

  /* Sucesso — limpa falhas */
  delete fails[email];
  try { localStorage.setItem(K_FAILS, JSON.stringify(fails)); } catch (e4) {}

  var session = {
    email: user.email,
    perfil: user.perfil,
    nome: user.nome,
    escola: user.escola,
    loginAt: Date.now(),
    expiresAt: Date.now() + SESSION_HOURS * 60 * 60 * 1000,
    token: Math.random().toString(36).slice(2) + Date.now().toString(36)
  };

  try {
    localStorage.setItem(K_SESSION, JSON.stringify(session));
  } catch (err) {
    erro.textContent = "⚠️ Não foi possível salvar a sessão. Abra via servidor local (http://localhost).";
    erro.hidden = false;
    return;
  }

  window.location.href = "app.html";
});
