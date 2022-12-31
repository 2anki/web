export const useSpeechSynthesis = () => () => {
  const mainContent = document.getElementById("main-content");
  if (mainContent) {
    const u = new SpeechSynthesisUtterance(mainContent.innerText);
    speechSynthesis.speak(u);
  }
};
