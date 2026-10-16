/* ============================================================
   SGAE • script.js (app)
   ============================================================ */

var ESCOLAS = [
  { id: "e1", nome: "EE Dom Pedro II",     cidade: "Belo Horizonte", alunos: 480 },
  { id: "e2", nome: "EE Getúlio Vargas",   cidade: "Contagem",       alunos: 620 },
  { id: "e3", nome: "EE Machado de Assis", cidade: "Betim",          alunos: 350 }
];

var USERS = [
  { email:"professor@edu.gov.br",   senha:"123456", perfil:"professor",   nome:"Prof. Ana Souza",      escolaId:"e1" },
  { email:"coordenador@edu.gov.br", senha:"123456", perfil:"coordenador", nome:"Coord. Marcos Reis",   escolaId:"e1" },
  { email:"diretor@edu.gov.br",     senha:"123456", perfil:"diretor",     nome:"Dir. Carlos Mendes",   escolaId:"e1" },
  { email:"rede@edu.gov.br",        senha:"123456", perfil:"rede",        nome:"Admin. Rede Estadual", escolaId:null }
];

var TURMAS = [
  { id:"t1", nome:"6º Ano A", turno:"Manhã", alunos:28, escolaId:"e1" },
  { id:"t2", nome:"7º Ano B", turno:"Tarde", alunos:30, escolaId:"e1" },
  { id:"t3", nome:"8º Ano A", turno:"Manhã", alunos:26, escolaId:"e1" },
  { id:"t4", nome:"9º Ano A", turno:"Manhã", alunos:24, escolaId:"e2" },
  { id:"t5", nome:"9º Ano B", turno:"Tarde", alunos:25, escolaId:"e2" }
];

var DEFAULT_FICHA = [
  { id:"panorama", titulo:"Panorama da Turma", icone:"👥",
    perguntas:[
      { id:"p1", texto:"Como você descreve o comportamento geral da turma?" },
      { id:"p2", texto:"Quais são os pontos fortes e fracos da turma?" }
    ]},
  { id:"aprendizagem", titulo:"Aprendizagem e Frequência", icone:"📚",
    perguntas:[
      { id:"p3", texto:"Qual o nível médio de aprendizagem da turma?" },
      { id:"p4", texto:"Como está a frequência dos alunos? Descreva casos críticos." }
    ]},
  { id:"encaminhamentos", titulo:"Encaminhamentos", icone:"🧭",
    perguntas:[
      { id:"p5", texto:"Quais alunos necessitam de acompanhamento psicopedagógico?" },
      { id:"p6", texto:"Que ações foram encaminhadas à coordenação/direção?" }
    ]},
  { id:"sintese", titulo:"Síntese", icone:"📝",
    perguntas:[
      { id:"p7", texto:"Faça uma síntese geral do período letivo." }
    ]}
];

var MENUS = {
  professor: [
    { grupo:"Sala de aula", itens:[
      { id:"turmas",    icone:"🏫", label:"Minhas Turmas" },
      { id:"ficha",     icone:"📝", label:"Preencher Ficha" },
      { id:"historico", icone:"🕓", label:"Histórico" }
    ]},
    { grupo:"Conta", itens:[
      { id:"perfil", icone:"👤", label:"Meu Perfil" }
    ]}
  ],
  coordenador: [
    { grupo:"Pedagógico", itens:[
      { id:"fichas-escola", icone:"📋", label:"Fichas da Escola" },
      { id:"relatorios",    icone:"📊", label:"Relatórios" }
    ]},
    { grupo:"Gestão", itens:[
      { id:"dashboard", icone:"📈", label:"Painel" },
      { id:"auditoria", icone:"📜", label:"Auditoria" }
    ]},
    { grupo:"Conta", itens:[
      { id:"perfil", icone:"👤", label:"Meu Perfil" }
    ]}
  ],
  diretor: [
    { grupo:"Pedagógico", itens:[
      { id:"fichas-escola", icone:"📋", label:"Fichas da Escola" },
      { id:"relatorios",    icone:"📊", label:"Relatórios" }
    ]},
    { grupo:"Gestão", itens:[
      { id:"dashboard", icone:"📈", label:"Painel" },
      { id:"perguntas", icone:"⚙️", label:"Gerenciar Perguntas" },
      { id:"auditoria", icone:"📜", label:"Auditoria" }
    ]},
    { grupo:"Conta", itens:[
      { id:"perfil", icone:"👤", label:"Meu Perfil" }
    ]}
  ],
  rede: [
    { grupo:"Rede Estadual", itens:[
      { id:"escolas",         icone:"🏛️", label:"Escolas" },
      { id:"fichas-escola",   icone:"📋", label:"Fichas das Escolas" },
      { id:"relatorios",      icone:"📊", label:"Relatórios da Rede" }
    ]},
    { grupo:"Gestão", itens:[
      { id:"dashboard", icone:"📈", label:"Painel Estadual" },
      { id:"perguntas", icone:"⚙️", label:"Gerenciar Perguntas" },
      { id:"auditoria", icone:"📜", label:"Auditoria Geral" }
    ]},
    { grupo:"Conta", itens:[
      { id:"perfil", icone:"👤", label:"Meu Perfil" }
    ]}
  ]
};

var K_FICHA    = "sgae.ficha.v1";
var K_REPORTS  = "sgae.reports.v1";
var K_DRAFTS   = "sgae.drafts.v1";
var K_SESSION  = "sgae.session.v1";
var K_AUDIT    = "sgae.audit.v1";
var K_NOTIF    = "sgae.notif.v1";
var K_SEED     = "sgae.seed.v3";
var K_RESET    = "sgae.reset.v3";

