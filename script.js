/* =========================================================
   EduFicha • script.js
   BLOCO 1 — Configuração e dados
   ========================================================= */

/* ---------- USUÁRIOS ---------- */
var USERS = [
  { email: "professor@escola.com",  senha: "123456", perfil: "professor", nome: "Prof. Ana Souza"  },
  { email: "professor2@escola.com", senha: "123456", perfil: "professor", nome: "Prof. Bruno Lima" },
  { email: "professor3@escola.com", senha: "123456", perfil: "professor", nome: "Prof. Carla Dias" },
  { email: "diretor@escola.com",    senha: "123456", perfil: "diretor",   nome: "Carlos Mendes"    }
];

/* ---------- TURMAS ---------- */
var TURMAS = [
  { id: "t1", nome: "6º Ano A", turno: "Manhã", alunos: 28 },
  { id: "t2", nome: "7º Ano B", turno: "Tarde", alunos: 30 },
  { id: "t3", nome: "8º Ano A", turno: "Manhã", alunos: 26 },
  { id: "t4", nome: "9º Ano A", turno: "Manhã", alunos: 24 },
  { id: "t5", nome: "9º Ano B", turno: "Tarde", alunos: 25 }
];

/* ---------- ESTRUTURA DA FICHA ---------- */
var DEFAULT_FICHA = [
  { id: "panorama", titulo: "Panorama da Turma", icone: "👥",
    perguntas: [
      { id: "p1", texto: "Como você descreve o comportamento geral da turma?" },
      { id: "p2", texto: "Quais são os pontos fortes e fracos da turma?" }
    ]},
  { id: "aprendizagem", titulo: "Aprendizagem e Frequência", icone: "📚",
    perguntas: [
      { id: "p3", texto: "Qual o nível médio de aprendizagem da turma?" },
      { id: "p4", texto: "Como está a frequência dos alunos? Descreva casos críticos." }
    ]},
  { id: "encaminhamentos", titulo: "Encaminhamentos", icone: "🧭",
    perguntas: [
      { id: "p5", texto: "Quais alunos necessitam de acompanhamento psicopedagógico?" },
      { id: "p6", texto: "Que ações foram encaminhadas à coordenação/direção?" }
    ]},
  { id: "sintese", titulo: "Síntese", icone: "📝",
    perguntas: [
      { id: "p7", texto: "Faça uma síntese geral do período letivo." }
    ]}
];

/* ---------- MENUS ---------- */
var MENUS = {
  professor: [
    { id: "turmas",    icone: "🏫", label: "Minhas Turmas" },
    { id: "ficha",     icone: "📝", label: "Preencher Ficha" },
    { id: "historico", icone: "🕓", label: "Histórico" }
  ],
  diretor: [
    { id: "perguntas",  icone: "⚙️", label: "Gerenciar Perguntas" },
    { id: "relatorios", icone: "📊", label: "Relatórios" },
    { id: "dashboard",  icone: "📈", label: "Dashboard" }
  ]
};

