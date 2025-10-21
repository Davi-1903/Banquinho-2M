# Funções no MySQL
## O que é uma função?
Função é um bloco de código que aceita parâmetros para executar uma tarefa específica e retornar um valor. No MySQL, as funções criadas por usuários são chamadas de User-Defined Function (UDF). Nesta wiki, você terá acesso a sintaxe das funções e exemplos.

## Sintaxe

```sql
DELIMITER $$
CREATE FUNCTION nomeDaFuncao(parametro1 TYPE, parametro2 TYPE)
RETURNS TYPE
[NOT] DETERMINISTIC
BEGIN
    [DECLARE variavel TYPE];
    [BLOCO DE CÓDIGO];
	[RETURN variavel];
END;
$$
```
### Explicação  
Vamos entender, linha por linha, o que cada palavra faz na criação da função:  

`DELIMITER`: O delimiter funciona como um sinalizador para que o MySQL termine um comando apenas quando ler o limitador imposto por ele. Por exemplo, no bloco de código acima o delimiter é `$$`. Logo, ele vai parar de executar o código quando encontrar `$$` novamente. Isso serve para funções que possuam mais de uma linha.
> [!IMPORTANT]
> Você pode definir qualquer caractere como um delimiter. Os mais comuns são `\\` e `$$`.   

`CREATE FUNCTION nomeDaFuncao(parametro1 TYPE, parametro2 TYPE)`: O crate function é o comando utilizado para criar a função. Após ele, o usuário escolhe o nome da função e dá os parâmetros que serão utilizados (assim como a tipagem dele). Por exemplo, se meus parâmetros forem dois números inteiros, então colocarei `(numero1 INT, numero2 INT)`.

`RETURNS TYPE`: Aqui, o usuário precisa tipar qual o valor que será retornado pela função. Se o valor for um inteiro, então colocará `RETURNS INT`, se for float, colocará `RETURNS FLOAT`, e assim por diante.
> [!IMPORTANT]
> Não confunda o 'RETURNS' com 'RETURN'. A sintaxe fica errada e sua função dará erro.

`DETERMINISTIC / NOT DETERMINISTIC`: No bloco de códigos, o NOT está entre chaves para sinalizar que ele não é utilizado sempre. `DETERMINISTIC` significa que para os mesmos parâmetros, a função sempre vai retornar o mesmo valor. Por exemplo, em uma função que soma dois números, então 1 + 1 sempre será igual a 2. O `NOT DETERMINISTIC`, ao contrário, significa que nem sempre a função irá retornar o mesmo valor para o mesmo parâmetro. Por exemplo, se eu executar uma função que retorna a hora atual, ela não irá me retornar sempre a mesma hora.

`BEGIN`: Aqui é a sinalização de que o bloco de código da função irá começar. 

`DECLARE`: O usuário utiliza DECLARE para declarar variáveis que receberão valores no bloco de código da função. Essas variáveis precisam ter sua tipagem especificada.

`END`: Sinalização de que o bloco de códigos que compõe a função terminou. Em seguida, há o delimiter para limitar a execução.

## Como chamar uma função
Para chamar uma função, basta apenas fazer um `SELECT` e passar os parâmetros caso haja.
```sql
SELECT nomeDaFuncao();
SELECT nomeDaFuncao(Parametro1, Parametro2);
SELECT nomeDaFuncao() as Resultado;
```
> [!NOTE]
> Você pode definir um Alias para o resultado da função utilizando o `as`.

## Exemplos de funções
### Função de soma
```sql
DELIMITER //
CREATE FUNCTION soma (x INT, y INT)
RETURNS INT
DETERMINISTIC
BEGIN
	RETURN x + y;
END;
//

DELIMITER //
SELECT soma(30,40) as resultado;
//
```
Essa função retorna a soma de dois parâmetros que são informados no `SELECT`. Perceba que ela é `DETERMINISTIC`, pois o valor retornado para os mesmos parâmetros sempre será o mesmo.

### Função de média aritmética
```sql
DELIMITER //
CREATE FUNCTION MediaAritmetica (nota1 float, nota2 float)
RETURNS FLOAT
DETERMINISTIC -- Sempre retorna o mesmo valor para os mesmos parâmetros
BEGIN
	RETURN (nota1 + nota2) / 2;
END;
//

DELIMITER //
SELECT MediaAritmetica(2,6) as Resultado;
//
```
Essa função retorna a média aritmética de dois parâmetros.

### Função de tempo atual
```sql
DELIMITER //
CREATE FUNCTION Agora()
RETURNS DATETIME
NOT DETERMINISTIC -- Retorna valores diferentes para cada parâmetro
BEGIN
	RETURN NOW();
END;
//

DELIMITER //
SELECT Agora() as Tempo_Atual;
//
```
Essa função retorna o horário atual de quando o usuário a executa. Observe que ela é ```NOT DETERMINISTIC```, pois toda vez que o usuário executar, ela retornará um valor diferente.

### Função de concatenação
```sql
DELIMITER //
CREATE FUNCTION Hello(s VARCHAR(60))
RETURNS VARCHAR(120)
DETERMINISTIC
BEGIN 
	RETURN CONCAT('Hello, ', s, '!');
END;
//

DELIMITER //
SELECT Hello('world') as saudacao;
//
```
Essa função utiliza a função `CONCAT` dentro de seu bloco de códigos para gerar um 'Hello, world!'. O usuário pode utilizar outras funções na criação de sua função própria.


### Função com mais de uma linha de código
> [!NOTE]
> Considere, para esse código, tabelas de alunos, notas e disciplinas. 
```sql
DELIMITER //
CREATE FUNCTION resumo_aluno(id_alu int, id_dis int)
RETURNS VARCHAR(100)
BEGIN
	DECLARE nome VARCHAR(20);
    DECLARE media FLOAT;

    SELECT alu_nome, avg(not_nota1, not_nota2) 
    INTO nome, media 
    FROM alunos
    JOIN notas 
		ON not_alu_id = alu_id
    WHERE alu_id = id_alu AND not_dis_id = id_dis;
    RETURN CONCAT("O aluno ", nome, " obteve a média ", media);
END;
//

SELECT resumo_aluno(1, 1);
```
Nessa função, as variáveis e seus respectivos tipos foram declaradas para que no bloco de código, fosse definido seus valores. 

Há duas maneiras de definir o valor de uma variável em função. O usuário pode utilizar como foi feito no exemplo acima, com um `SELECT coluna INTO nome_da_variavel FROM tabela`, ou pode ser feito da seguinte maneira:
```sql
    DECLARE nome VARCHAR(20);

    SET nome = (
	    SELECT alu_nome FROM alunos
         WHERE alu_id = id_alu
    );
```

O `SET` também atribui um valor a variável declarada.