function $(sel, root) { return (root || document).querySelector(sel); }
function $$(sel, root) { return (root || document).querySelectorAll(sel); }
function uid() { return Math.random().toString(36).slice(2, 9); }
function hoje() { return new Date().toLocaleDateString("pt-BR", { day:"2-digit", month:"short", year:"numeric" }); }
function fmtDataHora(iso) { var d = new Date(iso); return d.toLocaleDateString("pt-BR") + " " + d.toLocaleTimeString("pt-BR", { hour:"2-digit", minute:"2-digit" }); }
function fmtData(iso) { return new Date(iso).toLocaleDateString("pt-BR"); }
function load(k, fb) { try { var v = JSON.parse(localStorage.getItem(k)); return v === null ? fb : v; } catch (e) { return fb; } }
function save(k, v) { localStorage.setItem(k, JSON.stringify(v)); }
function escapeHtml(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
    return { "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c];
  });
}

function getFicha()    { return load(K_FICHA, DEFAULT_FICHA); }
function setFicha(f)   { save(K_FICHA, f); }
function getReports()  { return load(K_REPORTS, []); }
function saveReports(r){ save(K_REPORTS, r); }
function getDrafts()   { return load(K_DRAFTS, {}); }
function saveDrafts(d) { save(K_DRAFTS, d); }
function getSessao()   { return load(K_SESSION, null); }
function getEscola(id) { for (var i=0;i<ESCOLAS.length;i++) if (ESCOLAS[i].id===id) return ESCOLAS[i]; return null; }
function getTurma(id)  { for (var i=0;i<TURMAS.length;i++) if (TURMAS[i].id===id) return TURMAS[i]; return null; }
function getUsuarioLogado() {
  var s = getSessao(); if (!s) return null;
  for (var i=0;i<USERS.length;i++) if (USERS[i].email === s.email) return USERS[i];
  return null;
}
function turmasVisiveis(user) {
  if (user.perfil === "rede") return TURMAS.slice();
  return TURMAS.filter(function (t) { return t.escolaId === user.escolaId; });
}

function toast(msg, tipo) {
  var t = $("#toast"); if (!t) return;
  var ico = { ok:"✅", err:"❌", warn:"⚠️", info:"ℹ️" }[tipo] || "ℹ️";
  t.innerHTML = '<span>' + ico + '</span><span>' + escapeHtml(msg) + '</span>';
  t.className = "toast is-show" + (tipo ? " toast--" + tipo : "");
  t.hidden = false;
  clearTimeout(toast._t);
  toast._t = setTimeout(function () { t.classList.remove("is-show"); }, 3200);
}

function logAudit(acao, detalhe) {
  var s = getSessao() || {};
  var arr = load(K_AUDIT, []);
  arr.unshift({ id: uid(), quando: new Date().toISOString(), usuario: s.nome || "—", email: s.email || "—", perfil: s.perfil || "—", acao: acao, detalhe: detalhe || "" });
  if (arr.length > 500) arr = arr.slice(0, 500);
  save(K_AUDIT, arr);
}
function getAuditoria() { return load(K_AUDIT, []); }

function getNotifs() { return load(K_NOTIF, []); }
function pushNotif(titulo, texto, perfil) {
  var arr = getNotifs();
  arr.unshift({ id: uid(), quando: new Date().toISOString(), titulo: titulo, texto: texto, perfil: perfil || "todos", lida: false });
  if (arr.length > 50) arr = arr.slice(0, 50);
  save(K_NOTIF, arr);
  atualizarNotifBadge();
}
function notifsLidas() {
  var s = getSessao() || {};
  return getNotifs().filter(function (n) { return n.perfil === "todos" || n.perfil === s.perfil; }).filter(function (n) { return !n.lida; }).length;
}
function atualizarNotifBadge() {
  var c = $("#notifCount"); if (!c) return;
  var n = notifsLidas();
  if (n > 0) { c.textContent = n; c.hidden = false; } else c.hidden = true;
}

function abrirModal(titulo, corpoHtml, botoes) {
  var root = $("#modalRoot");
  $("#modalTitle").textContent = titulo;
  $("#modalBody").innerHTML = corpoHtml;
  var foot = $("#modalFoot");
  foot.innerHTML = "";
  (botoes || []).forEach(function (b) {
    var btn = document.createElement("button");
    btn.className = "btn " + (b.className || "btn--ghost");
    btn.textContent = b.label;
    btn.addEventListener("click", function () {
      if (b.onClick) b.onClick();
      if (b.close !== false) fecharModal();
    });
    foot.appendChild(btn);
  });
  root.hidden = false;
}
function fecharModal() { $("#modalRoot").hidden = true; }
function confirmar(titulo, texto, onConfirm, textoOk) {
  abrirModal(titulo, "<p>" + escapeHtml(texto) + "</p>", [
    { label: "Cancelar", className: "btn--ghost" },
    { label: textoOk || "Confirmar", className: "btn--primary", onClick: onConfirm }
  ]);
}

var turmaSelecionada = null;
var escolaSelecionada = null;
var fichaParaVer = null;
var currentPage = "turmas";
var currentUser = null;

function seedDadosFicticios() {
  if (localStorage.getItem(K_SEED)) return;
  var hojeISO = new Date().toISOString();
  var ontemISO = new Date(Date.now() - 86400000).toISOString();
  var exemplos = [
    { turmaId:"t1", professor:"Prof. Ana Souza", quando: ontemISO, respostas:{
      p1:"Turma bastante participativa, com bom relacionamento entre os colegas.",
      p2:"Fortes: cooperação em grupo. Fracos: dificuldade em manter o foco.",
      p3:"Nível médio, com alguns alunos acima da média.",
      p4:"Frequência em torno de 92%. Dois casos em acompanhamento.",
      p5:"Dois alunos necessitam de acompanhamento psicopedagógico.",
      p6:"Encaminhado à coordenação o caso mais crítico.",
      p7:"Turma com bom potencial. Foco do próximo bimestre: leitura."
    }},
    { turmaId:"t2", professor:"Prof. Bruno Lima", quando: hojeISO, respostas:{
      p1:"Turma agitada, especialmente no período da tarde.",
      p2:"Fortes: criatividade. Fracos: cumprimento de prazos.",
      p3:"Nível heterogêneo.",
      p4:"Frequência em 88%.",
      p5:"Dois alunos precisam de reforço em leitura.",
      p6:"Solicitado apoio do reforço escolar.",
      p7:"Turma com energia boa, mas precisa de mais foco."
    }},
    { turmaId:"t3", professor:"Prof. Carla Dias", quando: hojeISO, respostas:{
      p1:"Turma disciplinada, silenciosa, mas pouco participativa.",
      p2:"Fortes: respeito e organização. Fracos: oralidade.",
      p3:"Nível médio-alto.",
      p4:"Frequência excelente, 97%.",
      p5:"Nenhum caso grave.",
      p6:"Sugerida oficina de oratória à coordenação.",
      p7:"Turma academicamente sólida."
    }}
  ];
  var seed = [];
  exemplos.forEach(function (ex) {
    var t = getTurma(ex.turmaId); if (!t) return;
    seed.push({ id: uid(), turmaId: t.id, turmaNome: t.nome, escolaId: t.escolaId, professor: ex.professor, data: ex.quando, respostas: ex.respostas, fichaSnapshot: JSON.parse(JSON.stringify(DEFAULT_FICHA)) });
  });
  saveReports(seed);
  localStorage.setItem(K_SEED, "1");
}

