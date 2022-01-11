const createLedSegment = (segment, number) => {
  const ledSegment = document.createElement("img");
  ledSegment.src = `./images/${segment}.svg`;
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
  const ledContainer = document.querySelector(".led-number-container");
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

  ledContainer.appendChild(algorismContainer);
};

window.onload = () => {
  setLedDisplay(4);
};
