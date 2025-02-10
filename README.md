<h1 align="center">Partículas PPGEEC</h1>

<p align="justify">Desenho de uma cena em 3D apresenta uma composição, onde a sigla PPGEEC é formada a partir de partículas que se movem dinamicamente, criando uma construção visual.</p>

## Vídeo do Projeto

Link do vídeo mostrando o projeto em funcionamento <br>
<a href="" target="_blank"> Clique aqui!</a>

## Tecnologias e Ferramentas Utilizadas 🔧

<div align="left">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" height="30" alt="html5 logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" height="30" alt="css3 logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg" height="30" alt="javascript logo"/>
  <img width="12" />

Para criar um ambiente adequado de desenvolvimento Web, executamos os seguintes passos:


### Editor de código

Escolha um editor de código de sua preferência. Algumas opções populares incluem o Visual Studio Code, Sublime Text, Atom, entre outros. Você pode baixar e instalar o Visual Studio Code em https://code.visualstudio.com/.

### 1. **Usar o CDN**
Você pode incluir o Three.js diretamente em seu projeto HTML através de um link CDN. Este é o método mais simples para quem quer começar rapidamente, sem gerenciar dependências:

```html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Three.js</title>
	<link rel="stylesheet" href="./main.css">
	<script type="importmap">
		{
		  "imports": {
			"three": "https://cdn.jsdelivr.net/npm/three@0.172.0/build/three.module.js",
			"three/addons/": "https://cdn.jsdelivr.net/npm/three@0.172.0/examples/jsm/"
		  }
		}
	  </script>
</head>
<body>
	<canvas id="three-canvas"></canvas>
  <script type="module" src="main.js"></script>
</body>
</html>
```

## Executando o Projeto ⏳

Para executar o projeto, realize as seguintes etapas:

### Clone do repositório

- Verifique se o git está instalado na sua máquina
- Digite o comando via terminal

~~~
git clonehttps://github.com/prsousa8/particle-words_computer-graphics.git
~~~


### Execução

Utilize a extensão Live Server do VS Code para rodar o projeto localmente.
