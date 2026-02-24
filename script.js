let produtos = [];
let produtosEmbaralhados = [];
let quantidadeExibida = 5;

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const suggestions = document.getElementById("suggestions");
const resultadoContainer = document.getElementById("resultadoContainer");
const resultsContainer = document.getElementById("results");
const recomendadosContainer = document.getElementById("recomendadosContainer");
const randomProductsContainer = document.getElementById("randomProducts");
const verMaisBtn = document.getElementById("verMais");


// =============================
// CARREGAR PRODUTOS
// =============================
fetch("produtos.json")
  .then(res => res.json())
  .then(data => {
    produtos = data;
    produtosEmbaralhados = [...produtos].sort(() => 0.5 - Math.random());
    mostrarAleatorios();
  });


// =============================
// CRIAR CARD
// =============================
function criarCard(produto) {
  const card = document.createElement("div");
  card.classList.add("card");

  if (produto.esgotado) {
    card.classList.add("esgotado");
  }

  card.innerHTML = `
    <img src="${produto.imagem}" />
    <h3>${produto.nome}</h3>
    <p>${produto.preco}</p>
    ${
      !produto.esgotado
        ? `<button onclick="window.open('${produto.link}', '_blank')">Ver Produto</button>`
        : ""
    }
  `;

  return card;
}


// =============================
// MOSTRAR PRODUTOS ALEATÓRIOS
// =============================
function mostrarAleatorios() {
  randomProductsContainer.innerHTML = "";

  produtosEmbaralhados
    .slice(0, quantidadeExibida)
    .forEach(produto => {
      randomProductsContainer.appendChild(criarCard(produto));
    });
}


// BOTÃO VER MAIS
verMaisBtn.addEventListener("click", () => {
  quantidadeExibida += 3;
  mostrarAleatorios();
});


// =============================
// AUTOCOMPLETE
// =============================
searchInput.addEventListener("input", () => {
  const termo = searchInput.value.toLowerCase();
  suggestions.innerHTML = "";

  if (termo.length < 2) return;

  const filtrados = produtos.filter(p =>
    p.nome.toLowerCase().includes(termo) ||
    p.tags.some(tag => tag.toLowerCase().includes(termo))
  );

  filtrados.slice(0, 5).forEach(produto => {
    const div = document.createElement("div");
    div.textContent = produto.nome;

    div.onclick = () => {
      searchInput.value = produto.nome;
      suggestions.innerHTML = "";
      mostrarResultados(produto.nome);
    };

    suggestions.appendChild(div);
  });
});


// =============================
// BUSCA
// =============================
searchBtn.addEventListener("click", () => {
  mostrarResultados(searchInput.value);
});

searchInput.addEventListener("keypress", e => {
  if (e.key === "Enter") {
    mostrarResultados(searchInput.value);
  }
});


// =============================
// MOSTRAR RESULTADOS
// =============================
function mostrarResultados(termo) {

  resultsContainer.innerHTML = "";
  suggestions.innerHTML = "";

  if (!termo || termo.trim() === "") {
    resultadoContainer.style.display = "none";
    recomendadosContainer.style.display = "block";
    return;
  }

  const filtrados = produtos.filter(p =>
    p.nome.toLowerCase().includes(termo.toLowerCase()) ||
    p.tags.some(tag => tag.toLowerCase().includes(termo.toLowerCase()))
  );

  resultadoContainer.style.display = "block";
  recomendadosContainer.style.display = "none";

  if (filtrados.length > 0) {
    filtrados.forEach(produto => {
      resultsContainer.appendChild(criarCard(produto));
    });
  } else {
    resultsContainer.innerHTML = "<p>Nenhum produto encontrado.</p>";
  }

  resultadoContainer.scrollIntoView({ behavior: "smooth" });
}