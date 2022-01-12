const ledContainer = document.querySelector(".led-number-container");
const submitButton = document.querySelector("#submit-data-btn");
const userInput = document.querySelector("#user-input");

const fetchNumber = () => {
  fetch("https://us-central1-ss-devops.cloudfunctions.net/rand?min=1&max=300")
    .then(async (response) => {
      if (!response.ok) {
        const res = await response.text();
        throw new Error(res);
      }
      return response.json();
    })
    .then(({ value }) => localStorage.setItem("sortedNumber", value))
    // em caso de erro na requisição, a função handleError é chamada com o status code do erro como parâmetro
    .catch(({ message }) => handleError(JSON.parse(`${message}`).StatusCode));
};

const handleError = (errorCode) => {
  // limpando o display antes de exibir um novo valor
  while (ledContainer.firstChild) {
    ledContainer.removeChild(ledContainer.lastChild);
  }

  // escrevendo o codigo do erro no display
  [...String(errorCode)].forEach((val) => setLedDisplay(Number(val)));

  // adicionando a classe selected-red-segment nos segmentos selecionados, para trocar as cores do display para vermelho
  const statusMessage = document.querySelector(".status-message");
  const selectedSegments = document.querySelectorAll(".selected-segment");

  for (segment of selectedSegments) {
    segment.classList.remove("selected-segment");
    segment.classList.add("selected-red-segment");
  }

  // exibindo a mensagem de erro
  statusMessage.innerHTML = "Erro";
  statusMessage.classList.add("error-message");

  // criando botao de jogar nova partida e implementando sua funcionalidade
  newMatchHandler();
};

const createLedSegment = (segment, number) => {
  const ledSegment = document.createElement("img");
  ledSegment.src = `./images/${segment}.svg`;
  ledSegment.alt = segment;
  const isSelected = ledScreenSegmentSwitcher(segment, number);
  ledSegment.classList.add(
    segment,
    number === 8 ? "selected-segment" : isSelected
  );

  return ledSegment;
};

const ledScreenSegmentSwitcher = (ledSegment, number) => {
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
  const ledInnerContainer = document.createElement("div");
  ledInnerContainer.className = "led-number-inner-container";
  const algorismContainer = document.createElement("div");
  algorismContainer.className = "algorism-container";

  const segmentsNamesArr = [
    "middle-segment",
    "top-left-segment",
    "top-segment",
    "top-right-segment",
    "bottom-right-segment",
    "bottom-segment",
    "bottom-left-segment",
  ];

  for (segment in segmentsNamesArr) {
    algorismContainer.appendChild(
      createLedSegment(segmentsNamesArr[segment], number)
    );
  }

  ledInnerContainer.appendChild(algorismContainer);
  ledContainer.appendChild(ledInnerContainer);
};

const disableUserInput = () => {
  userInput.disabled = true;
  submitButton.disabled = true;
};

const newMatchHandler = () => {
  // criando botão de "nova partida"
  const newMatchBtnContainer = document.querySelector(
    ".new-match-btn-container"
  );
  const newMatchBtn = document.createElement("button");
  const refreshIcon = document.createElement("img");

  refreshIcon.src = "./images/refresh.svg";
  refreshIcon.alt = "refresh icon";
  newMatchBtn.className = "new-match-btn";
  newMatchBtn.innerText = "NOVA PARTIDA";

  // implementando a funcionalidade de reiniciar o jogo
  newMatchBtn.addEventListener("click", () => document.location.reload());

  newMatchBtn.appendChild(refreshIcon);
  newMatchBtnContainer.appendChild(newMatchBtn);

  // desabilitando os inputs
  disableUserInput();
};

const handleVictory = (statusMessage) => {
  const selectedSegments = document.querySelectorAll(".selected-segment");

  for (segment of selectedSegments) {
    segment.classList.remove("selected-segment");
    segment.classList.add("selected-green-segment");
  }

  statusMessage.innerHTML = "Você acertou!!!!";
  statusMessage.classList.add("victory-message");

  // criando botao de jogar nova partida e implementando sua funcionalidade
  newMatchHandler();
};

const submittedNumberVerifier = (n) => {
  const sortedNum = Number(localStorage.getItem("sortedNumber"));
  const statusMessage = document.querySelector(".status-message");

  if (n > sortedNum) statusMessage.innerHTML = "É menor";
  if (n < sortedNum) statusMessage.innerHTML = "É maior";
  if (n === sortedNum) handleVictory(statusMessage);
};

const submitBtnHandler = () => {
  submitButton.addEventListener("click", () => {
    const { value } = userInput;

    if (
      isNaN(value) ||
      value.length == 0 ||
      Number(value) < 0 ||
      Number(value) > 999
    )
      return alert("Insira um número não-negativo de 1 a 3 algarismos");

    // limpando o display antes de exibir um novo valor
    while (ledContainer.firstChild) {
      ledContainer.removeChild(ledContainer.lastChild);
    }

    // exibindo o novo valor no display
    [...value].forEach((val) => setLedDisplay(Number(val)));

    // checando se o usuario acertou o valor
    submittedNumberVerifier(Number(value));

    // limpando o input
    userInput.value = "";
  });
};

window.onload = () => {
  setLedDisplay(0);
  submitBtnHandler();
  fetchNumber();
};