/* INICIALIZAÇÃO */
document.addEventListener("DOMContentLoaded", function () {
  if (!localStorage.getItem(K_RESET)) {
    ["sgae.ficha.v1","sgae.reports.v1","sgae.drafts.v1","sgae.audit.v1","sgae.notif.v1","sgae.seed.v3"].forEach(function (k) { localStorage.removeItem(k); });
    localStorage.setItem(K_RESET, "1");
  }

  var s = getSessao();
  if (!s || !s.email || !s.expiresAt || s.expiresAt < Date.now()) {
    if (s) localStorage.removeItem(K_SESSION);
    window.location.href = "index.html";
    return;
  }

  var user = getUsuarioLogado();
  if (!user) { window.location.href = "index.html"; return; }
  currentUser = user;

  s.expiresAt = Date.now() + 8 * 60 * 60 * 1000;
  save(K_SESSION, s);

  seedDadosFicticios();

  $("#userName").textContent = user.nome;
  $("#userRole").textContent = rotuloPerfil(user.perfil);
  $("#userAvatar").textContent = user.nome.charAt(0).toUpperCase();
  $("#escolaNome").textContent = user.perfil === "rede" ? "Rede Estadual" : (getEscola(user.escolaId) || {}).nome || "—";
  $("#sessaoInfo").textContent = "Sessão ativa até " + new Date(s.expiresAt).toLocaleTimeString("pt-BR", { hour:"2-digit", minute:"2-digit" });

  buildSidebar(user.perfil);
  logAudit("Login", "Acesso ao sistema");

  navigate(primeiraPagina(user.perfil));
  atualizarNotifBadge();

  $("#logoutBtn").addEventListener("click", fazerLogout);
  $("#menuBtn").addEventListener("click", function () {
    $("#sidebar").classList.toggle("is-open");
    $("#overlay").classList.toggle("is-open");
  });
  $("#overlay").addEventListener("click", closeSidebarMobile);
  $("#notifBtn").addEventListener("click", abrirNotifDrawer);

  var chip = $("#userChip"); var menu = $("#userMenu");
  chip.addEventListener("click", function (e) { e.stopPropagation(); menu.hidden = !menu.hidden; });
  document.addEventListener("click", function () { menu.hidden = true; });
  menu.addEventListener("click", function (e) {
    var b = e.target.closest("button"); if (!b) return;
    var a = b.dataset.action;
    if (a === "sair") fazerLogout();
    if (a === "perfil") navigate("perfil");
    if (a === "senha") abrirModalSenha();
    if (a === "auditoria") navigate("auditoria");
    menu.hidden = true;
  });

  document.addEventListener("click", function (e) {
    if (e.target.matches("[data-close]")) { fecharModal(); fecharNotifDrawer(); }
  });
  document.querySelectorAll("#notifDrawer [data-close]").forEach(function (el) {
    el.addEventListener("click", fecharNotifDrawer);
  });

  var busca = $("#buscaGlobal");
  if (busca) busca.addEventListener("keydown", function (e) {
    if (e.key === "Enter") { var q = e.target.value.trim(); if (q) toast("Busca por: " + q, "info"); }
  });
});

function rotuloPerfil(p) { return { professor:"Professor(a)", coordenador:"Coordenador(a)", diretor:"Diretor(a)", rede:"Administrador da Rede" }[p] || p; }
function primeiraPagina(p) { return { professor:"turmas", coordenador:"fichas-escola", diretor:"fichas-escola", rede:"escolas" }[p] || "perfil"; }

function fazerLogout() {
  logAudit("Logout", "Saída do sistema");
  localStorage.removeItem(K_SESSION);
  window.location.href = "index.html";
}

function buildSidebar(perfil) {
  var nav = $("#sidebarNav"); nav.innerHTML = "";
  (MENUS[perfil] || []).forEach(function (grupo) {
    var wrap = document.createElement("div");
    var lbl = document.createElement("div"); lbl.className = "nav-group-label"; lbl.textContent = grupo.grupo;
    wrap.appendChild(lbl);
    grupo.itens.forEach(function (item) {
      var b = document.createElement("button");
      b.className = "nav-item"; b.dataset.page = item.id;
      b.innerHTML = '<span class="nav-ico">' + item.icone + '</span> ' + item.label;
      b.addEventListener("click", function () { navigate(item.id); });
      wrap.appendChild(b);
    });
    nav.appendChild(wrap);
  });
}

var TITULOS = {
  turmas:          ["Minhas Turmas", "Selecione uma turma para preencher a ficha geral"],
  ficha:           ["Preencher Ficha da Turma", "Responda as seções da ficha geral da turma"],
  historico:       ["Histórico", "Fichas já enviadas por você"],
  "fichas-escola": ["Fichas da Escola", "Todas as fichas recebidas nesta unidade"],
  relatorios:      ["Relatórios Consolidados", "Visualize as respostas agrupadas por turma"],
  dashboard:       ["Painel", "Indicadores gerais"],
  perguntas:       ["Gerenciar Perguntas", "Adicione, edite ou remova perguntas das fichas"],
  escolas:         ["Escolas da Rede", "Visão geral das unidades escolares"],
  "ver-escola":    ["Detalhes da Escola", "Indicadores e turmas desta unidade"],
  auditoria:       ["Auditoria", "Registro de ações no sistema"],
  perfil:          ["Meu Perfil", "Informações da sua conta"],
  "ver-ficha":     ["Consolidado da Turma", "Respostas agrupadas por pergunta"]
};

