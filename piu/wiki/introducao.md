# Introdução ao JavaScript

## Variáveis

Se você já conhece variáveis em outras linguagens, a ideia é a mesma. No JavaScript moderno, usamos `let` e `const`:

```javascript
let nome = "Maria"; // pode ser reatribuída
const PI = 3.14159; // não pode ser reatribuída

nome = "João"; // ✅ válido
PI = 3; // ❌ erro!
```

> [!TIP]
> Evite `var` — ela existe por razões históricas, mas possui comportamentos de escopo que podem causar confusão. Prefira sempre `let` e `const`.

### Tipos de dados

JavaScript possui **tipagem dinâmica**: o tipo é inferido automaticamente.

```javascript
let numero = 42; // number
let texto = "Olá, mundo!"; // string
let ativo = true; // boolean
let vazio = null; // null (ausência intencional de valor)
let indefinido; // undefined (não inicializado)
let lista = [1, 2, 3]; // array
let pessoa = { nome: "Ana" }; // object
```

Para descobrir o tipo de uma variável, use `typeof`:

```javascript
typeof numero; // "number"
```

---

## Operadores

Os operadores aritméticos são os mesmos de sempre (`+`, `-`, `*`, `/`, `%`). Porém, preste atenção aos operadores de comparação:

```javascript
5 == "5"; // true  — compara apenas o valor (evite!)
5 === "5"; // false — compara valor e tipo (prefira este)
5 !== "5"; // true
```

> [!IMPORTANT]
> **Regra de ouro:** use sempre `===` e `!==` para evitar comportamentos inesperados causados por conversões automáticas de tipo.

---

## Condicionais

A sintaxe é semelhante à de outras linguagens:

```javascript
let hora = 14;

if (hora < 12) {
    console.log("Bom dia!");
} else if (hora < 18) { // equivalente ao elif do Python
    console.log("Boa tarde!");
} else {
    console.log("Boa noite!");
}
```

### Operador ternário

Uma forma compacta de escrever condições simples:

```javascript
let idade = 20;
let status = idade >= 18 ? "adulto" : "menor de idade";

console.log(status); // "adulto"
```

A estrutura do operador ternário é:

```javascript
condicao ? valorSeVerdadeiro : valorSeFalso
```

---

## Loops

### `for`

```javascript
for (let i = 0; i < 5; i++) {
    console.log(i); // 0, 1, 2, 3, 4
}
```

### `for...of` (para arrays)

```javascript
let frutas = ["maçã", "banana", "laranja"];

for (let fruta of frutas) {
    console.log(fruta); // "maçã", "banana", "laranja"
}
```

### `for...in` (para propriedades/índices)

```javascript
let frutas = ["maçã", "banana", "laranja"];

for (let indice in frutas) {
    console.log(indice); // 0, 1, 2
}
```

> [!WARNING]
> `for...in` percorre os índices/propriedades do objeto, não os valores. Para iterar diretamente sobre os valores de um array, prefira `for...of`.

### `while`

```javascript
let contador = 0;

while (contador < 3) {
    console.log("contando:", contador); // 0, 1, 2
    contador++;
}
```

### `do...while`

```javascript
let contador = 0;

do {
    console.log("contando:", contador); // 0, 1, 2
    contador++;
} while (contador < 3);
```

---

## Funções

Funções em JavaScript são **cidadãs de primeira classe**: podem ser armazenadas em variáveis, passadas como argumento e retornadas por outras funções.

### Declaração clássica

```javascript
function somar(a, b) {
    return a + b;
}

console.log(somar(3, 4)); // 7
```

### Arrow function (sintaxe moderna)

```javascript
const somar = (a, b) => a + b;

console.log(somar(3, 4)); // 7
```

Arrow functions são amplamente utilizadas no JavaScript moderno por sua sintaxe concisa.

Um detalhe importante é o uso das chaves (`{}`):

```javascript
const somar1 = (a, b) => a + b;

const somar2 = (a, b) => {
    return a + b;
};
```

Na função `somar2`, o uso das chaves exige o uso explícito de `return`.

---

## Arrays e métodos essenciais

Arrays em JavaScript possuem métodos muito poderosos para transformar e manipular dados:

```javascript
let numeros = [1, 2, 3, 4, 5];

// map — transforma cada elemento
let dobrados = numeros.map((n) => n * 2);
// [2, 4, 6, 8, 10]

// filter — filtra elementos por condição
let pares = numeros.filter((n) => n % 2 === 0);
// [2, 4]

// reduce — acumula valores em um único resultado
let soma = numeros.reduce((acc, n) => acc + n, 0);
// 15

// forEach — executa uma função para cada elemento
numeros.forEach((num) => {
    console.log(num); // 1, 2, 3, 4, 5
});
```

---

## Objetos

Objetos são coleções de pares **chave: valor** e formam a base de praticamente tudo em JavaScript.

