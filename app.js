const paymentLinks = {
  cartao: "https://pay.finaliza.shop/pl/0e896ede91"
};

const CNPJ = "62.198.811/0001-04";

const notice = document.querySelector("#notice");
const message = document.querySelector("#message");
const pixDialog = document.querySelector("#pix-dialog");
const copyButton = document.querySelector("#copy-cnpj");

function isSafeCheckoutUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.username === "" && url.password === "";
  } catch {
    return false;
  }
}

function selectCnpj() {
  const value = document.querySelector("#pix-cnpj-value");
  const range = document.createRange();
  range.selectNodeContents(value);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
}

async function copyCnpj() {
  window.focus();
  try {
    await navigator.clipboard.writeText(CNPJ);
    copyButton.textContent = "CNPJ copiado";
    return;
  } catch {
    selectCnpj();
  }

  let copied = false;
  try {
    copied = document.execCommand("copy");
  } catch {
    copied = false;
  }
  copyButton.textContent = copied ? "CNPJ copiado" : "CNPJ selecionado";
}

document.querySelectorAll("[data-payment]").forEach((button) => {
  button.addEventListener("click", () => {
    const method = button.dataset.payment;

    if (method === "pix") {
      copyButton.textContent = "Copiar CNPJ";
      pixDialog.showModal();
      return;
    }

    const link = paymentLinks[method];
    if (isSafeCheckoutUrl(link)) {
      window.location.assign(link);
      return;
    }

    message.textContent = "O link de pagamento ainda não está disponível nesta página.";
    notice.showModal();
  });
});

copyButton.addEventListener("click", copyCnpj);