/* ---------- STORAGE ---------- */
var K_FICHA   = "eduficha.ficha.v1";
var K_REPORTS = "eduficha.reports.v2";
var K_DRAFTS  = "eduficha.drafts.v2";
var K_SESSION = "eduficha.session.v1";
var K_SEED    = "eduficha.seed.v2";
var K_RESET   = "eduficha.reset.v2";
/* =========================================================
   BLOCO 2 — Helpers, estado e dados fictícios
   ========================================================= */

   function $(sel) { return document.querySelector(sel); }
   function $$(sel) { return document.querySelectorAll(sel); }
   function uid() { return Math.random().toString(36).slice(2, 9); }
   function hoje() {
     return new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
   }
   function load(key, fallback) {
     try { var v = JSON.parse(localStorage.getItem(key)); return v === null ? fallback : v; }
     catch (e) { return fallback; }
   }
   function save(key, val) { localStorage.setItem(key, JSON.stringify(val)); }
   
   function getFicha()    { return load(K_FICHA, DEFAULT_FICHA); }
   function setFicha(f)   { save(K_FICHA, f); }
   function getReports()  { return load(K_REPORTS, []); }
   function saveReports(r){ save(K_REPORTS, r); }
   function getDrafts()   { return load(K_DRAFTS, {}); }
   function saveDrafts(d) { save(K_DRAFTS, d); }
   function getSessao()   { try { return JSON.parse(localStorage.getItem(K_SESSION)) || {}; } catch (e) { return {}; } }
   
   function toast(msg, tipo) {
     var t = $("#toast");
     if (!t) return;
     t.textContent = msg;
     t.className = "toast is-show" + (tipo ? " toast--" + tipo : "");
     t.hidden = false;
     clearTimeout(toast._t);
     toast._t = setTimeout(function () { t.classList.remove("is-show"); }, 2600);
   }
   
   var turmaSelecionada = null;
   var fichaParaVer = null;
   
   function seedDadosFicticios() {
     if (localStorage.getItem(K_SEED)) return;
   
     var hojeISO  = new Date().toISOString();
     var ontemISO = new Date(Date.now() - 86400000).toISOString();
   
     var exemplos = [
       { turmaId: "t1", professor: "Prof. Ana Souza", quando: ontemISO,
         respostas: {
           p1: "Turma bastante participativa, com bom relacionamento entre os colegas.",
           p2: "Fortes: cooperação em grupo, boa participação oral. Fracos: dificuldade em manter o foco.",
           p3: "Nível médio, com alguns alunos acima da média e cerca de 5 com dificuldades em leitura.",
           p4: "Frequência em torno de 92%. Casos: 2 alunos com faltas recorrentes.",
           p5: "Dois alunos necessitam de acompanhamento psicopedagógico.",
           p6: "Encaminhado à coordenação o caso mais crítico. Reunião com responsáveis marcada.",
           p7: "Turma com bom potencial. O foco para o próximo bimestre será a leitura e a produção textual."
         }},
       { turmaId: "t1", professor: "Prof. Bruno Lima", quando: hojeISO,
         respostas: {
           p1: "Comportamento tranquilo, turma engajada nas atividades propostas.",
           p2: "Fortes: empatia entre alunos. Fracos: alguns com dificuldade em organização do material.",
           p3: "Evolução positiva em matemática e ciências. Nível médio sólido.",
           p4: "Frequência em 95%. Sem faltas críticas nesta semana.",
           p5: "Somente um aluno continua com acompanhamento.",
           p6: "Continuidade do acompanhamento com a psicopedagoga.",
           p7: "Bimestre bastante produtivo. Turma mais organizada e participativa."
         }},
       { turmaId: "t2", professor: "Prof. Bruno Lima", quando: hojeISO,
         respostas: {
           p1: "Turma agitada, especialmente no período da tarde. Necessário retomar combinados.",
           p2: "Fortes: criatividade e participação em projetos. Fracos: dificuldade em cumprir prazos.",
           p3: "Nível heterogêneo. Boa parte da turma acompanha bem, mas um grupo precisa de reforço.",
           p4: "Frequência em 88%. Casos: 2 alunos com faltas acima do esperado.",
           p5: "Dois alunos precisam de reforço em leitura.",
           p6: "Solicitado apoio do reforço escolar. Aviso enviado aos responsáveis.",
           p7: "Turma com energia boa, mas precisa de mais foco. Ações de reforço começarão na próxima semana."
         }},
       { turmaId: "t3", professor: "Prof. Carla Dias", quando: hojeISO,
         respostas: {
           p1: "Turma disciplinada, silenciosa, mas pouco participativa em discussões.",
           p2: "Fortes: respeito e organização. Fracos: participação oral limitada.",
           p3: "Nível médio-alto. Alunos com bom desempenho em avaliações.",
           p4: "Frequência excelente, 97%. Sem casos críticos.",
           p5: "Nenhum caso grave. Um aluno apresenta timidez excessiva em apresentações.",
           p6: "Encaminhamento para oficina de oratória sugerido à coordenação.",
           p7: "Turma academicamente sólida. Próximo passo é estimular mais a oralidade."
         }}
     ];
   
     var seed = [];
     exemplos.forEach(function (ex) {
       var t = null;
       for (var i = 0; i < TURMAS.length; i++) if (TURMAS[i].id === ex.turmaId) t = TURMAS[i];
       if (!t) return;
       seed.push({
         id: uid(),
         turmaId: t.id,
         turmaNome: t.nome,
         professor: ex.professor,
         data: ex.quando,
         respostas: ex.respostas,
         fichaSnapshot: JSON.parse(JSON.stringify(DEFAULT_FICHA))
       });
     });
   
     saveReports(seed);
     localStorage.setItem(K_SEED, "1");
   }
   /* =========================================================
   BLOCO 3 — Inicialização, sidebar e navegação
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  /* Reset automático na primeira abertura dessa versão */
  if (!localStorage.getItem(K_RESET)) {
    localStorage.removeItem(K_REPORTS);
    localStorage.removeItem(K_DRAFTS);
    localStorage.removeItem(K_SEED);
    localStorage.setItem(K_RESET, "1");
  }

  var s = getSessao();

  if (!s || !s.email) {
    window.location.href = "index.html";
    return;
  }

  var user = null;
  for (var i = 0; i < USERS.length; i++) if (USERS[i].email === s.email) user = USERS[i];
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  seedDadosFicticios();

  $("#userName").textContent = user.nome;
  $("#userRole").textContent = user.perfil === "professor" ? "Professor(a)" : "Diretor(a)";
  $("#userAvatar").textContent = user.nome.charAt(0).toUpperCase();
  $("#topbarDate").textContent = hoje();

  buildSidebar(user.perfil);
  navigate(user.perfil === "professor" ? "turmas" : "relatorios");

  $("#logoutBtn").addEventListener("click", function () {
    localStorage.removeItem(K_SESSION);
    window.location.href = "index.html";
  });

  $("#menuBtn").addEventListener("click", function () {
    $("#sidebar").classList.toggle("is-open");
    $("#overlay").classList.toggle("is-open");
  });

  $("#overlay").addEventListener("click", closeSidebarMobile);
});

