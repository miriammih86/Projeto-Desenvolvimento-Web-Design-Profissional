

/**
 * Career Dreamer — formulário, validação e integração com a API.
 */

const formulario = document.querySelector("#form-perfil");
const botaoIniciar = document.querySelector("#btn-iniciar");
const cartaoFormulario = document.querySelector("#cartao-formulario");
const etapas = [...document.querySelectorAll(".etapa")];
const mensagem = document.querySelector("#mensagem");

const campoNome = document.querySelector("#nome");
const campoHobbies = document.querySelector("#hobbies");
const campoInteresses = document.querySelector("#interesses");

const modal = document.querySelector("#modal-aviso");
const modalTexto = document.querySelector("#modal-texto");
const botaoFecharModal = document.querySelector("#btn-fechar-modal");
const botaoEnviar = formulario.querySelector('button[type="submit"]');

let etapaAtual = 0;
let enviando = false;

function mostrarMensagem(texto) {
  mensagem.textContent = texto;
  mensagem.hidden = false;
}

function limparMensagem() {
  mensagem.textContent = "";
  mensagem.hidden = true;
}

function abrirModal(texto) {
  modalTexto.textContent = texto;
  if (typeof modal.showModal === "function") {
    modal.showModal();
  } else {
    alert(`Tente mais tarde\n\n${texto}`);
  }
}

botaoFecharModal.addEventListener("click", () => modal.close());

function mostrarEtapa(indice) {
  if (indice < 0 || indice >= etapas.length) return;

  etapas.forEach((etapa, i) => {
    etapa.hidden = i !== indice;
  });

  etapaAtual = indice;
  limparMensagem();

  const primeiroCampo = etapas[indice].querySelector("input, textarea");
  primeiroCampo?.focus({ preventScroll: true });
}

botaoIniciar.addEventListener("click", () => {
  cartaoFormulario.hidden = false;
  mostrarEtapa(0);
  cartaoFormulario.scrollIntoView({ behavior: "smooth", block: "start" });
});

function separarItens(texto) {
  return texto
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

function validarCampo(campo, tipo) {
  campo.setCustomValidity("");

  if (!campo.value.trim()) {
    campo.setCustomValidity("Preencha este campo para continuar.");
  } else if (tipo === "nome" && campo.value.trim().length < 2) {
    campo.setCustomValidity("O nome deve ter pelo menos 2 caracteres.");
  } else if (tipo === "nome" && campo.value.trim().length > 60) {
    campo.setCustomValidity("O nome deve ter no máximo 60 caracteres.");
  } else if (tipo === "lista" && separarItens(campo.value).length === 0) {
    campo.setCustomValidity("Informe pelo menos um item separado por vírgula.");
  }

  if (!campo.checkValidity()) {
    campo.reportValidity();
    campo.focus();
    return false;
  }

  return true;
}

function etapaValida() {
  const campo = etapas[etapaAtual].querySelector("input, textarea");
  if (!campo) return false;

  const tipo = campo.id === "nome" ? "nome" : "lista";
  return validarCampo(campo, tipo);
}

// AVANÇAR PELO BOTÃO PRÓXIMO
document.querySelectorAll("[data-proximo]").forEach((botao) => {
  botao.addEventListener("click", () => {
    if (etapaValida()) {
      mostrarEtapa(etapaAtual + 1);
    }
  });
});

// VOLTAR PELO BOTÃO
document.querySelectorAll("[data-voltar]").forEach((botao) => {
  botao.addEventListener("click", () => {
    mostrarEtapa(etapaAtual - 1);
  });
});

// NOVA FUNÇÃO: AVANÇAR COM ENTER
document.querySelectorAll(".etapa input, .etapa textarea").forEach((campo) => {
  campo.addEventListener("keydown", (evento) => {
    if (evento.key === "Enter") {
      evento.preventDefault();

      const etapa = campo.closest(".etapa");
      const botaoProximo = etapa.querySelector("[data-proximo]");

      if (botaoProximo && etapaValida()) {
        botaoProximo.click();
      }
    }
  });
});

function respostaValida(dados) {
  return Boolean(
    dados &&
    typeof dados.user_name === "string" &&
    typeof dados.career_identity_statement === "string" &&
    Array.isArray(dados.recommended_careers) &&
    dados.recommended_careers.length > 0
  );
}

formulario.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  if (enviando || !etapaValida()) return;

  if (typeof CONFIG === "undefined" || !CONFIG.API_URL?.trim()) {
    abrirModal("O serviço de análise ainda não foi configurado. Tente novamente mais tarde.");
    return;
  }

  const nome = campoNome.value.trim();
  const hobbies = separarItens(campoHobbies.value);
  const interesses = separarItens(campoInteresses.value);

  if (hobbies.length === 0) {
    mostrarEtapa(1);
    validarCampo(campoHobbies, "lista");
    return;
  }

  if (interesses.length === 0) {
    validarCampo(campoInteresses, "lista");
    return;
  }

  const perfil = { name: nome, hobbies, interests: interesses };
  const textoOriginal = botaoEnviar.textContent;

  enviando = true;
  botaoEnviar.disabled = true;
  botaoEnviar.textContent = "Analisando seu perfil...";
  limparMensagem();

  const controlador = new AbortController();
  const tempoLimite = setTimeout(
    () => controlador.abort(),
    Number(CONFIG.TEMPO_LIMITE_MS) || 60000
  );

  try {
    const resposta = await fetch(CONFIG.API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(perfil),
      signal: controlador.signal
    });

    if (!resposta.ok) {
      throw new Error(`A API respondeu com o status ${resposta.status}.`);
    }

    const dados = await resposta.json();

    if (!respostaValida(dados)) {
      throw new Error("A API respondeu, mas os dados recebidos estão incompletos.");
    }

    sessionStorage.setItem(CONFIG.CHAVE_RESULTADO, JSON.stringify(dados));
    window.location.href = "resultado.html";

  } catch (erro) {
    console.error("Erro ao enviar perfil:", erro);

    const texto = erro.name === "AbortError"
      ? "A análise demorou mais que o esperado. Seus dados continuam preenchidos; tente novamente."
      : "Não foi possível analisar seu perfil agora. Verifique sua conexão e tente novamente.";

    abrirModal(texto);

  } finally {
    clearTimeout(tempoLimite);
    enviando = false;
    botaoEnviar.disabled = false;
    botaoEnviar.textContent = textoOriginal;
  }
});
