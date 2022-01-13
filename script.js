const ledContainer = document.querySelector(".led-number-container");
const submitButton = document.querySelector("#submit-data-btn");
const userInput = document.querySelector("#user-input");

const fetchNumber = () => {
  fetch("https://us-central1-ss-devops.cloudfunctions.net/rand?min=1&max=300")
    .then(async (response) => {
      // Se a requisição for bem sucedida, a função retorna o resultado convertido para Json,
      // do contrário, um erro é retornado.
      if (!response.ok) {
        const res = await response.text();
        throw new Error(res);
      }
      return response.json();
    })
    // Salvando o número retornado pela requisição no localStorage.
    .then(({ value }) => localStorage.setItem("sortedNumber", value))
    // Em caso de erro na requisição, a função handleError é chamada com o status code do erro como parâmetro.
    .catch(({ message }) => handleError(JSON.parse(`${message}`).StatusCode));
};

const handleError = (errorCode) => {
  // Limpando o display antes de exibir um novo valor.
  while (ledContainer.firstChild) {
    ledContainer.removeChild(ledContainer.lastChild);
  }

  // Escrevendo o codigo do erro no display.
  [...String(errorCode)].forEach((val) => setLedDisplay(Number(val)));

  // Alterando a classe dos segmentos selecionados para selected-red-segment, trocando as cores do display para vermelho.
  const statusMessage = document.querySelector(".status-message");
  const selectedSegments = document.querySelectorAll(".selected-segment");

  for (segment of selectedSegments) {
    segment.classList.remove("selected-segment");
    segment.classList.add("selected-red-segment");
  }

  // Exibindo a mensagem de erro.
  statusMessage.innerHTML = "ERRO";
  statusMessage.classList.add("error-message");

  // Criando botao de jogar nova partida e desabilitando o botão de submit.
  newMatchHandler();
};

const createLedSegment = (segment, number) => {
  // Criando uma imagem para cada segmento que forma um algarismo no display.
  const ledSegment = document.createElement("img");
  ledSegment.src = `./images/${segment}.svg`;
  ledSegment.alt = segment;

  // Verificando qual classe o segmento de led deve receber, de acordo com
  // o número e o segmento, para que a coloração seja exibida de forma correta.
  const isSelected = ledScreenSegmentSwitcher(segment, number);
  ledSegment.classList.add(
    segment,
    // Como os segmentos são da cor preta por padrão, se o número escolhido
    // for o "8", não é necessário verificar qual classe cada segmento deve
    // receber, já que todos os segmentos devem ser da cor preta
    number === 8 ? "selected-segment" : isSelected
  );

  return ledSegment;
};

const ledScreenSegmentSwitcher = (ledSegment, number) => {
  // Esta função é responsável por atribuir as classes para os segmentos que compõem um algarismo no display.
  // Se a cor do segmento for preta, a classe escolhida será "selected-segment", caso contrário, e o segmento
  // precisar ser da cor cinza claro, dando o aspecto de "apagado", a classe será "unselected-segment".
  //
  // A lógica da atribuição de classes para cada segmento se deu por um aninhamento de Switches, no qual primeiro
  // é verificado qual número deverá ser formado, e depois qual o segmento está sendo tratado no momento, ex: "top-segment", "middle-segment"...
  //
  // Para cada algarismo, a atribuição de classes se deu da forma mais econômica possível.
  // Para o número 0, por exemplo, é mais fácil apenas atribuir ao segmento "middle-segment" a classe "unselected-segment", e por padrão atribuir aos segmentos
  // que não forem o "middle-segment" a classe "selected-segment" do que o contrário (atribuindo individualmente a classe "selected-segment" a todos os segmentos
  // que não forem o "middle-segment", e atribuindo por padrão a classe "unselected-segment" aos segmentos que não forem especificados).
  // Para o número 1, por exemplo, é mais fácil atribuir a classe "selected-segment" aos segmentos "top-right" e "bottom-right", e por padrão atribuir aos segmentos
  // que não forem estes a classe "unselected-segment".

  switch (number) {
    case 0:
      switch (ledSegment) {
        case "middle-segment":
          return "unselected-segment";
        default:
          return "selected-segment";
      }

    case 1:
      switch (ledSegment) {
        case "bottom-right-segment":
        case "top-right-segment":
          return "selected-segment";
        default:
          return "unselected-segment";
      }

    case 2:
      switch (ledSegment) {
        case "top-left-segment":
        case "bottom-right-segment":
          return "unselected-segment";
        default:
          return "selected-segment";
      }

    case 3:
      switch (ledSegment) {
        case "top-left-segment":
        case "bottom-left-segment":
          return "unselected-segment";
        default:
          return "selected-segment";
      }

    case 4:
      switch (ledSegment) {
        case "top-segment":
        case "bottom-left-segment":
        case "bottom-segment":
          return "unselected-segment";
        default:
          return "selected-segment";
      }

    case 5:
      switch (ledSegment) {
        case "top-right-segment":
        case "bottom-left-segment":
          return "unselected-segment";
        default:
          return "selected-segment";
      }

    case 6:
      switch (ledSegment) {
        case "top-right-segment":
          return "unselected-segment";
        default:
          return "selected-segment";
      }

    case 7:
      switch (ledSegment) {
        case "top-segment":
        case "top-right-segment":
        case "bottom-right-segment":
          return "selected-segment";
        default:
          return "unselected-segment";
      }

    case 9:
      switch (ledSegment) {
        case "bottom-left-segment":
          return "unselected-segment";
        default:
          return "selected-segment";
      }
  }
};