function buildSidebar(perfil) {
  var nav = $("#sidebarNav");
  nav.innerHTML = "";
  MENUS[perfil].forEach(function (item) {
    var btn = document.createElement("button");
    btn.className = "nav-item";
    btn.dataset.page = item.id;
    btn.innerHTML = '<span class="nav-ico">' + item.icone + '</span> ' + item.label;
    btn.addEventListener("click", function () { navigate(item.id); });
    nav.appendChild(btn);
  });
}

function navigate(page, param) {
  $$(".nav-item").forEach(function (b) {
    b.classList.toggle("is-active", b.dataset.page === page);
  });

  var titles = {
    turmas:      ["Turmas disponíveis", "Clique em uma turma para preencher a ficha geral"],
    ficha:       ["Preencher Ficha da Turma", "Responda as seções da ficha geral da turma"],
    historico:   ["Histórico", "Fichas já enviadas por você"],
    perguntas:   ["Gerenciar Perguntas", "Adicione, edite ou remova perguntas das fichas"],
    relatorios:  ["Relatórios por Turma", "Clique em uma turma para ver o consolidado"],
    dashboard:   ["Dashboard", "Indicadores gerais da escola"],
    "ver-ficha": ["Consolidado da Turma", "Respostas agrupadas por pergunta"]
  };
  var meta = titles[page] || ["—", "—"];
  $("#pageTitle").textContent = meta[0];
  $("#pageSubtitle").textContent = meta[1];

  if (page === "ver-ficha") fichaParaVer = param;

  closeSidebarMobile();
  render(page);
}

function closeSidebarMobile() {
  var sb = $("#sidebar");
  var ov = $("#overlay");
  if (sb) sb.classList.remove("is-open");
  if (ov) ov.classList.remove("is-open");
}

