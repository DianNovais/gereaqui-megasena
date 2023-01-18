

const url = "https://servicebus2.caixa.gov.br/portaldeloterias/api/megasena/";
const paragraph = document.querySelector("#paragraph_content");
const warning = document.querySelector("#warning");

const pegarResultado = async () => {
  const veryVerify = JSON.parse(localStorage.getItem("testes"));
  const count = Date.now() - veryVerify;
  const min = Math.round((86400000 - count) / 60000);
  if (count > 86400000) {
    progressBar();

    const dataConcurso = async () => {
      const resp = await fetch(url);
      const json = await resp.json();
      return json;
    };
    const data = await dataConcurso();

    let concurso = data.numero - 1;
    const ultimoConsurso = data.numero - 61;

    let dezenas = [];
    let dezenasRepeat = [];
    let dezenaRepeated = [];
    let selecionadas = [];

    const pegarDezenas = () => {
      for (i = 0; i < dezenas.length; i++) {
        const numero = dezenas[i];
        const dezena = { dezenaNumber: numero, qtd: 1 };

        dezenasRepeat.push(dezena);


        if (i == dezenas.length - 1) {
          console.log("pegar dezena executado");
          dezenasRepeat.forEach(verifyDezenasRepeat);
          console.log(dezenaRepeated);
        }
      }
    };

    const verifyDezenasRepeat = (item, index) => {
      const lengthDezena = dezenasRepeat.filter((obj) => {
        return item.dezenaNumber == obj.dezenaNumber;
      });
      const info = {
        dezena: item.dezenaNumber,
        quantidadeVezes: lengthDezena.length,
      };
      dezenaRepeated.push(info);
    };

    while (concurso >= ultimoConsurso) {
      const res = await fetch(url + "/" + concurso);
      const json = await res.json();
      dezenas.push(...json.listaDezenas);
      concurso = concurso - 1;
      if (concurso == ultimoConsurso) {
        console.log(concurso);
        pegarDezenas();
      }
    }

    // TOTAL DA SOMA
    let total = 0;

    // FUNÇÃO DA SOMA
    const somarDezenas = (item) => {
      total += item.quantidadeVezes;
    };

    //SOMAR MEDIA DE CADA DEZENA REPETIDA
    dezenaRepeated.forEach(somarDezenas);

    const average = Math.round(total / dezenaRepeated.length);

    console.log(average);

    const dezenasMaisSaidas = dezenaRepeated.filter((item) => {
      return item.quantidadeVezes > average;
    });

    dezenasMaisSaidas.map((item) => {
      selecionadas.push(item.dezena);
    });

    let selecionadasNoDuplicateRandom = [...new Set(selecionadas)];
    let selecionadasNoDuplicate = selecionadasNoDuplicateRandom.sort((a, b) => {
      return a - b;
    });

    let div = document.querySelector("#numberContent");
    selecionadasNoDuplicate.forEach((item) => {
      console.log(item);
      let newElemment = document.createElement("span");
      newElemment.innerHTML = `<span class="d-flex align-items-center justify-content-center bg-success rounded-circle text-white bold" style="width: 40px; height: 40px;">${item}</span>`;
      div.appendChild(newElemment);
    });

    localStorage.setItem("testes", Date.now());

    completeBar();
  } else {
    warning.classList.remove("invisible");
    warning.textContent = `Você já gerou os números hoje, por favor aguarde ${min} minutos.`;
  }

};
