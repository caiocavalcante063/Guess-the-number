const ledContainer = document.querySelector(".led-number-container");

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

const sendNumber = () => {
  const sendButton = document.querySelector("#submit-data-btn");

  sendButton.addEventListener("click", () => {
    const { value } = document.querySelector("#user-input");

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
  });
};

window.onload = () => {
  setLedDisplay(0);
  sendNumber();
};