function render(page) {
  var c = $("#content");
  c.innerHTML = "";
  switch (page) {
    case "turmas":     renderTurmas(c);     break;
    case "ficha":      renderFicha(c);      break;
    case "historico":  renderHistorico(c);  break;
    case "perguntas":  renderPerguntas(c);  break;
    case "relatorios": renderRelatorios(c); break;
    case "dashboard":  renderDashboard(c);  break;
    case "ver-ficha":  renderVerFicha(c);   break;
  }
}
/* =========================================================
   BLOCO 4 — Telas do Professor e do Diretor
   ========================================================= */

/* ---------- PROFESSOR — TURMAS ---------- */
function renderTurmas(c) {
  var box = document.createElement("div");
  box.className = "card";
  box.innerHTML = '<div class="card__head">' +
      '<div><h3>Turmas disponíveis</h3><p>Clique em uma turma para preencher a ficha geral</p></div>' +
    '</div>';

  var wrap = document.createElement("div");
  wrap.className = "grid grid--3";

  TURMAS.forEach(function (t) {
    var card = document.createElement("button");
    card.className = "turma-card";
    card.innerHTML =
      '<span class="turma-card__badge">' + t.turno + '</span>' +
      '<h4>' + t.nome + '</h4>' +
      '<p>' + t.alunos + ' alunos matriculados</p>';
    card.addEventListener("click", function () {
      turmaSelecionada = t;
      navigate("ficha");
    });
    wrap.appendChild(card);
  });

  box.appendChild(wrap);
  c.appendChild(box);
}

/* ---------- PROFESSOR — FICHA DA TURMA ---------- */
function renderFicha(c) {
  var turma = turmaSelecionada || TURMAS[0];
  if (!turma) {
    c.innerHTML = '<div class="card"><div class="empty"><div class="empty__ico">📭</div><h4>Sem turmas</h4></div></div>';
    return;
  }

  var ficha = getFicha();
  var drafts = getDrafts();
  var draftKey = turma.id;
  var draft = drafts[draftKey] || {};

  var topo = document.createElement("div");
  topo.className = "card";
  topo.innerHTML =
    '<div class="card__head">' +
      '<div><h3>' + turma.nome + '</h3><p>Preencha a ficha geral da turma</p></div>' +
    '</div>' +
    '<div class="toolbar">' +
      '<div class="field">' +
        '<label>Turma</label>' +
        '<select id="selTurma">' +
          TURMAS.map(function (t) {
            return '<option value="' + t.id + '"' + (t.id === turma.id ? " selected" : "") + '>' + t.nome + '</option>';
          }).join("") +
        '</select>' +
      '</div>' +
    '</div>';
  c.appendChild(topo);

  ficha.forEach(function (sec) {
    var el = document.createElement("div");
    el.className = "ficha-section";
    el.innerHTML =
      '<div class="ficha-section__head">' +
        '<span>' + sec.icone + '</span>' +
        '<h4>' + sec.titulo + '</h4>' +
      '</div>';

    var body = document.createElement("div");
    body.className = "ficha-section__body";

    sec.perguntas.forEach(function (p) {
      var val = draft[p.id] || "";
      var q = document.createElement("div");
      q.className = "pergunta";
      q.innerHTML =
        '<label for="resp-' + p.id + '">' + p.texto + '</label>' +
        '<textarea id="resp-' + p.id + '" data-pid="' + p.id + '" rows="3" placeholder="Digite sua resposta...">' + val + '</textarea>';
      body.appendChild(q);
    });
    el.appendChild(body);
    c.appendChild(el);
  });

  var acoes = document.createElement("div");
  acoes.className = "card actions";
  acoes.innerHTML =
    '<button class="btn btn--ghost" id="btnRascunho">💾 Salvar rascunho</button>' +
    '<button class="btn btn--primary" id="btnEnviar">📤 Enviar ficha</button>';
  c.appendChild(acoes);

  $("#selTurma").addEventListener("change", function (e) {
    var nova = null;
    for (var i = 0; i < TURMAS.length; i++) if (TURMAS[i].id === e.target.value) nova = TURMAS[i];
    turmaSelecionada = nova;
    navigate("ficha");
  });

  function coletarRespostas() {
    var respostas = {};
    $$("textarea[data-pid]").forEach(function (ta) {
      respostas[ta.dataset.pid] = ta.value.trim();
    });
    return respostas;
  }

  $("#btnRascunho").addEventListener("click", function () {
    var d = getDrafts();
    d[draftKey] = coletarRespostas();
    saveDrafts(d);
    toast("Rascunho salvo com sucesso!", "ok");
  });

  $("#btnEnviar").addEventListener("click", function () {
    var respostas = coletarRespostas();
    var vazias = 0;
    for (var k in respostas) if (!respostas[k]) vazias++;

    if (vazias > 0 && !confirm("Existem " + vazias + " pergunta(s) sem resposta. Enviar mesmo assim?")) return;

    var reports = getReports();
    reports.unshift({
      id: uid(),
      turmaId: turma.id,
      turmaNome: turma.nome,
      professor: $("#userName").textContent,
      data: new Date().toISOString(),
      respostas: respostas,
      fichaSnapshot: JSON.parse(JSON.stringify(getFicha()))
    });
    saveReports(reports);

    var d = getDrafts();
    delete d[draftKey];
    saveDrafts(d);

    toast("Ficha enviada com sucesso!", "ok");
    navigate("historico");
  });
}