function navigate(page, param) {
  currentPage = page;
  if (page === "ver-ficha") fichaParaVer = param;
  if (page === "ver-escola") escolaSelecionada = param;

  $$(".nav-item").forEach(function (b) { b.classList.toggle("is-active", b.dataset.page === page); });

  var meta = TITULOS[page] || ["—", "—"];
  $("#pageTitle").textContent = meta[0];
  $("#pageSubtitle").textContent = meta[1];

  atualizarCrumbs(page);
  $("#pageTools").innerHTML = "";
  closeSidebarMobile();
  render(page);
}

function atualizarCrumbs(page) {
  var c = $("#crumbs"); if (!c) return;
  var trilha = ["Início"];
  var map = { turmas:"Minhas Turmas", ficha:"Ficha", historico:"Histórico", "fichas-escola":"Fichas da Escola", relatorios:"Relatórios", dashboard:"Painel", perguntas:"Perguntas", escolas:"Escolas", "ver-escola":"Escola", auditoria:"Auditoria", perfil:"Perfil", "ver-ficha":"Consolidado" };
  if (map[page]) trilha.push(map[page]);
  c.innerHTML = trilha.map(function (t, i) {
    return (i ? '<span class="crumbs__sep">›</span>' : '') + '<span class="crumbs__item">' + escapeHtml(t) + '</span>';
  }).join("");
}

function closeSidebarMobile() {
  var sb = $("#sidebar"); var ov = $("#overlay");
  if (sb) sb.classList.remove("is-open");
  if (ov) ov.classList.remove("is-open");
}

function render(page) {
  var c = $("#content"); c.innerHTML = "";
  switch (page) {
    case "turmas":         renderTurmas(c);        break;
    case "ficha":          renderFicha(c);         break;
    case "historico":      renderHistorico(c);     break;
    case "fichas-escola":  renderFichasEscola(c);  break;
    case "relatorios":     renderRelatorios(c);    break;
    case "dashboard":      renderDashboard(c);     break;
    case "perguntas":      renderPerguntas(c);     break;
    case "escolas":        renderEscolas(c);       break;
    case "ver-escola":     renderVerEscola(c);     break;
    case "auditoria":      renderAuditoria(c);     break;
    case "perfil":         renderPerfil(c);        break;
    case "ver-ficha":      renderVerFicha(c);      break;
  }
}

/* TELAS PROFESSOR */
function renderTurmas(c) {
  var visiveis = turmasVisiveis(currentUser);
  var box = document.createElement("div"); box.className = "card";
  box.innerHTML = '<div class="card__head"><div><h3>Turmas disponíveis</h3><p>Clique para preencher a ficha geral</p></div></div>';

  if (!visiveis.length) { box.innerHTML += emptyBlock("📭", "Nenhuma turma disponível", "Não há turmas vinculadas à sua unidade."); c.appendChild(box); return; }

  var wrap = document.createElement("div"); wrap.className = "grid grid--3";
  visiveis.forEach(function (t) {
    var bt = document.createElement("button"); bt.className = "turma-card";
    bt.innerHTML =
      '<div class="turma-card__top"><span class="turma-card__badge">' + escapeHtml(t.turno) + '</span><span class="badge badge--muted">' + t.alunos + ' alunos</span></div>' +
      '<h4>' + escapeHtml(t.nome) + '</h4>' +
      '<p>' + escapeHtml((getEscola(t.escolaId) || {}).nome || "—") + '</p>';
    bt.addEventListener("click", function () { turmaSelecionada = t; navigate("ficha"); });
    wrap.appendChild(bt);
  });
  box.appendChild(wrap); c.appendChild(box);
}

function renderFicha(c) {
  var visiveis = turmasVisiveis(currentUser);
  var turma = turmaSelecionada || visiveis[0];
  if (!turma) { c.innerHTML = '<div class="card">' + emptyBlock("📭","Sem turmas","") + '</div>'; return; }

  var ficha = getFicha(); var drafts = getDrafts(); var key = turma.id; var draft = drafts[key] || {};

  var topo = document.createElement("div"); topo.className = "card";
  topo.innerHTML = '<div class="card__head"><div><h3>' + escapeHtml(turma.nome) + '</h3><p>Ficha geral da turma — ' + escapeHtml((getEscola(turma.escolaId) || {}).nome || "") + '</p></div></div>' +
    '<div class="toolbar"><div class="field"><label>Turma</label><select id="selTurma">' +
      visiveis.map(function (t) { return '<option value="' + t.id + '"' + (t.id === turma.id ? " selected" : "") + '>' + escapeHtml(t.nome) + '</option>'; }).join("") +
    '</select></div></div>';
  c.appendChild(topo);

  ficha.forEach(function (sec) {
    var el = document.createElement("div"); el.className = "ficha-section";
    el.innerHTML = '<div class="ficha-section__head"><span>' + sec.icone + '</span><h4>' + escapeHtml(sec.titulo) + '</h4></div>';
    var body = document.createElement("div"); body.className = "ficha-section__body";
    sec.perguntas.forEach(function (p) {
      var val = draft[p.id] || "";
      var q = document.createElement("div"); q.className = "pergunta";
      q.innerHTML = '<label for="resp-' + p.id + '">' + escapeHtml(p.texto) + '</label>' +
        '<textarea id="resp-' + p.id + '" data-pid="' + p.id + '" rows="3" placeholder="Digite sua resposta...">' + escapeHtml(val) + '</textarea>';
      body.appendChild(q);
    });
    el.appendChild(body); c.appendChild(el);
  });

  var acoes = document.createElement("div"); acoes.className = "card actions";
  acoes.innerHTML = '<button class="btn btn--ghost" id="btnRascunho">💾 Salvar rascunho</button><button class="btn btn--primary" id="btnEnviar">📤 Enviar ficha</button>';
  c.appendChild(acoes);

  $("#selTurma").addEventListener("change", function (e) { turmaSelecionada = getTurma(e.target.value); navigate("ficha"); });

  function coletar() { var r = {}; $$("textarea[data-pid]").forEach(function (ta) { r[ta.dataset.pid] = ta.value.trim(); }); return r; }

  $("#btnRascunho").addEventListener("click", function () {
    var d = getDrafts(); d[key] = coletar(); saveDrafts(d); toast("Rascunho salvo", "ok");
  });

  $("#btnEnviar").addEventListener("click", function () {
    var respostas = coletar(); var vazias = 0;
    for (var k in respostas) if (!respostas[k]) vazias++;

    function enviar() {
      var arr = getReports();
      arr.unshift({ id: uid(), turmaId: turma.id, turmaNome: turma.nome, escolaId: turma.escolaId, professor: currentUser.nome, data: new Date().toISOString(), respostas: respostas, fichaSnapshot: JSON.parse(JSON.stringify(getFicha())) });
      saveReports(arr);
      var d = getDrafts(); delete d[key]; saveDrafts(d);
      logAudit("Enviou ficha", turma.nome);
      pushNotif("Ficha recebida", currentUser.nome + " enviou a ficha da " + turma.nome, "coordenador");
      pushNotif("Ficha recebida", currentUser.nome + " enviou a ficha da " + turma.nome, "diretor");
      toast("Ficha enviada com sucesso!", "ok");
      navigate("historico");
    }
    if (vazias > 0) confirmar("Enviar mesmo assim?", "Existem " + vazias + " pergunta(s) sem resposta. Deseja enviar assim mesmo?", enviar, "Enviar");
    else enviar();
  });
}

