let progress = 0;
const bar = document.querySelector("#pgBar");
const ctBar = document.querySelector("#ctBar");
let myInterval;

const progressBar = () => {

  myInterval = setInterval(() => {
    console.log(progress);
    bar.style.width = `${progress}%`;
    progress++;
    if (progress > 70) {
      clearInterval(myInterval);
    }
  }, 50);
};

const completeBar = () => {
    clearInterval(myInterval);
    progress = 100;
    bar.style.width = `${progress}%`;
    ctBar.classList.add("invisible");
}