/* ---------- PROFESSOR — HISTÓRICO ---------- */
function renderHistorico(c) {
  var nome = $("#userName").textContent;
  var reports = getReports().filter(function (r) { return r.professor === nome; });

  var box = document.createElement("div");
  box.className = "card";
  box.innerHTML = '<div class="card__head">' +
      '<div><h3>Minhas fichas enviadas</h3><p>' + reports.length + ' registro(s)</p></div>' +
    '</div>';

  if (!reports.length) {
    box.innerHTML +=
      '<div class="empty">' +
        '<div class="empty__ico">📭</div>' +
        '<h4>Nenhuma ficha enviada ainda</h4>' +
        '<p>Preencha uma ficha em "Preencher Ficha" para vê-la aqui.</p>' +
      '</div>';
    c.appendChild(box);
    return;
  }

  var wrap = document.createElement("div");
  wrap.className = "table-wrap";
  wrap.innerHTML =
    '<table>' +
      '<thead><tr><th>Data</th><th>Turma</th><th>Status</th></tr></thead>' +
      '<tbody>' +
        reports.map(function (r) {
          return '<tr>' +
            '<td>' + new Date(r.data).toLocaleDateString("pt-BR") + '</td>' +
            '<td>' + r.turmaNome + '</td>' +
            '<td><span class="badge badge--ok">Enviada</span></td>' +
          '</tr>';
        }).join("") +
      '</tbody>' +
    '</table>';
  box.appendChild(wrap);
  c.appendChild(box);
}

