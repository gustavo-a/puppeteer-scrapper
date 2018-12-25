# puppeteer-scrapper
Tiny Facebook scrapper made with Puppeteer

## English

### Usage

1. Get your User Agent (You can find it here: http://bfy.tw/LVEw)
2. Paste it to the line `page.setUserAgent('paste here')`
3. Log into Facebook and get your cookies (You can use EditThisCookie extension to Chrome. Download it here: http://www.editthiscookie.com)
4. Create a file __cookies.js__ with:  `module.exports = paste your cookies object array here`
5. Go to a Facebook Search Page. You can use https://searchisback.com to filter your search
6. Copy that page URL and paste it into the `url` variable
7. Open "Inspect Element" on the search page and copy the selector of the element you want  (that's usually the name of the people)
8. Paste it into the variable `nameSelector`
9. Your'e done!

## Português

### Instruções

1. Descubra o seu User Agent (Você pode encontrá-lo aqui: http://bfy.tw/LVEw)
2. Cole na linha `page.setUserAgent('cole aqui')`
3. Faça login no Facebook e extraia os seus cookies (Você pode fazer isso usando a extenção EditThisCookie. Baixe aqui: http://www.editthiscookie.com)
4. Crie um arquivo __cookies.js__ com:  `module.exports = cole seus cookies aqui`
5. Vá para uma pagina de busca do Facebook. Você pode refinar a sua busca com https://searchisback.com
6. Feita a busca, copie a url dessa página de busca e cole na variável `url`
7. Usando a função "Inspecionar Elemento" do seu navegador, copie o seletor relacionado ao elemento que você quer pegar da página. (Esse normalmente é o nome da pessoa)
8. Cole esse seletor na variável `nameSelector`
9. Pronto!
