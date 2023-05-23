const puppeteer = require('puppeteer');
console.log("BEM VINDO !");

let cash = 24.13; // Valor presente na conta real
let base = 0.10; // Aposta base
let base2 = '0.10'; // Aposta base (string)
let globalBase = 0.10; // Aposta global
let martingaleCount = 0; // Contador de martingale
const maxMartingaleCount = 2; // Limite máximo de martingale permitido

// Importar a biblioteca dotenv e configurar as variáveis de ambiente
require('dotenv').config();

// Acessar as variáveis de ambiente do arquivo .env
const usuario = process.env.USUARIO;
const senha = process.env.SENHA;


(async () => {
  console.log('Abrindo navegador...')
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  console.log('Acessando: https://blaze.com/pt/games/double')
  await page.goto('https://blaze.com/pt/games/double');
  await page.setViewport({ width: 1200, height: 800 });
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36');

  await page.click('[class="link"]');
  await page.waitForTimeout(10000);
  console.log('Inserindo usuário...')
  await page.waitForTimeout(3000);
  await page.type('[name="username"]', usuario); //Login do usuário
  console.log('Inserindo senha...')
  await page.type('[type="password"]', senha); //Senha
  await page.waitForTimeout(3000);
  console.log('Login com sucesso !')
  await page.click('[class = "input-footer"]');
  await page.waitForTimeout(30000);

  // TEST "number"
  await page.type('[type="number"]', base2);
  await page.waitForTimeout(3000);
  await page.click('[type="number"]', { clickCount: 3 });
  await page.type('[type="number"]', base2); // valor de entrada

  // TEST CLICK "white"
  await page.click('[class="red "]');
  await page.waitForTimeout(1000);
  await page.click('[class="black "]');
  await page.waitForTimeout(1000);
  await page.click('[class="white "]');

  let limiteG1 = false; // Variável para controlar o limite G1

  while (true) {
    try {
      const data = await page.evaluate(() => {
        const num = Number(document.querySelector('[class="entry"]').innerText);
        const time = document.querySelector('[class="time-left"]').innerText;
        const currency = document.querySelector('[class=" currency"]').innerText

        return {
          num,
          time,
          currency
        };
      });

      const valor = data.num;

      if (data.time === "Girando Em") {
        console.log(valor);

        let buffer = ["null", "null"];
        if (valor > 7) {
          buffer[1] = buffer[0];
          buffer[0] = "Black";
        } else if (valor < 8 && valor !== 0) {
          buffer[1] = buffer[0];
          buffer[0] = "Red";
        } else {
          buffer[1] = buffer[0];
          buffer[0] = "White";
        }

        console.log("BUFFER: ", buffer);

        if (buffer[0] === "Red" && buffer[1] === "Red") {
          if (buffer[0] === "Black") {
            cash = cash + globalBase;
            console.log("WINNNN");
            console.log("RealCASH: ", data.currency);
            martingaleCount = 0;
          } else {
            cash = cash - base;
            await page.type('[type="number"]', base.toString());
            if (martingaleCount > maxMartingaleCount) {
              console.log("Limite G1.");
              limiteG1 = true;
              martingaleCount = 0;
              base = globalBase;
            } else {
              await page.click('[class="place-bet"]');
              console.log("APOSTA: ", base);
              console.log("COR ESCOLHIDA: ", "BLACK");
              base = base * 2;
              martingaleCount++;
            }
          }
        } else if (buffer[0] === "Black" && buffer[1] === "Black") {
          if (buffer[0] === "Red") {
            cash = cash + globalBase;
            console.log("WINNNN");
            console.log("RealCASH: ", data.currency);
            martingaleCount = 0;
          } else {
            cash = cash - base;
            await page.type('[type="number"]', base.toString());
            if (martingaleCount > maxMartingaleCount) {
              console.log("Limite G1.");
              limiteG1 = true;
              martingaleCount = 0;
              base = globalBase;
            } else {
              await page.click('[class="place-bet"]');
              console.log("APOSTA: ", base);
              console.log("COR ESCOLHIDA: ", "RED");
              base = base * 2;
              martingaleCount++;
            }
          }
        }
      }
    } catch {
      await page.waitForTimeout(3000);
    }

    if (limiteG1) {
      limiteG1 = false;
      continue;
    }
  }
})();

