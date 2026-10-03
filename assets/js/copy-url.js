document.querySelectorAll("[data-copy-url]").forEach((button) => {
  button.addEventListener("click", async () => {
    const originalLabel = button.getAttribute("aria-label");
    const status = button.querySelector("[data-copy-status]");
    const copiedLabel = button.dataset.copySuccess;
    const errorLabel = button.dataset.copyError;

    try {
      await navigator.clipboard.writeText(button.dataset.copyUrl);
      status.textContent = copiedLabel;
      button.setAttribute("aria-label", copiedLabel);
      button.setAttribute("title", copiedLabel);
      window.setTimeout(() => {
        status.textContent = "";
        button.setAttribute("aria-label", originalLabel);
        button.setAttribute("title", originalLabel);
      }, 2000);
    } catch {
      status.textContent = errorLabel;
      button.setAttribute("aria-label", errorLabel);
      button.setAttribute("title", errorLabel);
    }
  });
});