function renderHistorico(c) {
  var nome = currentUser.nome;
  var reports = getReports().filter(function (r) { return r.professor === nome; });
  var box = document.createElement("div"); box.className = "card";
  box.innerHTML = '<div class="card__head"><div><h3>Minhas fichas enviadas</h3><p>' + reports.length + ' registro(s)</p></div></div>';
  if (!reports.length) { box.innerHTML += emptyBlock("📭", "Nenhuma ficha enviada", "Preencha uma ficha para vê-la aqui."); c.appendChild(box); return; }
  var wrap = document.createElement("div"); wrap.className = "table-wrap";
  wrap.innerHTML = '<table><thead><tr><th>Data</th><th>Turma</th><th>Status</th></tr></thead><tbody>' +
    reports.map(function (r) { return '<tr><td>' + fmtData(r.data) + '</td><td>' + escapeHtml(r.turmaNome) + '</td><td><span class="badge badge--ok">Enviada</span></td></tr>'; }).join("") + '</tbody></table>';
  box.appendChild(wrap); c.appendChild(box);
}

/* TELAS COORD/DIRETOR/REDE */
function renderFichasEscola(c) {
  var reports = getReports();
  if (currentUser.perfil !== "rede") reports = reports.filter(function (r) { return r.escolaId === currentUser.escolaId; });

  var box = document.createElement("div"); box.className = "card";
  box.innerHTML = '<div class="card__head"><div><h3>Fichas recebidas</h3><p>' + reports.length + ' ficha(s)</p></div>' +
    '<div class="toolbar"><div class="field" style="min-width:220px"><input id="filtro" placeholder="🔎 Filtrar por turma, professor..." /></div></div></div>' +
    '<div id="listaFichas"></div>';
  c.appendChild(box);

  function desenhar(f) {
    f = (f || "").toLowerCase();
    var lista = $("#listaFichas");
    var filtrados = reports.filter(function (r) { return !f || r.turmaNome.toLowerCase().indexOf(f) >= 0 || (r.professor || "").toLowerCase().indexOf(f) >= 0; });
    if (!filtrados.length) { lista.innerHTML = emptyBlock("📭","Nenhuma ficha encontrada",""); return; }
    lista.innerHTML = '<div class="table-wrap"><table><thead><tr><th>Data</th><th>Turma</th><th>Escola</th><th>Professor</th><th></th></tr></thead><tbody>' +
      filtrados.map(function (r) {
        var esc = getEscola(r.escolaId) || {};
        return '<tr><td>' + fmtData(r.data) + '</td><td>' + escapeHtml(r.turmaNome) + '</td><td>' + escapeHtml(esc.nome || "—") + '</td><td>' + escapeHtml(r.professor || "—") + '</td><td><button class="btn btn--ghost btn--sm" data-ver="' + r.id + '">Ver</button></td></tr>';
      }).join("") + '</tbody></table></div>';
    lista.querySelectorAll("[data-ver]").forEach(function (b) {
      b.addEventListener("click", function () { navigate("ver-ficha", b.dataset.ver); });
    });
  }
  desenhar("");
  $("#filtro").addEventListener("input", function (e) { desenhar(e.target.value); });
}

function renderRelatorios(c) {
  var reports = getReports();
  if (currentUser.perfil !== "rede") reports = reports.filter(function (r) { return r.escolaId === currentUser.escolaId; });
  var visiveis = turmasVisiveis(currentUser);

  var box = document.createElement("div"); box.className = "card";
  box.innerHTML = '<div class="card__head"><div><h3>Relatórios por turma</h3><p>Clique em uma turma para ver o consolidado</p></div></div>';

  var comFicha = visiveis.filter(function (t) { return reports.some(function (r) { return r.turmaId === t.id; }); });
  if (!comFicha.length) { box.innerHTML += emptyBlock("📭","Nenhuma turma com fichas",""); c.appendChild(box); return; }

  var wrap = document.createElement("div"); wrap.className = "grid grid--3";
  comFicha.forEach(function (t) {
    var fs = reports.filter(function (r) { return r.turmaId === t.id; });
    var pct = Math.min(100, Math.round((fs.length / t.alunos) * 100));
    var bt = document.createElement("button"); bt.className = "turma-card";
    bt.innerHTML = '<div class="turma-card__top"><span class="turma-card__badge">' + escapeHtml(t.turno) + '</span><span class="badge badge--info">' + fs.length + ' ficha(s)</span></div>' +
      '<h4>' + escapeHtml(t.nome) + '</h4>' +
      '<div class="progress"><div class="progress__bar" style="width:' + pct + '%"></div></div>' +
      '<p>' + pct + '% de cobertura</p>';
    bt.addEventListener("click", function () { navigate("ver-ficha", t.id); });
    wrap.appendChild(bt);
  });
  box.appendChild(wrap); c.appendChild(box);
}