/* ---------- DIRETOR — RELATÓRIOS POR TURMA ---------- */
function renderRelatorios(c) {
  var reports = getReports();

  var box = document.createElement("div");
  box.className = "card";
  box.innerHTML =
    '<div class="card__head">' +
      '<div><h3>Turmas com fichas recebidas</h3>' +
      '<p>' + reports.length + ' ficha(s). Clique em uma turma para ver o consolidado.</p></div>' +
      '<div class="toolbar">' +
        '<div class="field" style="min-width:200px">' +
          '<input id="filtro" placeholder="🔎 Filtrar por turma..." />' +
        '</div>' +
      '</div>' +
    '</div>' +
    '<div id="listaTurmas"></div>';
  c.appendChild(box);

  function desenhar(filtro) {
    filtro = (filtro || "").toLowerCase();
    var lista = $("#listaTurmas");

    var turmasComFicha = TURMAS.filter(function (t) {
      return reports.some(function (r) { return r.turmaId === t.id; });
    }).filter(function (t) {
      return !filtro || t.nome.toLowerCase().indexOf(filtro) >= 0;
    });

    if (!turmasComFicha.length) {
      lista.innerHTML =
        '<div class="empty">' +
          '<div class="empty__ico">📭</div>' +
          '<h4>Nenhuma turma com fichas</h4>' +
          '<p>Os professores ainda não enviaram fichas.</p>' +
        '</div>';
      return;
    }

    var html = '<div class="grid grid--3">';
    turmasComFicha.forEach(function (t) {
      var fichasTurma = reports.filter(function (r) { return r.turmaId === t.id; });
      var pct = Math.min(100, Math.round((fichasTurma.length / t.alunos) * 100));

      html +=
        '<button class="turma-card" data-turma="' + t.id + '">' +
          '<span class="turma-card__badge">' + t.turno + '</span>' +
          '<h4>' + t.nome + '</h4>' +
          '<div class="progress" style="margin:10px 0 8px">' +
            '<div class="progress__bar" style="width:' + pct + '%"></div>' +
          '</div>' +
          '<p style="font-size:12.5px;color:#64748b">' +
            fichasTurma.length + ' ficha(s) recebida(s)' +
          '</p>' +
        '</button>';
    });
    html += '</div>';
    lista.innerHTML = html;

    lista.querySelectorAll("[data-turma]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        navigate("ver-ficha", btn.dataset.turma);
      });
    });
  }

  desenhar("");
  $("#filtro").addEventListener("input", function (e) { desenhar(e.target.value); });
}

/* ---------- DIRETOR — CONSOLIDADO POR TURMA ---------- */
function renderVerFicha(c) {
  var turmaId = fichaParaVer;
  var todas = getReports();

  var turma = null;
  for (var i = 0; i < TURMAS.length; i++) if (TURMAS[i].id === turmaId) turma = TURMAS[i];

  var reports = todas.filter(function (r) { return r.turmaId === turmaId; });

  var topo = document.createElement("div");
  topo.className = "card";
  topo.innerHTML =
    '<div class="card__head" style="margin-bottom:0">' +
      '<div>' +
        '<h3>' + (turma ? turma.nome + " — Consolidado" : "Turma não encontrada") + '</h3>' +
        '<p>' + reports.length + ' ficha(s) enviada(s) nesta turma</p>' +
      '</div>' +
      '<button class="btn btn--ghost" id="btnVoltar">← Voltar</button>' +
    '</div>';
  c.appendChild(topo);

  if (!turma || !reports.length) {
    var err = document.createElement("div");
    err.className = "card";
    err.innerHTML =
      '<div class="empty">' +
        '<div class="empty__ico">⚠️</div>' +
        '<h4>Sem fichas nesta turma</h4>' +
        '<p>Nenhum professor enviou fichas ainda.</p>' +
      '</div>';
    c.appendChild(err);
    var a = document.createElement("div");
    a.className = "card actions";
    a.innerHTML = '<button class="btn btn--primary" id="btnVoltar2">← Voltar</button>';
    c.appendChild(a);
    $("#btnVoltar").addEventListener("click", voltarParaOrigem);
    $("#btnVoltar2").addEventListener("click", voltarParaOrigem);
    return;
  }

  var snapshot = reports[0].fichaSnapshot;

  snapshot.forEach(function (sec) {
    var el = document.createElement("div");
    el.className = "ficha-section";
    el.innerHTML =
      '<div class="ficha-section__head">' +
        '<span>' + sec.icone + '</span>' +
        '<h4>' + sec.titulo + '</h4>' +
      '</div>';

    var body = document.createElement("div");
    body.className = "ficha-section__body";

    sec.perguntas.forEach(function (p) {
      var bloco = document.createElement("div");
      bloco.style.cssText = "border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;margin-bottom:14px";

      var head = document.createElement("div");
      head.style.cssText = "padding:12px 14px;background:#eff6ff;border-bottom:1px solid #dbeafe";
      head.innerHTML = '<strong style="font-size:13.5px;color:#1e3a8a">' + p.texto + '</strong>';
      bloco.appendChild(head);

      var lista = document.createElement("div");
      lista.style.cssText = "padding:6px 14px";

      var temResposta = false;
      reports.forEach(function (r) {
        var txt = r.respostas[p.id];
        if (!txt) return;
        temResposta = true;
        var item = document.createElement("div");
        item.style.cssText = "padding:10px 0;border-bottom:1px solid #f1f5f9";
        item.innerHTML =
          '<div style="display:flex;justify-content:space-between;gap:10px;margin-bottom:4px">' +
            '<strong style="font-size:12.5px;color:#334155">' + (r.professor || "—") + '</strong>' +
            '<span style="font-size:11.5px;color:#64748b">' +
              new Date(r.data).toLocaleDateString("pt-BR") + '</span>' +
          '</div>' +
          '<p style="font-size:13px;color:#0f172a;white-space:pre-wrap">' + txt + '</p>';
        lista.appendChild(item);
      });

      if (!temResposta) {
        lista.innerHTML =
          '<p style="font-size:12.5px;color:#64748b;padding:10px 0"><em>Nenhuma resposta registrada.</em></p>';
      }
      bloco.appendChild(lista);
      body.appendChild(bloco);
    });

    el.appendChild(body);
    c.appendChild(el);
  });

  var acoes = document.createElement("div");
  acoes.className = "card actions";
  acoes.innerHTML = '<button class="btn btn--primary" id="btnVoltar2">← Voltar</button>';
  c.appendChild(acoes);

  $("#btnVoltar").addEventListener("click", voltarParaOrigem);
  $("#btnVoltar2").addEventListener("click", voltarParaOrigem);
}

