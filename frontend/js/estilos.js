// ============================================================
// estilos.js — Lógica da página de Estilos
// Descrição: Lista, cadastra, edita e exclui estilos usando a API.
// ============================================================

// endereço da nossa API backend
const API = 'http://127.0.0.1:8000'

protegerPagina()   // bloqueia a página se não tiver login

// elementos do formulário e do botão de enviar
const formEstilo = document.getElementById('form-estilo')
const botaoSubmit = document.getElementById('btn-submit-estilo')

// ─── Limpa o formulário e devolve o botão para o modo de cadastro ───
function limparFormulario() {
  formEstilo.reset()
  delete formEstilo.dataset.idEstilo
  botaoSubmit.textContent = 'Cadastrar'
  botaoSubmit.classList.remove('btn-success')
  botaoSubmit.classList.add('btn-primary')
}

// ─── Carrega a lista de estilos ao abrir a página ───
async function listarEstilos() {
  const resposta = await fetchAutenticado(`${API}/estilos`)
  const estilos = await resposta.json()

  const corpo = document.getElementById('corpo-tabela')
  corpo.innerHTML = ''

  estilos.forEach(s => {
    corpo.innerHTML += `
      <tr>
        <td>${s.idestilo}</td>
        <td>${s.descricao}</td>
        <td>
          <button class="btn btn-sm btn-warning me-2" onclick='preencherFormularioEdicao(${JSON.stringify(s)})'>Editar</button>
          <button class="btn btn-sm btn-danger" onclick="deletarEstilo(${s.idestilo})">Excluir</button>
        </td>
      </tr>`
  })
}

listarEstilos()

// ─── Cadastrar e atualizar estilos ───
formEstilo.addEventListener('submit', async (e) => {
  e.preventDefault()

  const estilo = { descricao: document.getElementById('descricao').value }
  const idEstilo = formEstilo.dataset.idEstilo

  if (idEstilo) {
    await fetchAutenticado(`${API}/estilos/${idEstilo}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(estilo)
    })
  } else {
    await fetchAutenticado(`${API}/estilos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(estilo)
    })
  }

  limparFormulario()
  listarEstilos()
})

// ─── Abre os dados do estilo no formulário para edição ───
function preencherFormularioEdicao(estilo) {
  document.getElementById('descricao').value = estilo.descricao
  formEstilo.dataset.idEstilo = estilo.idestilo

  botaoSubmit.textContent = 'Salvar alteração'
  botaoSubmit.classList.remove('btn-primary')
  botaoSubmit.classList.add('btn-success')
}

// ─── Exclui um estilo ───
async function deletarEstilo(id) {
  if (!confirm('Tem certeza que deseja excluir este estilo?')) return

  await fetchAutenticado(`${API}/estilos/${id}`, { method: 'DELETE' })
  listarEstilos()
}