```javascript
const pessoa = {
    nome: "Carlos",
    idade: 28,
    saudar() {
        return `Olá, meu nome é ${this.nome}`;
    },
};

console.log(pessoa.nome); // "Carlos"
console.log(pessoa.saudar()); // "Olá, meu nome é Carlos"
```

> A sintaxe `texto ${variavel}` é chamada de **template literal** e permite interpolar variáveis diretamente em strings.


```javascript
const pessoa = {
    nome: "Carlos",
    idade: 28,
    saudar: () => {
        return `Olá, meu nome é ${this.nome}`;
    },
};

console.log(pessoa.nome); // "Carlos"
console.log(pessoa.saudar()); // Olá, meu nome é undefined
```

Ao trocar o método `saudar` por uma [**arrow function**](#arrow-function-sintaxe-moderna) o `this` não se refere ao objeto **pessoa**, mas sim um objeto pai...Por via das dúvidas use a declaração anterior.

---

## Promises e async/await

JavaScript é **single-threaded** — executa uma tarefa por vez. Porém, muitas operações do mundo real levam tempo: buscar dados de uma API, ler arquivos ou aguardar temporizadores. Para evitar bloquear a execução enquanto espera essas operações terminarem, JavaScript utiliza um modelo **assíncrono**.

### O problema do código síncrono

Imagine buscar dados de um servidor de forma síncrona (bloqueante):

```javascript
// ⚠️ Hipotético — JavaScript não funciona assim
const dados = buscarDaAPI();

console.log(dados);
console.log("Isso só executa depois da resposta");
```

Isso travaria o navegador inteiro enquanto a resposta não chegasse. A solução são as **Promises**.

---

### Promise

Uma `Promise` representa um valor que **ainda não está disponível**, mas poderá estar no futuro — ou falhar com um erro.

Ela possui três estados:

| Estado      | Descrição             |
| ----------- | --------------------- |
| `pending`   | Aguardando resolução  |
| `fulfilled` | Concluída com sucesso |
| `rejected`  | Falhou com erro       |

```javascript
const promessa = new Promise((resolve, reject) => {
    const sucesso = true;

    if (sucesso) {
        resolve("Operação concluída!");
    } else {
        reject("Algo deu errado.");
    }
});

promessa
    .then((resultado) => console.log(resultado))
    .catch((erro) => console.error(erro));
```

* `.then()` recebe o valor resolvido
* `.catch()` captura erros

Antes do `async/await`, era comum encadear vários `.then()`, o que podia deixar o código mais difícil de ler.

---

### `async` / `await`

`async/await` é uma sintaxe moderna que torna código assíncrono mais legível.

```javascript
// Uma função async sempre retorna uma Promise
async function buscarUsuario(id) {
    const resposta = await fetch(`https://api.exemplo.com/usuarios/${id}`);
    const dados = await resposta.json();

    return dados;
}
```

* `async` marca a função como assíncrona
* `await` pausa a execução da função até a Promise ser resolvida, sem bloquear o restante do programa

### Tratamento de erros com `try/catch`

```javascript
async function buscarUsuario(id) {
    try {
        const resposta = await fetch(`https://api.exemplo.com/usuarios/${id}`);

        if (!resposta.ok) {
            throw new Error(`Erro HTTP: ${resposta.status}`);
        }

        const dados = await resposta.json();

        console.log(dados);
    } catch (erro) {
        console.error("Falha ao buscar usuário:", erro.message);
    }
}

buscarUsuario(1);
```

> `await` só pode ser utilizado dentro de funções marcadas com `async` (ou em módulos com suporte a top-level await).

### Exemplo prático com a Fetch API

```javascript
async function buscarPiada() {
    try {
        const resposta = await fetch(
            "https://official-joke-api.appspot.com/random_joke"
        );

        const piada = await resposta.json();

        console.log(piada.setup);
        console.log(`👉 ${piada.punchline}`);
    } catch (erro) {
        console.error("Não foi possível buscar a piada:", erro.message);
    }
}

buscarPiada();
```

### Executando Promises em paralelo

Quando várias operações são independentes, use `Promise.all` para executá-las simultaneamente:

```javascript
async function buscarDados() {
    const [usuarios, produtos] = await Promise.all([
        fetch("/api/usuarios").then((r) => r.json()),
        fetch("/api/produtos").then((r) => r.json()),
    ]);

    console.log(usuarios, produtos);
}
```

> [!TIP]
> Se qualquer Promise falhar, `Promise.all` rejeita imediatamente. Se você quiser obter todos os resultados mesmo com falhas parciais, use `Promise.allSettled()`.

---

## Recursos recomendados

* [MDN Web Docs](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript) — documentação oficial e extremamente completa
* [javascript.info](https://javascript.info) — tutorial moderno e detalhado
* Console do navegador (`F12`) — excelente para experimentar código rapidamente