function voltarParaOrigem() {
  var perfil = getSessao().perfil;
  if (perfil === "diretor") navigate("relatorios");
  else navigate("historico");
}

/* ---------- DIRETOR — GERENCIAR PERGUNTAS ---------- */
function renderPerguntas(c) {
  var ficha = getFicha();

  ficha.forEach(function (sec, idx) {
    var el = document.createElement("div");
    el.className = "card";
    el.innerHTML =
      '<div class="card__head">' +
        '<div>' +
          '<h3>' + sec.icone + ' ' + sec.titulo + '</h3>' +
          '<p>' + sec.perguntas.length + ' pergunta(s)</p>' +
        '</div>' +
        '<button class="btn btn--primary btn--sm" data-add="' + idx + '">+ Adicionar</button>' +
      '</div>' +
      '<div class="lista-perguntas">' +
        (sec.perguntas.length ? sec.perguntas.map(function (p) {
          return '<div class="pergunta" style="display:flex;gap:10px;align-items:flex-start;border-bottom:1px solid #f1f5f9;padding:10px 0">' +
            '<span style="flex:1;font-size:13.5px">' + p.texto + '</span>' +
            '<button class="btn btn--ghost btn--sm" data-edit="' + idx + ':' + p.id + '">✏️</button>' +
            '<button class="btn btn--danger btn--sm" data-del="' + idx + ':' + p.id + '">🗑️</button>' +
          '</div>';
        }).join("") : '<p style="font-size:13px;color:#64748b">Nenhuma pergunta.</p>') +
      '</div>';
    c.appendChild(el);
  });

  $$("[data-add]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var idx = parseInt(btn.dataset.add, 10);
      var texto = prompt("Digite o texto da nova pergunta:");
      if (!texto || !texto.trim()) return;
      var f = getFicha();
      f[idx].perguntas.push({ id: uid(), texto: texto.trim() });
      setFicha(f);
      toast("Pergunta adicionada!", "ok");
      navigate("perguntas");
    });
  });

  $$("[data-edit]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var parts = btn.dataset.edit.split(":");
      var idx = parseInt(parts[0], 10);
      var pid = parts[1];
      var f = getFicha();
      var p = null;
      for (var i = 0; i < f[idx].perguntas.length; i++) if (f[idx].perguntas[i].id === pid) p = f[idx].perguntas[i];
      if (!p) return;
      var novo = prompt("Editar pergunta:", p.texto);
      if (!novo || !novo.trim()) return;
      p.texto = novo.trim();
      setFicha(f);
      toast("Pergunta atualizada!", "ok");
      navigate("perguntas");
    });
  });

  $$("[data-del]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var parts = btn.dataset.del.split(":");
      var idx = parseInt(parts[0], 10);
      var pid = parts[1];
      if (!confirm("Remover esta pergunta?")) return;
      var f = getFicha();
      f[idx].perguntas = f[idx].perguntas.filter(function (x) { return x.id !== pid; });
      setFicha(f);
      toast("Pergunta removida.", "ok");
      navigate("perguntas");
    });
  });
}

