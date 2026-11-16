/**
 * Career Dreamer — formulário, validação e integração com a API.
 * Os dados são enviados somente quando CONFIG.API_URL estiver configurada.
 */
const formulario = document.querySelector("#form-perfil");
const botaoIniciar = document.querySelector("#btn-iniciar");
const cartaoFormulario = document.querySelector("#cartao-formulario");
const botaoEnviar = document.querySelector("#btn-enviar");
const campoNome = document.querySelector("#nome");
const campoHobbies = document.querySelector("#hobbies");
const campoInteresses = document.querySelector("#interesses");
const mensagem = document.querySelector("#mensagem");
const modal = document.querySelector("#modal-aviso");
const modalTexto = document.querySelector("#modal-texto");
const botaoFecharModal = document.querySelector("#btn-fechar-modal");

let enviando = false;

function mostrarModal(texto) {
  modalTexto.textContent = texto;
  if (typeof modal.showModal === "function") modal.showModal();
  else window.alert(`Tente mais tarde\n\n${texto}`);
}

function separarItens(texto) {
  return texto.split(",").map((item) => item.trim()).filter(Boolean);
}

function validarLista(campo, descricao) {
  campo.setCustomValidity("");
  if (!campo.value.trim() || separarItens(campo.value).length === 0) {
    campo.setCustomValidity(`Informe pelo menos um(a) ${descricao}, separado(a) por vírgula.`);
    campo.reportValidity();
    campo.focus();
    return false;
  }
  return true;
}

function validarFormulario() {
  campoNome.setCustomValidity("");
  const nome = campoNome.value.trim();
  if (nome.length < 2) campoNome.setCustomValidity("O nome deve ter pelo menos 2 caracteres.");
  else if (nome.length > 60) campoNome.setCustomValidity("O nome deve ter no máximo 60 caracteres.");
  else if (!/^[A-Za-zÀ-ÿ][A-Za-zÀ-ÿ .\x27-]{1,59}$/.test(nome)) campoNome.setCustomValidity("Digite um nome válido, usando letras e espaços.");
  if (!campoNome.checkValidity()) {
    campoNome.reportValidity();
    campoNome.focus();
    return false;
  }
  return validarLista(campoHobbies, "hobby") && validarLista(campoInteresses, "interesse");
}

[campoNome, campoHobbies, campoInteresses].forEach((campo) => {
  campo.addEventListener("input", () => campo.setCustomValidity(""));
});

botaoIniciar.addEventListener("click", () => {
  cartaoFormulario.hidden = false;
  cartaoFormulario.scrollIntoView({ behavior: "smooth", block: "start" });
  campoNome.focus({ preventScroll: true });
});

botaoFecharModal.addEventListener("click", () => modal.close());

formulario.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  if (enviando || !validarFormulario()) return;

  if (typeof CONFIG === "undefined" || !CONFIG.API_URL?.trim()) {
    mostrarModal("O serviço de análise ainda não está configurado. Seus dados continuam preenchidos. Tente novamente mais tarde.");
    return;
  }

  const perfil = {
    name: campoNome.value.trim(),
    hobbies: separarItens(campoHobbies.value),
    interests: separarItens(campoInteresses.value)
  };

  enviando = true;
  botaoEnviar.disabled = true;
  botaoEnviar.textContent = "Analisando seu perfil...";

  const controlador = new AbortController();
  const tempoLimite = window.setTimeout(() => controlador.abort(), Number(CONFIG.TEMPO_LIMITE_MS) || 60000);

  try {
    const resposta = await fetch(CONFIG.API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(perfil),
      signal: controlador.signal
    });
    if (!resposta.ok) throw new Error(`A API respondeu com o status ${resposta.status}.`);

    const dados = await resposta.json();
    if (!dados || typeof dados.user_name !== "string" ||
        typeof dados.career_identity_statement !== "string" ||
        !Array.isArray(dados.recommended_careers) || dados.recommended_careers.length === 0) {
      throw new Error("A resposta da API não segue o formato esperado.");
    }

    sessionStorage.setItem(CONFIG.CHAVE_RESULTADO, JSON.stringify(dados));
    window.location.href = "resultado.html";
  } catch (erro) {
    console.error("Erro ao enviar perfil:", erro);
    const texto = erro.name === "AbortError"
      ? "A análise demorou mais que o esperado. Seus dados continuam preenchidos; tente novamente."
      : "Não foi possível analisar seu perfil. Verifique sua conexão ou tente novamente mais tarde.";
    mostrarModal(texto);
  } finally {
    window.clearTimeout(tempoLimite);
    enviando = false;
    botaoEnviar.disabled = false;
    botaoEnviar.textContent = "Descobrir minha carreira";
  }
});