function renderVerFicha(c) {
  var todas = getReports();
  var turma = getTurma(fichaParaVer);
  var reports = todas.filter(function (r) { return r.turmaId === fichaParaVer; });

  var topo = document.createElement("div"); topo.className = "card";
  topo.innerHTML = '<div class="card__head" style="margin-bottom:0"><div><h3>' + (turma ? escapeHtml(turma.nome) + " — Consolidado" : "Não encontrada") + '</h3><p>' + reports.length + ' ficha(s) recebida(s)</p></div>' +
    '<div class="actions"><button class="btn btn--ghost" id="btnExport">📥 CSV</button><button class="btn btn--ghost" id="btnPrint">🖨️ Imprimir</button><button class="btn btn--ghost" id="btnVoltar">← Voltar</button></div></div>';
  c.appendChild(topo);

  if (!turma || !reports.length) {
    c.innerHTML += '<div class="card">' + emptyBlock("⚠️","Sem fichas nesta turma","") + '</div>';
    $("#btnVoltar").addEventListener("click", function () { navigate(currentUser.perfil === "professor" ? "historico" : "relatorios"); });
    return;
  }

  var snapshot = reports[0].fichaSnapshot;
  snapshot.forEach(function (sec) {
    var el = document.createElement("div"); el.className = "ficha-section";
    el.innerHTML = '<div class="ficha-section__head"><span>' + sec.icone + '</span><h4>' + escapeHtml(sec.titulo) + '</h4></div>';
    var body = document.createElement("div"); body.className = "ficha-section__body";

    sec.perguntas.forEach(function (p) {
      var bloco = document.createElement("div"); bloco.className = "q-block";
      var tem = false; var itens = "";
      reports.forEach(function (r) {
        var txt = r.respostas[p.id]; if (!txt) return;
        tem = true;
        itens += '<div class="q-item"><div class="q-item__head"><strong>' + escapeHtml(r.professor || "—") + '</strong><span>' + fmtDataHora(r.data) + '</span></div><div class="q-item__text">' + escapeHtml(txt) + '</div></div>';
      });
      bloco.innerHTML = '<div class="q-block__head">' + escapeHtml(p.texto) + '<span class="q-block__count">' + (tem ? "respondida" : "sem resposta") + '</span></div>' +
        '<div class="q-block__body">' + (tem ? itens : '<p style="color:#94a3b8;font-size:12.5px;padding:8px 0"><em>Nenhuma resposta registrada.</em></p>') + '</div>';
      body.appendChild(bloco);
    });
    el.appendChild(body); c.appendChild(el);
  });

  $("#btnExport").addEventListener("click", function () { exportarCSV(turma, reports); });
  $("#btnPrint").addEventListener("click", function () { window.print(); });
  $("#btnVoltar").addEventListener("click", function () { navigate(currentUser.perfil === "professor" ? "historico" : "relatorios"); });
}

