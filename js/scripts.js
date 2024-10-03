const addressForm = document.querySelector("#address-form");
const cepInput = document.querySelector("#cep");
const addressInput = document.querySelector("#address");
const cityInput = document.querySelector("#city");
const neighborhoodInput = document.querySelector("#neighborhood");
const regionInput = document.querySelector("#region");
const formInputs = document.querySelectorAll("[data-input]");
const fadeElement = document.querySelector("#fade");

const closeButton = document.querySelector("#close-message");

// Validação da entrada do input
cepInput.addEventListener("input", (e) => {
  const onlyNumbers = /^[0-9]*$/; // regex ajustada para aceitar apenas números
  const inputValue = e.target.value;

  // Impede caracteres não numéricos
  if (!onlyNumbers.test(inputValue)) {
    e.target.value = inputValue.replace(/\D/g, ""); // Remove caracteres não numéricos
  }

  // Verifica o comprimento do CEP (8 dígitos)
  if (inputValue.length === 8) {
    getAdress(inputValue);
  }
});

const toggleDisabled = () => {
  if (regionInput.hasAttribute("disabled")) {
    formInputs.forEach((input) => {
      input.removeAttribute("disabled");
    });
  } else {
    formInputs.forEach((input) => {
      input.setAttribute("disabled", "disabled");
    });
  }
};

const getAdress = async (cep) => {
  toggleLoader();
  cepInput.blur();

  const apiUrl = `https://viacep.com.br/ws/${cep}/json/`;

  const response = await fetch(apiUrl);
  const data = await response.json();

  if (data.erro) {
    if (!addressInput.hasAttribute("disabled")) {
      toggleDisabled();
    }

    // data.erro viacep retorna como um booleano já
    addressForm.reset(); // Reseta o formulário nativo
    toggleLoader();
    toggleMessage("CEP Inválido, tente novamente!");
    return;
  }

  if (addressInput.value === "") {
    toggleDisabled();
  }

  // Atualiza os valores nos inputs
  addressInput.value = data.logradouro;
  cityInput.value = data.localidade;
  neighborhoodInput.value = data.bairro;
  regionInput.value = data.uf;

  // Remove o atributo 'disabled' dos campos preenchidos
  formInputs.forEach((input) => {
    input.removeAttribute("disabled");
  });

  toggleLoader();
};

// Mostrar a animação de loading
const toggleLoader = () => {
  const loaderElement = document.querySelector("#loader");

  fadeElement.classList.toggle("hide");
  loaderElement.classList.toggle("hide");
};

// Mostrar mensagem de erro
const toggleMessage = (msg = "") => {
  const messageElement = document.querySelector("#message");
  const messageElementText = document.querySelector("#message p");

  if (msg) {
    messageElementText.innerText = msg;
  }

  fadeElement.classList.toggle("hide");
  messageElement.classList.toggle("hide");
};

// Fechar mensagem modal
closeButton.addEventListener("click", () => toggleMessage());

//salvar as informações

addressForm.addEventListener("submit", (e) => {
  e.preventDefault();
  toggleLoader();

  setTimeout(() => {
    toggleLoader();

    toggleMessage("Endereço salvo com sucesso");

    addressForm.reset();

    // Verifique se você realmente precisa dessa função, ou declare-a
    toggleDisabled(); // Certifique-se de que a função 'toggleDisabled' existe
  }, 1500);
});
