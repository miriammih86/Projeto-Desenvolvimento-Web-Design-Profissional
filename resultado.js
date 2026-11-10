/**
 * Renderiza os dados da API ou os dados locais de demonstração.
 */

const secaoResultado = document.querySelector("#resultado");
const secaoVazia = document.querySelector("#sem-resultado");
const nomeUsuario = document.querySelector("#nome-usuario");
const sintese = document.querySelector("#sintese");
const listaCarreiras = document.querySelector("#lista-carreiras");
const modeloCarreira = document.querySelector("#modelo-carreira");

function mostrarEstadoVazio() {
  secaoResultado.hidden = true;
  secaoVazia.hidden = false;
}

function listaSegura(valor) {
  return Array.isArray(valor) ? valor : [];
}

function renderizarCarreira(carreira, indice) {
  const copia = modeloCarreira.content.cloneNode(true);
  const cartao = copia.querySelector(".carreira");
  const selo = copia.querySelector(".carreira__selo");
  const titulo = copia.querySelector(".carreira__titulo");
  const percentual = copia.querySelector(".carreira__percentual");
  const nivel = copia.querySelector(".barra__nivel");
  const resumo = copia.querySelector(".carreira__resumo");
  const chips = copia.querySelector(".chips");
  const roteiro = copia.querySelector(".roteiro");

  titulo.textContent = carreira.title || "Carreira sem título";
  const nota = Number(carreira.match_score);
  const notaSegura = Number.isFinite(nota) ? Math.max(0, Math.min(100, nota)) : 0;
  percentual.textContent = `${notaSegura}%`;
  nivel.style.width = `${notaSegura}%`;
  nivel.setAttribute("role", "progressbar");
  nivel.setAttribute("aria-valuenow", String(notaSegura));
  nivel.setAttribute("aria-valuemin", "0");
  nivel.setAttribute("aria-valuemax", "100");
  resumo.textContent = carreira.summary || "Resumo não informado.";

  if (indice === 0) {
    selo.hidden = false;
  }

  listaSegura(carreira.key_skills).forEach((habilidade) => {
    const item = document.createElement("li");
    item.textContent = String(habilidade);
    chips.appendChild(item);
  });

  listaSegura(carreira.learning_path).forEach((passo) => {
    const item = document.createElement("li");
    item.textContent = String(passo);
    roteiro.appendChild(item);
  });

  return copia;
}

function renderizarResultado(dados) {
  if (
    !dados ||
    typeof dados.user_name !== "string" ||
    !Array.isArray(dados.recommended_careers) ||
    dados.recommended_careers.length === 0
  ) {
    mostrarEstadoVazio();
    return;
  }

  const carreiras = [...dados.recommended_careers].sort(
    (a, b) => Number(b.match_score || 0) - Number(a.match_score || 0)
  );

  nomeUsuario.textContent = dados.user_name;
  sintese.textContent = dados.career_identity_statement || "Síntese do perfil não informada.";
  listaCarreiras.replaceChildren();

  carreiras.forEach((carreira, indice) => {
    listaCarreiras.appendChild(renderizarCarreira(carreira, indice));
  });

  secaoVazia.hidden = true;
  secaoResultado.hidden = false;
}

const parametros = new URLSearchParams(window.location.search);
let dados = null;

if (parametros.has("exemplo")) {
  dados = typeof DADOS_EXEMPLO !== "undefined" ? DADOS_EXEMPLO : null;
} else {
  try {
    const salvo = sessionStorage.getItem(CONFIG.CHAVE_RESULTADO);
    dados = salvo ? JSON.parse(salvo) : null;
  } catch (erro) {
    console.error("Não foi possível recuperar o resultado salvo:", erro);
  }
}

renderizarResultado(dados);
