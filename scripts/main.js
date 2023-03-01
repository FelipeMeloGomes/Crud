const KEY_BD = '@colaboradores';

// lista registros
let listaRegistros = {
  ultimoIdGerado: 0,
  usuarios: [],
};

// filtro variavel
let Filtro = '';

// Ordena os itens
function sortByID(a, b) {
  const idA = a.id;
  const idB = b.id;
  return idA - idB;
}

// gravar os dados
function gravarBD() {
  localStorage.setItem(KEY_BD, JSON.stringify(listaRegistros));
}

// ler os dados
function lerBD() {
  const data = localStorage.getItem(KEY_BD);
  if (data) {
    listaRegistros = JSON.parse(data);
    desenhar();
  }
}

// pesquisa
function pesquisar(value) {
  Filtro = value;
  desenhar();
}

// ordena por id
function ordenarPorId(data) {
  return data.sort((a, b) => (a.id < b.id ? -1 : 1));
}

// desenha
function desenhar() {
  const tbody = document.getElementById('listaRegistrosBody');
  if (tbody) {
    let data = listaRegistros.usuarios;
    if (Filtro.trim()) {
      data = filtrarPorNomeOuFone(data, Filtro.trim());
    }
    data = ordenarPorId(data);
    const rows = gerarLinhasTabela(data);
    tbody.innerHTML = rows.join('');
  }
}

// filtrar por nome
function filtrarPorNomeOuFone(data, filtro) {
  if (!Array.isArray(data) || typeof filtro !== 'string') {
    throw new Error('Os parâmetros devem ser um array e uma string');
  }

  const expReg = new RegExp(filtro.replace(/[^a-z0-9]/gi, ''), 'i');
  return data.filter((usuario) =>
    expReg.test(`${usuario.nome}${usuario.fone}`)
  );
}

// ordernar por nome
function ordenarPorNome(data) {
  return data.sort((a, b) => (a.nome < b.nome ? -1 : 1));
}

// gerar tabela
function gerarLinhasTabela(data) {
  return data.map(
    (usuario) =>
      `<tr>
           <td>${usuario.id}</td> 
           <td>${usuario.nome}</td>
           <td>${usuario.fone}</td>
           <td>${usuario.senha}</td>
           <td>${usuario.salario}</td>
           <td>
             <button onclick='vizualizar("cadastro",false,${usuario.id})'>Editar</button>
             <button class='vermelho' onclick='perguntarSeDeleta(${usuario.id})'>Deletar</button>
           </td>
         </tr>`
  );
}

// inserir usuarios
function insertUsuario(nome, fone, senha, salario) {
  if (!nome || !fone || !senha || !salario) {
    alert('Por favor, preencha todos os campos.');
    return;
  }

  const novoUsuario = {
    id: listaRegistros.ultimoIdGerado + 1,
    nome,
    fone,
    senha,
    salario,
  };

  listaRegistros.ultimoIdGerado++;
  listaRegistros.usuarios.push(novoUsuario);
  atualizarRegistros();
}

// atualizar registros
const atualizarRegistros = () => {
  gravarBD();
  desenhar();
  vizualizar('lista');
};

// editar usuarios
function editUsuario(id, nome, fone, senha, salario) {
  const usuario = listaRegistros.usuarios.find((usuario) => usuario.id == id);
  usuario.nome = nome;
  usuario.fone = fone;
  usuario.senha = senha;
  usuario.salario = salario;
  gravarBD();
  desenhar();
  vizualizar('lista');
}

// deletar usuarios
function deleteUsuario(id) {
  listaRegistros.usuarios = listaRegistros.usuarios.filter(
    (usuario) => usuario.id !== id
  );
  atualizarRegistros();
}

// confirmacao exclusao de usuario
function perguntarSeDeleta(id) {
  const confirmacao = confirm(`Quer deletar o registro de id ${id}?`);
  if (confirmacao) {
    deleteUsuario(id);
  }
}

// limparEditor
function limparEdicao() {
  const form = document.getElementById('cadastroRegistro');
  const inputs = form.getElementsByTagName('input');

  for (let i = 0; i < inputs.length; i++) {
    inputs[i].value = '';
  }
}

// visualizar pagina
function vizualizar(pagina, novo = false, id = null) {
  const body = document.body;
  body.setAttribute('page', pagina);
  const cadastroForm = document.getElementById('cadastroRegistro');
  const idInput = document.getElementById('id');
  const nomeInput = document.getElementById('nome');
  const foneInput = document.getElementById('fone');
  const senhaInput = document.getElementById('senha');
  const salarioInput = document.getElementById('salario');
  if (pagina === 'cadastro') {
    if (novo) {
      limparEdicao();
    }
    if (id) {
      const usuario = listaRegistros.usuarios.find(
        (usuario) => usuario.id == id
      );
      if (usuario) {
        idInput.value = usuario.id;
        nomeInput.value = usuario.nome;
        foneInput.value = usuario.fone;
        senhaInput.value = usuario.senha;
        salarioInput.value = usuario.salario;
      }
    }
    nomeInput.focus();
  }
}

// enviar os dados
function submeter(e) {
  e.preventDefault();

  const idInput = document.getElementById('id');
  const nomeInput = document.getElementById('nome');
  const foneInput = document.getElementById('fone');
  const senhaInput = document.getElementById('senha');
  const salarioInput = document.getElementById('salario');

  const id = idInput.value.trim();
  const nome = nomeInput.value.trim();
  const fone = foneInput.value.trim();
  const senha = senhaInput.value.trim();
  const salario = salarioInput.value.trim();

  if (!nome || !fone || !senha || !salario) {
    alert('Por favor, preencha todos os campos!');
    return;
  }

  if (id) {
    editUsuario(id, nome, fone, senha, salario);
  } else {
    insertUsuario(nome, fone, senha, salario);
  }

  limparEdicao();
}

window.addEventListener('load', () => {
  lerBD();
  document
    .getElementById('cadastroRegistro')
    .addEventListener('submit', submeter);
  document.getElementById('inputPesquisa').addEventListener('keyup', (e) => {
    pesquisar(e.target.value);
  });
});