/* ---------- DIRETOR — DASHBOARD ---------- */
function renderDashboard(c) {
  var reports = getReports();
  var totalAlunos = 0;
  TURMAS.forEach(function (t) { totalAlunos += t.alunos; });
  var cobertura = totalAlunos ? Math.round((reports.length / totalAlunos) * 100) : 0;

  var stats = document.createElement("div");
  stats.className = "grid grid--4";
  stats.innerHTML =
  '<div class="stat">' +
  '<div class="stat__ico">📋</div>' +
  '<div><div class="stat__val">' + reports.length + '</div><div class="stat__lbl">Fichas enviadas</div></div>' +
'</div>' +
'<div class="stat">' +
  '<div class="stat__ico">📈</div>' +
  '<div><div class="stat__val">' + cobertura + '%</div><div class="stat__lbl">Cobertura de fichas</div></div>' +
'</div>';
c.appendChild(stats);

var box = document.createElement("div");
box.className = "card";
box.innerHTML = '<div class="card__head">' +
  '<div><h3>Progresso por turma</h3><p>Quantidade de fichas recebidas</p></div>' +
'</div>';

TURMAS.forEach(function (t) {
var qtd = reports.filter(function (r) { return r.turmaId === t.id; }).length;
var pct = Math.min(100, Math.round((qtd / t.alunos) * 100));
var linha = document.createElement("div");
linha.style.cssText = "margin-bottom:16px";
linha.innerHTML =
  '<div style="display:flex;justify-content:space-between;font-size:13.5px;margin-bottom:6px">' +
    '<strong>' + t.nome + '</strong>' +
    '<span style="color:#64748b">' + qtd + ' / ' + t.alunos + ' fichas</span>' +
  '</div>' +
  '<div class="progress"><div class="progress__bar" style="width:' + pct + '%"></div></div>';
box.appendChild(linha);
});
c.appendChild(box);

var ult = document.createElement("div");
ult.className = "card";
ult.innerHTML = '<div class="card__head">' +
  '<div><h3>Últimas fichas recebidas</h3><p>5 registros mais recentes</p></div>' +
'</div>';

var recentes = reports.slice(0, 5);
if (!recentes.length) {
ult.innerHTML +=
  '<div class="empty">' +
    '<div class="empty__ico">📭</div>' +
    '<h4>Sem fichas ainda</h4>' +
    '<p>Aguardando envios dos professores.</p>' +
  '</div>';
} else {
ult.innerHTML +=
  '<div class="table-wrap">' +
    '<table>' +
      '<thead><tr><th>Turma</th><th>Professor</th><th>Data</th></tr></thead>' +
      '<tbody>' +
        recentes.map(function (r) {
          return '<tr>' +
            '<td>' + r.turmaNome + '</td>' +
            '<td>' + (r.professor || "—") + '</td>' +
            '<td>' + new Date(r.data).toLocaleDateString("pt-BR") + '</td>' +
          '</tr>';
        }).join("") +
      '</tbody>' +
    '</table>' +
  '</div>';
}
c.appendChild(ult);
}