const setLedDisplay = (number) => {
  // Criando o display de led.
  const ledInnerContainer = document.createElement("div");
  ledInnerContainer.className = "led-number-inner-container";
  const algorismContainer = document.createElement("div");
  algorismContainer.className = "algorism-container";

  // As strings no array abaixo fazem referência aos segmentos que formam um algarismo no
  // display, de acordo com o nome de cada SVG no diretório ./images.
  //
  // O nome de cada SVG faz alusão à posição de cada segmento que compõe um algarismo.
  const segmentsNamesArr = [
    "middle-segment",
    "top-left-segment",
    "top-segment",
    "top-right-segment",
    "bottom-right-segment",
    "bottom-segment",
    "bottom-left-segment",
  ];

  // Criando cada segmento de led que compõe um algarismo.
  for (segment in segmentsNamesArr) {
    algorismContainer.appendChild(
      createLedSegment(segmentsNamesArr[segment], number)
    );
  }

  ledInnerContainer.appendChild(algorismContainer);
  ledContainer.appendChild(ledInnerContainer);
};

const newMatchHandler = () => {
  // Criando botão de "nova partida".
  const newMatchBtnContainer = document.querySelector(
    ".new-match-btn-container"
  );
  const newMatchBtn = document.createElement("button");
  const refreshIcon = document.createElement("img");

  refreshIcon.src = "./images/refresh.svg";
  refreshIcon.alt = "refresh icon";
  newMatchBtn.className = "new-match-btn";
  newMatchBtn.innerText = "NOVA PARTIDA";

  // Implementando a funcionalidade de reiniciar o jogo.
  newMatchBtn.addEventListener("click", () => document.location.reload());

  newMatchBtn.appendChild(refreshIcon);
  newMatchBtnContainer.appendChild(newMatchBtn);

  // Desabilitando o botão de submit.
  submitButton.disabled = true;
};

const handleVictory = (statusMessage) => {
  const selectedSegments = document.querySelectorAll(".selected-segment");

  // Alterando a classe dos segmentos selecionados para selected-green-segment, trocando as cores do display para verde.
  for (segment of selectedSegments) {
    segment.classList.remove("selected-segment");
    segment.classList.add("selected-green-segment");
  }

  // Exibindo a mensagem de vitória no display.
  statusMessage.innerHTML = "Você acertou!!!!";
  statusMessage.classList.add("victory-message");

  // Criando botao de jogar nova partida e desabilitando o botão de submit.
  newMatchHandler();
};

const submittedNumberVerifier = (n) => {
  // Resgatando o número sorteado via requisição.
  const sortedNum = Number(localStorage.getItem("sortedNumber"));
  const statusMessage = document.querySelector(".status-message");

  // Alterando mensagem de status de acordo com o palpite do usuário enviado via input de texto.
  if (n > sortedNum) statusMessage.innerHTML = "É menor";
  if (n < sortedNum) statusMessage.innerHTML = "É maior";
  if (n === sortedNum) handleVictory(statusMessage);
};

const submitBtnHandler = () => {
  submitButton.addEventListener("click", () => {
    const { value } = userInput;

    // Verificando se o input do usuário está da forma correta. Se não estiver, um alerta é exibido.
    if (
      isNaN(value) ||
      value.length == 0 ||
      Number(value) < 0 ||
      Number(value) > 999
    )
      return alert("Insira um número não-negativo de 1 a 3 algarismos");

    // Limpando o display antes de exibir um novo valor.
    while (ledContainer.firstChild) {
      ledContainer.removeChild(ledContainer.lastChild);
    }

    // Exibindo o novo valor no display.
    [...value].forEach((val) => setLedDisplay(Number(val)));

    // Checando se o usuario acertou o valor.
    submittedNumberVerifier(Number(value));

    // Limpando o input.
    userInput.value = "";
  });
};

window.onload = () => {
  // Iniciando o display exibindo o número "0".
  setLedDisplay(0);
  submitBtnHandler();
  fetchNumber();
};
