/**
 * Career Dreamer — formulário, validação e análise de perfil.
 * Usa a API quando configurada; caso contrário, oferece recomendações locais.
 */
const formulario = document.querySelector("#form-perfil");
const botaoIniciar = document.querySelector("#btn-iniciar");
const cartaoFormulario = document.querySelector("#cartao-formulario");
const botaoEnviar = document.querySelector("#btn-enviar");
const campoNome = document.querySelector("#nome");
const campoHobbies = document.querySelector("#hobbies");
const campoInteresses = document.querySelector("#interesses");
const modal = document.querySelector("#modal-aviso");
const modalTexto = document.querySelector("#modal-texto");
const botaoFecharModal = document.querySelector("#btn-fechar-modal");

let enviando = false;

function mostrarModal(texto) {
  if (!modal || !modalTexto) {
    window.alert(texto);
    return;
  }
  modalTexto.textContent = texto;
  if (typeof modal.showModal === "function") modal.showModal();
  else window.alert(texto);
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
  else if (!/^[A-Za-zÀ-ÿ][A-Za-zÀ-ÿ .\x27-]{1,59}$/.test(nome)) {
    campoNome.setCustomValidity("Digite um nome válido, usando letras e espaços.");
  }
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

if (botaoIniciar && cartaoFormulario) {
  botaoIniciar.addEventListener("click", () => {
    cartaoFormulario.hidden = false;
    cartaoFormulario.scrollIntoView({ behavior: "smooth", block: "start" });
    campoNome.focus({ preventScroll: true });
  });
}

if (botaoFecharModal && modal) {
  botaoFecharModal.addEventListener("click", () => modal.close());
}

const catalogoCarreiras = [
  {
    id: "desenvolvimento-web",
    title: "Desenvolvedor(a) Web",
    keywords: ["programacao", "codigo", "site", "sites", "tecnologia", "logica", "computador", "html", "javascript"],
    summary: "Cria sites e sistemas para resolver problemas e oferecer experiências digitais.",
    key_skills: ["HTML e CSS", "JavaScript", "Lógica de programação", "Resolução de problemas"],
    learning_path: ["Aprender HTML e CSS", "Estudar lógica e JavaScript", "Criar projetos próprios", "Conhecer APIs e frameworks"]
  },
  {
    id: "ui-ux",
    title: "Designer UI/UX",
    keywords: ["design", "desenho", "desenhar", "arte", "criatividade", "cores", "interface", "experiencia", "visual", "figma"],
    summary: "Planeja interfaces e experiências digitais fáceis de entender e agradáveis de usar.",
    key_skills: ["Criatividade", "Figma", "Pesquisa com usuários", "Acessibilidade"],
    learning_path: ["Estudar princípios de design", "Aprender Figma", "Criar protótipos", "Testar interfaces com usuários"]
  },
  {
    id: "games",
    title: "Desenvolvedor(a) de Jogos Digitais",
    keywords: ["jogos", "game", "games", "videogame", "jogar", "historia", "desenho", "programacao", "criatividade"],
    summary: "Desenvolve jogos, mecânicas, personagens e experiências interativas.",
    key_skills: ["Lógica de programação", "Game design", "Criatividade", "Unity ou Godot"],
    learning_path: ["Estudar lógica de programação", "Conhecer Unity ou Godot", "Criar um jogo simples", "Desenvolver um projeto completo"]
  },
  {
    id: "dados-ia",
    title: "Analista de Dados e Inteligência Artificial",
    keywords: ["dados", "matematica", "numeros", "pesquisa", "analise", "ia", "inteligencia artificial", "logica", "estatistica"],
    summary: "Analisa informações e utiliza dados para encontrar padrões e apoiar decisões.",
    key_skills: ["Raciocínio lógico", "Excel", "SQL", "Python"],
    learning_path: ["Aprender planilhas", "Estudar estatística básica", "Aprender SQL", "Explorar Python e visualização de dados"]
  },
  {
    id: "seguranca",
    title: "Analista de Segurança da Informação",
    keywords: ["seguranca", "investigacao", "computador", "tecnologia", "redes", "logica", "problemas", "privacidade"],
    summary: "Ajuda a proteger sistemas, redes e informações contra riscos digitais.",
    key_skills: ["Redes de computadores", "Sistemas operacionais", "Atenção a detalhes", "Boas práticas de segurança"],
    learning_path: ["Conhecer hardware e sistemas", "Estudar redes", "Aprender fundamentos de segurança", "Praticar em ambientes educacionais autorizados"]
  },
  {
    id: "produto",
    title: "Gerente de Projetos e Produtos Digitais",
    keywords: ["organizar", "organizacao", "planejar", "liderar", "equipe", "comunicacao", "resolver", "projetos"],
    summary: "Organiza projetos e conecta as necessidades das pessoas às soluções desenvolvidas por equipes.",
    key_skills: ["Comunicação", "Planejamento", "Trabalho em equipe", "Metodologias ágeis"],
    learning_path: ["Estudar fundamentos de projetos", "Conhecer Scrum e Kanban", "Praticar planejamento", "Participar de projetos em equipe"]
  },
  {
    id: "marketing",
    title: "Profissional de Marketing Digital",
    keywords: ["redes sociais", "comunicacao", "escrever", "fotografia", "video", "criatividade", "publicidade", "conteudo"],
    summary: "Planeja conteúdos e estratégias digitais para comunicar ideias e conectar marcas a pessoas.",
    key_skills: ["Comunicação", "Produção de conteúdo", "Análise de métricas", "Criatividade"],
    learning_path: ["Estudar comunicação digital", "Aprender criação de conteúdo", "Conhecer métricas", "Montar um portfólio"]
  },
  {
    id: "suporte",
    title: "Analista de Suporte e Infraestrutura",
    keywords: ["ajudar", "consertar", "montar", "computador", "hardware", "tecnologia", "resolver", "redes"],
    summary: "Ajuda pessoas a utilizar a tecnologia e mantém computadores, redes e sistemas funcionando.",
    key_skills: ["Hardware", "Redes", "Sistemas operacionais", "Atendimento"],
    learning_path: ["Conhecer componentes de computadores", "Estudar sistemas operacionais", "Aprender redes básicas", "Praticar diagnóstico de problemas"]
  }
];

function normalizar(texto) {
  return texto.toLocaleLowerCase("pt-BR").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function gerarResultadoLocal(perfil) {
  const textoPerfil = normalizar([...perfil.hobbies, ...perfil.interests].join(" "));
  const carreiras = catalogoCarreiras.map((carreira) => {
    const pontos = carreira.keywords.reduce((total, palavra) => {
      return total + (textoPerfil.includes(normalizar(palavra)) ? 1 : 0);
    }, 0);
    return {
      ...carreira,
      match_score: Math.min(98, 55 + pontos * 9)
    };
  }).sort((a, b) => b.match_score - a.match_score).slice(0, 4);

  return {
    user_name: perfil.name,
    career_identity_statement:
      `Olá, ${perfil.name}! Considerando os hobbies informados (${perfil.hobbies.join(", ")}) e seus interesses (${perfil.interests.join(", ")}), estas são algumas áreas que podem combinar com seu perfil. Esta é uma análise inicial feita pelo próprio site, sem inteligência artificial ou consulta a um serviço externo.`,
    recommended_careers: carreiras
  };
}

formulario.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  if (enviando || !validarFormulario()) return;

  const perfil = {
    name: campoNome.value.trim(),
    hobbies: separarItens(campoHobbies.value),
    interests: separarItens(campoInteresses.value)
  };

  enviando = true;
  botaoEnviar.disabled = true;
  botaoEnviar.textContent = "Analisando seu perfil...";

  try {
    let dados;
    const apiConfigurada = typeof CONFIG !== "undefined" && CONFIG.API_URL?.trim();

    if (apiConfigurada) {
      const controlador = new AbortController();
      const tempoLimite = window.setTimeout(
        () => controlador.abort(),
        Number(CONFIG.TEMPO_LIMITE_MS) || 60000
      );
      try {
        const resposta = await fetch(CONFIG.API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify(perfil),
          signal: controlador.signal
        });
        if (!resposta.ok) throw new Error(`A API respondeu com o status ${resposta.status}.`);
        dados = await resposta.json();
      } finally {
        window.clearTimeout(tempoLimite);
      }
      if (!dados || typeof dados.user_name !== "string" ||
          typeof dados.career_identity_statement !== "string" ||
          !Array.isArray(dados.recommended_careers) || dados.recommended_careers.length === 0) {
        throw new Error("A resposta da API não segue o formato esperado.");
      }
    } else {
      dados = gerarResultadoLocal(perfil);
    }

    const chaveResultado = typeof CONFIG !== "undefined"
      ? CONFIG.CHAVE_RESULTADO
      : "careerDreamer:resultado";
    sessionStorage.setItem(chaveResultado, JSON.stringify(dados));
    window.location.href = "resultado.html";
  } catch (erro) {
    console.error("Erro ao analisar perfil:", erro);
    mostrarModal(
      erro.name === "AbortError"
        ? "A análise demorou mais que o esperado. Seus dados continuam preenchidos; tente novamente."
        : "Não foi possível concluir a análise. Verifique sua conexão ou tente novamente."
    );
  } finally {
    enviando = false;
    botaoEnviar.disabled = false;
    botaoEnviar.textContent = "Descobrir minha carreira";
  }
});
