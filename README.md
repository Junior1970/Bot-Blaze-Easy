# Bot de Apostas no Double

Este é um bot de apostas implementado usando o Puppeteer, uma biblioteca do Node.js para automação de navegadores web. O bot foi desenvolvido para realizar apostas no jogo "Double" no site https://blaze.com/pt/games/double. Ele segue uma estratégia de apostas específica com base no resultado das rodadas anteriores.

## Pré-requisitos

Antes de executar o bot, certifique-se de ter o seguinte:

- Node.js instalado em sua máquina.
- Uma conta válida no site https://blaze.com/pt/games/double.
- Configure as variáveis de ambiente necessárias no arquivo `.env`:
  - `USUARIO`: Seu nome de usuário para o site de apostas.
  - `SENHA`: Sua senha para o site de apostas.

## Instalação

1. Clone o repositório:

   ```bash
   git clone https://github.com/Junior1970/Bot-Blaze-Easy
   ```

2. Navegue até o diretório do projeto:

   ```bash
   cd Bot-Blaze-Easy
   ```

3. Instale as dependências:

   ```bash
   npm install dotenv
   npm install pupperteer
   ```

## Uso

Para executar o bot, digite o seguinte comando:

```bash
node blaze.js
```

O bot abrirá uma janela do navegador, acessará a página do jogo "Double" e fará login usando as credenciais fornecidas. Em seguida, ele começará a fazer apostas com base na estratégia implementada. A estratégia envolve selecionar a cor da aposta (vermelho ou preto) com base nos resultados anteriores e ajustar o valor da aposta usando um sistema de martingale.

Por favor, observe que a execução deste bot envolve apostas com dinheiro real e seu uso está sujeito aos termos e condições do site de apostas. Use-o de forma responsável e por sua conta e risco.

## Configuração

Você pode modificar as seguintes variáveis no script para personalizar o comportamento do bot:

- `cash`: O valor inicial de dinheiro em sua conta.
- `base`: O valor base da aposta.
- `base2`: O valor base da aposta como uma string.
- `globalBase`: O valor base global da aposta.
- `martingaleCount`: O contador para o sistema de martingale.
- `maxMartingaleCount`: O número máximo de apostas de martingale permitidas.

Sinta-se à vontade para ajustar essas variáveis de acordo com sua estratégia de apostas desejada.

## Aviso Legal

Este bot de apostas é fornecido apenas para fins educacionais. O uso deste bot para apostas com dinheiro real é por sua conta e risco. Os criadores deste bot não são responsáveis por quaisquer perdas incorridas durante o uso do bot. Aposte sempre com responsabilidade e dentro dos seus limites.

**Observação:** É importante entender e cumprir completamente os termos de serviço do site de apostas antes de usar quaisquer ferramentas ou bots automatizados.
