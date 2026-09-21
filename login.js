/* =========================================================
   EduFicha • Login (index.html)
   ========================================================= */

   var USERS = [
    { email: "professor@escola.com",  senha: "123456", perfil: "professor", nome: "Prof. Ana Souza"  },
    { email: "professor2@escola.com", senha: "123456", perfil: "professor", nome: "Prof. Bruno Lima" },
    { email: "professor3@escola.com", senha: "123456", perfil: "professor", nome: "Prof. Carla Dias" },
    { email: "diretor@escola.com",    senha: "123456", perfil: "diretor",   nome: "Carlos Mendes"    }
  ];
  
  var K_SESSION = "eduficha.session.v1";
  var perfilSelecionado = "professor";
  
  document.querySelectorAll(".perfil-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      document.querySelectorAll(".perfil-btn").forEach(function (b) { b.classList.remove("is-active"); });
      btn.classList.add("is-active");
      perfilSelecionado = btn.dataset.perfil;
    });
  });
  
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
  
  document.querySelector("#loginForm").addEventListener("submit", function (e) {
    e.preventDefault();
    var email = document.querySelector("#loginEmail").value.trim().toLowerCase();
    var senha = document.querySelector("#loginSenha").value;
    var erro = document.querySelector("#loginErro");
  
    if (!email || !senha) {
      erro.textContent = "Preencha e-mail e senha.";
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
      erro.textContent = "Credenciais inválidas para o perfil selecionado.";
      erro.hidden = false;
      return;
    }
  
    try {
      localStorage.setItem(K_SESSION, JSON.stringify({
        email: user.email,
        perfil: user.perfil,
        nome: user.nome
      }));
    } catch (err) {
      erro.textContent = "Não foi possível salvar a sessão. Abra por http://localhost, não por file://";
      erro.hidden = false;
      return;
    }
  
    window.location.href = "app.html";
  });