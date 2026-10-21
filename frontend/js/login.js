// ============================================================
// login.js — Lógica da tela de Login
// Descrição: Envia e-mail e senha para a API e guarda o token
//            JWT no localStorage quando o login dá certo.
// ============================================================

// endereço da nossa API backend
const API = 'http://127.0.0.1:8000'
const formLogin = document.getElementById('form-login')

// ─── Envia o login e guarda o token ───
formLogin.addEventListener('submit', async (e) => {
  e.preventDefault()

  const dados = {
    email: document.getElementById('email').value,
    senha: document.getElementById('senha').value
  }

  const resposta = await fetch(`${API}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados)
  })

  const resultado = await resposta.json()

  // com senha errada a API devolve status 200 com o campo "erro", então conferimos se veio o token
  if (resposta.ok && resultado.access_token) {
    localStorage.setItem('token', resultado.access_token)   // guarda o token na "gaveta"
    window.location.href = 'dashboard.html'
  } else {
    alert('Erro ao entrar: ' + (resultado.erro || JSON.stringify(resultado)))
  }
})
