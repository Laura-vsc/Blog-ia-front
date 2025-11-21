const API = "https://blog-ia-backend.onrender.com";

const els = {
  registerView: document.getElementById("registerView"),
  loginView: document.getElementById("loginView"),
  generatorView: document.getElementById("generatorView"),
  postsList: document.getElementById("postsList"),
  registerBtn: document.getElementById("registerBtn"),
  loginBtn: document.getElementById("loginBtn"),
  generateBtn: document.getElementById("generateBtn"),
  btnShowLogin: document.getElementById("btnShowLogin"),
  btnShowRegister: document.getElementById("btnShowRegister"),
  btnLogout: document.getElementById("btnLogout"),
  btnStart: document.getElementById("btnStart"),
  refreshBtn: document.getElementById("refreshBtn"),
  genStatus: document.getElementById("genStatus"),
  prompt: document.getElementById("prompt"),
  regEmail: document.getElementById("regEmail"),
  regPassword: document.getElementById("regPassword"),
  loginEmail: document.getElementById("loginEmail"),
  loginPassword: document.getElementById("loginPassword")
};

let TOKEN = localStorage.getItem("ai_token") || "";

function show(e){ e.classList.remove("hidden"); }
function hide(e){ e.classList.add("hidden"); }
function setAuthUI(logged){
  if(logged){
    hide(els.registerView);
    hide(els.loginView);
    show(els.generatorView);
    show(els.btnLogout);
    hide(els.btnShowLogin);
    hide(els.btnShowRegister);
  } else {
    hide(els.generatorView);
    hide(els.btnLogout);
    show(els.btnShowLogin);
    show(els.btnShowRegister);
  }
}

if(TOKEN) setAuthUI(true); else setAuthUI(false);

els.btnShowLogin.onclick = () => {hide(els.registerView);show(els.loginView);}
els.btnShowRegister.onclick = () => {hide(els.loginView);show(els.registerView);}
els.btnLogout.onclick = () => {TOKEN="";localStorage.removeItem("ai_token");setAuthUI(false);}
els.btnStart.onclick = () => {if(TOKEN) show(els.generatorView); else show(els.loginView);}
els.refreshBtn.onclick = () => loadPosts();

els.registerBtn.onclick = async () => {
  const email = els.regEmail.value.trim();
  const password = els.regPassword.value.trim();
  if(!email || !password) return alert("Completa email y contraseña");
  const res = await fetch(`${API}/register`, {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email,password})});
  if(res.ok){alert("Registrado. Inicia sesión.");show(els.loginView);hide(els.registerView);}
  else alert("Error registrando");
};

els.loginBtn.onclick = async () => {
  const email = els.loginEmail.value.trim();
  const password = els.loginPassword.value.trim();
  const res = await fetch(`${API}/token`, {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email,password})});
  const data = await res.json();
  if(res.ok && data.access_token){
    TOKEN = data.access_token;
    localStorage.setItem("ai_token", TOKEN);
    setAuthUI(true);
    loadPosts();
  } else alert("Credenciales incorrectas");
};

els.generateBtn.onclick = async () => {
  const prompt = els.prompt.value.trim();
  if(!prompt) return alert("Escribe un prompt");
  els.genStatus.textContent = "Generando artículo...";
  const res = await fetch(`${API}/generate-post`, {
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      "Authorization":`Bearer ${TOKEN}`
    },
    body:JSON.stringify({prompt})
  });
  if(res.ok){
    els.genStatus.textContent = "Artículo generado 🎉";
    els.prompt.value="";
    loadPosts();
  } else els.genStatus.textContent = "Error generando artículo";
  setTimeout(()=> els.genStatus.textContent="", 2500);
};

async function loadPosts(){
  const res = await fetch(`${API}/posts`);
  const posts = await res.json();
  renderPosts(posts);
}

function renderPosts(posts){
  els.postsList.innerHTML = posts.map(p => `
    <article class="post">
      <h4>${p.title}</h4>
      <p>${p.body.replace(/\n/g,"<br>")}</p>
      <small>${p.seo || ""}</small>
    </article>
  `).join("") || "<div>Ningún artículo aún.</div>";
}

loadPosts();
