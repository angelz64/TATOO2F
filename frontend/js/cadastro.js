// ============================================================
// cadastro.js — Lógica da tela de Cadastro
// Descrição: Envia nome, e-mail e senha para a API criar um usuário.
//            Desde a Aula 16, só um administrador logado pode cadastrar.
// ============================================================

// endereço da nossa API backend
const API = 'http://127.0.0.1:8000'

protegerPagina()   // bloqueia a página se não tiver login — só admin cadastra funcionários
const formCadastro = document.getElementById('form-cadastro')

// ─── Envia o cadastro do usuário ───
formCadastro.addEventListener('submit', async (e) => {
  e.preventDefault()

  const usuario = {
    nome: document.getElementById('nome').value,
    email: document.getElementById('email').value,
    senha: document.getElementById('senha').value
  }

  const resposta = await fetchAutenticado(`${API}/usuarios`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(usuario)
  })
  const dados = await resposta.json()

  // 403 = está logado, mas não é admin
  if (resposta.status === 403) {
    alert('Erro ao cadastrar: apenas administradores podem cadastrar novos funcionários.')
    return
  }

  // a API devolve status 200 mesmo quando o e-mail já existe, mas com o campo "erro"
  if (resposta.ok && !dados.erro) {
    alert('Cadastro feito com sucesso!')
    window.location.href = 'dashboard.html'   // o cadastro agora é feito de dentro do painel
  } else {
    alert('Erro ao cadastrar: ' + (dados.erro || JSON.stringify(dados)))
  }
})
