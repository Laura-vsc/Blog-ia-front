const API_URL = "http://127.0.0.1:8000"; 
let TOKEN = "";

// LOGIN
async function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (data.access_token) {
        TOKEN = data.access_token;

        document.getElementById("login").classList.add("hidden");
        document.getElementById("generator").classList.remove("hidden");
        document.getElementById("posts").classList.remove("hidden");

        loadPosts();
    } else {
        alert("Credenciales incorrectas");
    }
}

// GENERAR POST
async function generatePost() {
    const prompt = document.getElementById("prompt").value;

    const res = await fetch(`${API_URL}/generate-post`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${TOKEN}`
        },
        body: JSON.stringify({ prompt })
    });

    const data = await res.json();

    loadPosts();
    alert("Post generado exitosamente");
}

// LISTAR POSTS
async function loadPosts() {
    const res = await fetch(`${API_URL}/posts`);
    const posts = await res.json();

    const container = document.getElementById("posts-list");
    container.innerHTML = "";

    posts.forEach(post => {
        container.innerHTML += `
            <div class="post-card">
                <h3>${post.title}</h3>
                <p>${post.body}</p>
                <small>SEO: ${post.seo}</small>
            </div>
        `;
    });
}
