const fetchMock = require("../mocks/fetch");
const PROJECT_URL = "./index.html";

const checkSegment = (segment, className, index) => {
  cy.get(`.${segment}`)
    .eq(index)
    .should("exist")
    .should("have.class", className);
};

const checkInitialDisplay = () => {
  // A página é inicialmente carregada exibindo o número '0' no display
  checkSegment("middle-segment", "unselected-segment", 0);
  checkSegment("top-left-segment", "selected-segment", 0);
  checkSegment("top-segment", "selected-segment", 0);
  checkSegment("top-right-segment", "selected-segment", 0);
  checkSegment("bottom-right-segment", "selected-segment", 0);
  checkSegment("bottom-segment", "selected-segment", 0);
  checkSegment("bottom-left-segment", "selected-segment", 0);
};

const submitAnswer = (number) => {
  cy.get("#user-input").type(number);
  cy.get("#submit-data-btn").click();
};

const checkStatusMessage = (messageText, messageClassName) => {
  cy.get(".status-message")
    .should("exist")
    .should("have.class", messageClassName)
    .should("have.text", messageText);
};

const checkDisabledButton = () => {
  cy.get("#submit-data-btn").should("exist").should("be.disabled");
};

const checkNewMatch = () => {
  cy.get(".new-match-btn").should("exist").click();

  checkInitialDisplay();
};

describe("Projeto 'Qual é o número?'", () => {
  beforeEach(() => {
    cy.visit(PROJECT_URL, {
      onBeforeLoad(win) {
        win.fetch = fetchMock;
      },
    });
    cy.wait(1000);
    checkInitialDisplay();
  });

  // limpando o localStorage para os testes não terem interferência entre si
  afterEach(() => {
    cy.clearLocalStorage();
  });

  // Obs: o valor 'mockado' na requisição bem sucedida é "4"
  it("Quando o usuário erra o número para mais, a mensagem e o número corretos são exibidos na tela", () => {
    submitAnswer(5);
    checkStatusMessage("É menor", "wrong-answer");

    checkSegment("middle-segment", "selected-segment", 0);
    checkSegment("top-left-segment", "selected-segment", 0);
    checkSegment("top-segment", "selected-segment", 0);
    checkSegment("top-right-segment", "unselected-segment", 0);
    checkSegment("bottom-right-segment", "selected-segment", 0);
    checkSegment("bottom-segment", "selected-segment", 0);
    checkSegment("bottom-left-segment", "unselected-segment", 0);
  });

  it("Quando o usuário erra o número para menos, a mensagem e o número corretos são exibidos na tela", () => {
    submitAnswer(3);
    checkStatusMessage("É maior", "wrong-answer");

    checkSegment("middle-segment", "selected-segment", 0);
    checkSegment("top-left-segment", "unselected-segment", 0);
    checkSegment("top-segment", "selected-segment", 0);
    checkSegment("top-right-segment", "selected-segment", 0);
    checkSegment("bottom-right-segment", "selected-segment", 0);
    checkSegment("bottom-segment", "selected-segment", 0);
    checkSegment("bottom-left-segment", "unselected-segment", 0);
  });

  it("Quando o usuário acerta o número, a mensagem e o número corretos são exibidos na tela", () => {
    submitAnswer(4);
    checkStatusMessage("Você acertou!!!!", "victory-message");

    checkSegment("middle-segment", "selected-green-segment", 0);
    checkSegment("top-left-segment", "selected-green-segment", 0);
    checkSegment("top-segment", "unselected-segment", 0);
    checkSegment("top-right-segment", "selected-green-segment", 0);
    checkSegment("bottom-right-segment", "selected-green-segment", 0);
    checkSegment("bottom-segment", "unselected-segment", 0);
    checkSegment("bottom-left-segment", "unselected-segment", 0);

    // checando se o botão de enviar resposta está desabilitado
    checkDisabledButton();

    // checando se o botão de nova partida existe e é funcional
    checkNewMatch();
  });

  it("Quando há erro na requisição, a mensagem e o número corretos são exibidos na tela", () => {
    cy.reload();

    // mockando a requisição simulando um erro da API
    cy.intercept(
      "GET",
      "https://us-central1-ss-devops.cloudfunctions.net/rand?min=1&max=300",
      { statusCode: 502, body: { StatusCode: 502, Error: "Bad Gateway" } }
    );
    cy.wait(1000);

    checkStatusMessage("ERRO", "error-message");

    // checando status do primeiro algorismo
    checkSegment("middle-segment", "selected-red-segment", 0);
    checkSegment("top-left-segment", "selected-red-segment", 0);
    checkSegment("top-segment", "selected-red-segment", 0);
    checkSegment("top-right-segment", "unselected-segment", 0);
    checkSegment("bottom-right-segment", "selected-red-segment", 0);
    checkSegment("bottom-segment", "selected-red-segment", 0);
    checkSegment("bottom-left-segment", "unselected-segment", 0);

    // checando status do segundo algorismo
    checkSegment("middle-segment", "unselected-segment", 1);
    checkSegment("top-left-segment", "selected-red-segment", 1);
    checkSegment("top-segment", "selected-red-segment", 1);
    checkSegment("top-right-segment", "selected-red-segment", 1);
    checkSegment("bottom-right-segment", "selected-red-segment", 1);
    checkSegment("bottom-segment", "selected-red-segment", 1);
    checkSegment("bottom-left-segment", "selected-red-segment", 1);

    // checando status do terceiro algorismo
    checkSegment("middle-segment", "selected-red-segment", 2);
    checkSegment("top-left-segment", "unselected-segment", 2);
    checkSegment("top-segment", "selected-red-segment", 2);
    checkSegment("top-right-segment", "selected-red-segment", 2);
    checkSegment("bottom-right-segment", "unselected-segment", 2);
    checkSegment("bottom-segment", "selected-red-segment", 2);
    checkSegment("bottom-left-segment", "selected-red-segment", 2);

    // checando se o botão de enviar resposta está desabilitado
    checkDisabledButton();

    // checando se o botão de nova partida existe e é funcional
    checkNewMatch();
  });
});
