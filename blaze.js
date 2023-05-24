const puppeteer = require('puppeteer');
console.log("BEM VINDO !");

// configurar as variáveis de ambiente
var flag = 0;
var buffer = ["null", "null"];
var valor = 0;
var flagRed = 0;
var flagBlack = 0;
var cash = 24.13; // Valor presente na conta real
var aposta = 0.0;
var acumulado = 0.0;
var base = 0.10; // Aposta base
var base2 = '0.10'; // Aposta base (string)
let globalBase = 0.10; // Aposta global
var firstTime = 0;
var martingaleCount = 0; // Contador de martingale
const maxMartingaleCount = 1; // Limite máximo de martingale permitido

// Importar a biblioteca dotenv
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
      data = await page.evaluate(() => {
        let num = document.querySelector('[class="entry"]').innerText;
        let time = document.querySelector('[class="time-left"]').innerText;
        let currency = document.querySelector('[class=" currency"]').innerText

        num = Number(num);
        time = time.slice(0, 10);

        return {
          num,
          time,
          currency
        };
      });

      let test = Object.values(data);
      let realCash = test[2];
      valor = test[0];

      if (test[1] == "Girando Em" && flag == 0) {
        console.log(test[0]);
        flag = 1;

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

        if (buffer[0] == "Red" && buffer[1] == "Red") {
          flagBlack = 1;
        } else if (buffer[0] == "Black" && buffer[1] == "Black") {
          flagRed = 1;
        }

        if (flagBlack == 1) {
          if (buffer[0] == "Black") {
            flagBlack = 0;
            cash = cash + acumulado + globalBase;
            console.log("WINNNN");
            console.log("RealCASH: ", realCash);
            martingaleCount = 0;
            aposta = 0.0;
            acumulado = 0;
            base = globalBase;
            firstTime = 0;
            await page.click('[class="white "]');
          } else {
            cash = cash - base;
            aposta = base;
            acumulado = acumulado + aposta;
            base2 = JSON.stringify(base);
            await page.click('[type="number"]', { clickCount: 3 });
            await page.type('[type="number"]', base2);

            if (firstTime == 0) {
              await page.click('[class="black "]');
            }
            if (martingaleCount > maxMartingaleCount) {
              console.log("Limite G1.");
              limiteG1 = true; // Define o limite G1 como verdadeiro
              martingaleCount = 0;
              aposta = 0.0;
              acumulado = 0;
              base = globalBase;
              firstTime = 0;
              await page.click('[class="white "]');
            } else {
              await page.click('[class="place-bet"]');
              console.log("APOSTA: ", aposta);
              console.log("COR ESCOLHIDA: ", "BLACK");
              base = base * 2;
              firstTime = 1;
              martingaleCount++;
            }
          }
        } else if (flagRed == 1) {
          if (buffer[0] == "Red") {
            flagRed = 0;
            cash = cash + acumulado + globalBase;
            console.log("WINNNN");
            console.log("RealCASH: ", realCash);
            martingaleCount = 0;
            aposta = 0.0;
            acumulado = 0;
            base = globalBase;
            firstTime = 0;
            await page.click('[class="white "]');
          } else {
            cash = cash - base;
            aposta = base;
            acumulado = acumulado + aposta;
            base2 = JSON.stringify(base);
            await page.click('[type="number"]', { clickCount: 3 });
            await page.type('[type="number"]', base2);

            if (firstTime == 0) {
              await page.click('[class="red "]');
            }
            if (martingaleCount > maxMartingaleCount) {
              console.log("Limite G1.");
              limiteG1 = true; // Define o limite G1 como verdadeiro
              martingaleCount = 0;
              aposta = 0.0;
              acumulado = 0;
              base = globalBase;
              firstTime = 0;
              await page.click('[class="white "]');
            } else {
              await page.click('[class="place-bet"]');
              console.log("APOSTA: ", aposta);
              console.log("COR ESCOLHIDA: ", "RED");
              base = base * 2;
              firstTime = 1;
              martingaleCount++;
            }
          }
        }
      } else if (test[1] == "Girando..." && flag == 1) {
        flag = 0;
      }
    } catch {
      await page.waitForTimeout(3000);
    }

    // Verifica se atingiu o limite G1 e reinicia o loop
    if (limiteG1) {
      limiteG1 = false; // Redefine o limite G1 como falso
      continue; // Reinicia o loop
    }
  }
})();