function exportarCSV(turma, reports) {
  var linhas = [["Turma","Professor","Data","Pergunta","Resposta"]];
  reports.forEach(function (r) {
    r.fichaSnapshot.forEach(function (sec) {
      sec.perguntas.forEach(function (p) { linhas.push([turma.nome, r.professor, fmtData(r.data), p.texto, r.respostas[p.id] || ""]); });
    });
  });
  var csv = linhas.map(function (l) { return l.map(function (c) { return '"' + String(c).replace(/"/g, '""') + '"'; }).join(";"); }).join("\n");
  var blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
  var url = URL.createObjectURL(blob);
  var a = document.createElement("a");
  a.href = url; a.download = "relatorio-" + turma.nome.replace(/\s+/g,"_") + ".csv";
  a.click(); URL.revokeObjectURL(url);
  toast("CSV exportado", "ok");
}

function renderDashboard(c) {
  var reports = getReports();
  if (currentUser.perfil !== "rede") reports = reports.filter(function (r) { return r.escolaId === currentUser.escolaId; });
  var visiveis = turmasVisiveis(currentUser);
  var totalAlunos = 0; visiveis.forEach(function (t) { totalAlunos += t.alunos; });
  var cobertura = totalAlunos ? Math.round((reports.length / totalAlunos) * 100) : 0;

  var stats = document.createElement("div"); stats.className = "grid grid--4";
  stats.innerHTML = stat("🏫", visiveis.length, "Turmas na unidade", "") + stat("👥", totalAlunos, "Alunos matriculados", "") +
    stat("📋", reports.length, "Fichas recebidas", "") + stat("📈", cobertura + "%", "Cobertura de fichas", "", "green");
  c.appendChild(stats);

  var box = document.createElement("div"); box.className = "card";
  box.innerHTML = '<div class="card__head"><div><h3>Progresso por turma</h3><p>Fichas recebidas por turma</p></div></div>';
  var chart = document.createElement("div"); chart.className = "chart";
  visiveis.forEach(function (t) {
    var qtd = reports.filter(function (r) { return r.turmaId === t.id; }).length;
    var pct = Math.min(100, Math.round((qtd / t.alunos) * 100));
    var row = document.createElement("div"); row.className = "chart__row";
    row.innerHTML = '<div class="chart__row-head"><strong>' + escapeHtml(t.nome) + '</strong><span>' + qtd + ' / ' + t.alunos + '</span></div>' +
      '<div class="progress"><div class="progress__bar' + (pct<50?" progress__bar--warn":"") + '" style="width:' + pct + '%"></div></div>';
    chart.appendChild(row);
  });
  box.appendChild(chart); c.appendChild(box);
}

function stat(ico, val, lbl, delta, tipo) {
  return '<div class="stat"><div class="stat__ico' + (tipo === "green" ? " stat__ico--green" : "") + '">' + ico + '</div>' +
    '<div><div class="stat__val">' + val + '</div><div class="stat__lbl">' + escapeHtml(lbl) + '</div>' +
    (delta ? '<div class="stat__delta">' + escapeHtml(delta) + '</div>' : '') + '</div></div>';
}

function renderEscolas(c) {
  var reports = getReports();
  var box = document.createElement("div"); box.className = "card";
  box.innerHTML = '<div class="card__head"><div><h3>Unidades da Rede</h3><p>Clique para ver detalhes</p></div></div>';
  var wrap = document.createElement("div"); wrap.className = "grid grid--3";
  ESCOLAS.forEach(function (e) {
    var turmas = TURMAS.filter(function (t) { return t.escolaId === e.id; });
    var fichas = reports.filter(function (r) { return r.escolaId === e.id; }).length;
    var bt = document.createElement("button"); bt.className = "turma-card";
    bt.innerHTML = '<div class="turma-card__top"><span class="turma-card__badge turma-card__badge--green">' + escapeHtml(e.cidade) + '</span><span class="badge badge--muted">' + e.alunos + ' alunos</span></div>' +
      '<h4>' + escapeHtml(e.nome) + '</h4><p>' + turmas.length + ' turma(s) • ' + fichas + ' ficha(s) recebida(s)</p>';
    bt.addEventListener("click", function () { navigate("ver-escola", e.id); });
    wrap.appendChild(bt);
  });
  box.appendChild(wrap); c.appendChild(box);
}

function renderVerEscola(c) {
  var e = getEscola(escolaSelecionada);
  if (!e) { c.innerHTML = '<div class="card">' + emptyBlock("⚠️","Escola não encontrada","") + '</div>'; return; }
  var reports = getReports().filter(function (r) { return r.escolaId === e.id; });
  var turmas = TURMAS.filter(function (t) { return t.escolaId === e.id; });

  var topo = document.createElement("div"); topo.className = "card";
  topo.innerHTML = '<div class="card__head" style="margin-bottom:0"><div><h3>' + escapeHtml(e.nome) + '</h3><p>' + escapeHtml(e.cidade) + ' • ' + e.alunos + ' alunos</p></div><button class="btn btn--ghost" id="btnVoltar">← Voltar</button></div>';
  c.appendChild(topo);
  $("#btnVoltar").addEventListener("click", function () { navigate("escolas"); });

  var stats = document.createElement("div"); stats.className = "grid grid--4";
  stats.innerHTML = stat("🏫", turmas.length, "Turmas", "") + stat("📋", reports.length, "Fichas recebidas", "") + stat("👥", e.alunos, "Alunos", "");
  c.appendChild(stats);

  var box = document.createElement("div"); box.className = "card";
  box.innerHTML = '<div class="card__head"><div><h3>Turmas</h3></div></div>';
  var wrap = document.createElement("div"); wrap.className = "grid grid--3";
  turmas.forEach(function (t) {
    var fs = reports.filter(function (r) { return r.turmaId === t.id; });
    var pct = Math.min(100, Math.round((fs.length / t.alunos) * 100));
    var bt = document.createElement("button"); bt.className = "turma-card";
    bt.innerHTML = '<div class="turma-card__top"><span class="turma-card__badge">' + escapeHtml(t.turno) + '</span></div><h4>' + escapeHtml(t.nome) + '</h4>' +
      '<div class="progress"><div class="progress__bar" style="width:' + pct + '%"></div></div><p>' + fs.length + ' ficha(s)</p>';
    bt.addEventListener("click", function () { navigate("ver-ficha", t.id); });
    wrap.appendChild(bt);
  });
  box.appendChild(wrap); c.appendChild(box);
}

function renderPerguntas(c) {
  var ficha = getFicha();
  ficha.forEach(function (sec, idx) {
    var el = document.createElement("div"); el.className = "card";
    el.innerHTML = '<div class="card__head"><div><h3>' + sec.icone + ' ' + escapeHtml(sec.titulo) + '</h3><p>' + sec.perguntas.length + ' pergunta(s)</p></div>' +
      '<button class="btn btn--primary btn--sm" data-add="' + idx + '">+ Adicionar</button></div><div>' +
      (sec.perguntas.length ? sec.perguntas.map(function (p) {
        return '<div style="display:flex;gap:10px;align-items:flex-start;border-bottom:1px solid #f1f5f9;padding:10px 0"><span style="flex:1;font-size:13.5px">' + escapeHtml(p.texto) + '</span>' +
          '<button class="btn btn--ghost btn--sm" data-edit="' + idx + ':' + p.id + '">✏️</button><button class="btn btn--danger btn--sm" data-del="' + idx + ':' + p.id + '">🗑️</button></div>';
      }).join("") : '<p style="font-size:13px;color:#64748b">Nenhuma pergunta.</p>') + '</div>';
    c.appendChild(el);
  });

  $$("[data-add]").forEach(function (b) {
    b.addEventListener("click", function () {
      var idx = +b.dataset.add;
      var txt = prompt("Texto da nova pergunta:");
      if (!txt || !txt.trim()) return;
      var f = getFicha();
      f[idx].perguntas.push({ id: uid(), texto: txt.trim() });
      setFicha(f);
      logAudit("Adicionou pergunta", f[idx].titulo);
      toast("Pergunta adicionada", "ok");
      navigate("perguntas");
    });
  });
  $$("[data-edit]").forEach(function (b) {
    b.addEventListener("click", function () {
      var p = b.dataset.edit.split(":");
      var f = getFicha();
      var item = f[+p[0]].perguntas.filter(function (x) { return x.id === p[1]; })[0];
      if (!item) return;
      var novo = prompt("Editar pergunta:", item.texto);
      if (!novo || !novo.trim()) return;
      item.texto = novo.trim();
      setFicha(f);
      logAudit("Editou pergunta", novo);
      toast("Pergunta atualizada", "ok");
      navigate("perguntas");
    });
  });
  $$("[data-del]").forEach(function (b) {
    b.addEventListener("click", function () {
      var p = b.dataset.del.split(":");
      confirmar("Remover pergunta", "Esta ação não pode ser desfeita. Continuar?", function () {
        var f = getFicha();
        f[+p[0]].perguntas = f[+p[0]].perguntas.filter(function (x) { return x.id !== p[1]; });
        setFicha(f);
        logAudit("Removeu pergunta", "");
        toast("Pergunta removida", "ok");
        navigate("perguntas");
      }, "Remover");
    });
  });
}

function renderAuditoria(c) {
  var arr = getAuditoria();
  var box = document.createElement("div"); box.className = "card";
  box.innerHTML = '<div class="card__head"><div><h3>Registro de atividades</h3><p>' + arr.length + ' evento(s)</p></div><button class="btn btn--ghost btn--sm" id="btnLimparAudit">Limpar</button></div>';
  if (!arr.length) { box.innerHTML += emptyBlock("📜","Sem atividades registradas",""); c.appendChild(box); return; }
  var wrap = document.createElement("div"); wrap.className = "table-wrap";
  wrap.innerHTML = '<table><thead><tr><th>Quando</th><th>Usuário</th><th>Perfil</th><th>Ação</th><th>Detalhe</th></tr></thead><tbody>' +
    arr.slice(0, 100).map(function (a) {
      return '<tr><td>' + fmtDataHora(a.quando) + '</td><td>' + escapeHtml(a.usuario) + '</td><td>' + escapeHtml(rotuloPerfil(a.perfil)) + '</td><td>' + escapeHtml(a.acao) + '</td><td>' + escapeHtml(a.detalhe || "") + '</td></tr>';
    }).join("") + '</tbody></table>';
  box.appendChild(wrap); c.appendChild(box);

  $("#btnLimparAudit").addEventListener("click", function () {
    confirmar("Limpar auditoria", "Todo o histórico será apagado. Continuar?", function () {
      localStorage.removeItem(K_AUDIT);
      toast("Auditoria limpa", "ok");
      navigate("auditoria");
    }, "Limpar");
  });
}

function renderPerfil(c) {
  var s = getSessao();
  var box = document.createElement("div"); box.className = "card";
  box.innerHTML = '<div class="card__head"><div><h3>Informações da conta</h3></div></div>';
  var info = document.createElement("div"); info.className = "grid grid--2";
  info.innerHTML = perfilItem("Nome", currentUser.nome) + perfilItem("E-mail", currentUser.email) +
    perfilItem("Perfil", rotuloPerfil(currentUser.perfil)) +
    perfilItem("Unidade", currentUser.perfil === "rede" ? "Rede Estadual" : (getEscola(currentUser.escolaId) || {}).nome || "—") +
    perfilItem("Sessão iniciada", s ? new Date(s.loginAt).toLocaleString("pt-BR") : "—") +
    perfilItem("Expira em", s ? new Date(s.expiresAt).toLocaleString("pt-BR") : "—");
  box.appendChild(info); c.appendChild(box);

  var act = document.createElement("div"); act.className = "card actions";
  act.innerHTML = '<button class="btn btn--soft" id="btnSenha">🔑 Alterar senha</button><button class="btn btn--ghost" id="btnLogout2">⏻ Encerrar sessão</button>';
  c.appendChild(act);
  $("#btnSenha").addEventListener("click", abrirModalSenha);
  $("#btnLogout2").addEventListener("click", fazerLogout);
}

function perfilItem(k, v) {
  return '<div style="padding:12px;background:var(--n-50);border-radius:10px"><div style="font-size:11.5px;color:var(--n-500);text-transform:uppercase;letter-spacing:.5px;font-weight:700">' + escapeHtml(k) + '</div><div style="font-size:14px;color:var(--n-800);margin-top:2px">' + escapeHtml(v) + '</div></div>';
}

function abrirModalSenha() {
  abrirModal("Alterar senha",
    '<div class="field"><label>Senha atual</label><input type="password" id="pAtual" /></div>' +
    '<div class="field" style="margin-top:12px"><label>Nova senha</label><input type="password" id="pNova" /></div>' +
    '<div class="field" style="margin-top:12px"><label>Confirmar nova senha</label><input type="password" id="pConf" /></div>',
    [
      { label: "Cancelar", className: "btn--ghost" },
      { label: "Salvar", className: "btn--primary", onClick: function () {
        var a = $("#pAtual").value, n = $("#pNova").value, c2 = $("#pConf").value;
        if (!a || !n || !c2) return toast("Preencha todos os campos", "warn");
        if (n !== c2) return toast("As senhas não coincidem", "err");
        if (n.length < 6) return toast("A senha precisa ter pelo menos 6 caracteres", "warn");
        if (a !== "123456") return toast("Senha atual incorreta", "err");
        logAudit("Alterou senha", "");
        toast("Senha alterada com sucesso", "ok");
      }}
    ]);
}

function abrirNotifDrawer() {
  var arr = getNotifs();
  var s = getSessao() || {};
  var filtrados = arr.filter(function (n) { return n.perfil === "todos" || n.perfil === s.perfil; });
  var list = $("#notifList");
  if (!filtrados.length) list.innerHTML = emptyBlock("🔔","Nenhuma notificação","");
  else {
    list.innerHTML = filtrados.slice(0, 30).map(function (n) {
      return '<div class="notif-item ' + (n.lida ? "" : "unread") + '"><strong>' + escapeHtml(n.titulo) + '</strong><p>' + escapeHtml(n.texto) + '</p><small>' + fmtDataHora(n.quando) + '</small></div>';
    }).join("");
    arr.forEach(function (n) { if (n.perfil === "todos" || n.perfil === s.perfil) n.lida = true; });
    save(K_NOTIF, arr);
    atualizarNotifBadge();
  }
  $("#notifDrawer").hidden = false;
}
function fecharNotifDrawer() { $("#notifDrawer").hidden = true; }

function emptyBlock(ico, t, p) {
  return '<div class="empty"><div class="empty__ico">' + ico + '</div><h4>' + escapeHtml(t) + '</h4>' + (p ? '<p>' + escapeHtml(p) + '</p>' : '') + '</div>';
}
