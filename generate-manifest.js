const fs = require('fs')
const path = require('path')

const rootDir = '.' // Começa do diretório atual
const outputFile = 'manifest.json'

// Lista de arquivos e pastas a serem ignorados
const ignoreList = [
  '.git',
  '.github', // Adicionado para ignorar a pasta do Actions
  'node_modules',
  'manifest.json',       // Ignora o próprio arquivo de manifesto
  'generate-manifest.js', // Ignora este script
  'index.html'           // Ignora o explorador
]

function walk(dir) {
  const items = [];
  const files = fs.readdirSync(dir, { withFileTypes: true });

  for (const file of files) {
    const name = file.name;

    // Ignora arquivos/pastas indesejadas
    if (ignoreList.includes(name)) continue;

    const filePath = path.join(dir, name);
    const relativePath = path.relative(rootDir, filePath).replace(/\\/g, "/");

    if (file.isDirectory()) {
      items.push({ path: relativePath, type: "dir" });
      items.push(...walk(filePath));
    } else {
      items.push({ path: relativePath, type: "file" });
    }
  }

  return items;
}

  // Para atualizar a lista manifest.json, caso o workflow do github não esteja
  // funcionando, basta digitar no terminal "node generate-manifest.js" e a lista
  // atualizará. Dê commit nas atualizações do manifesto.

function generateManifest() {
  const fileManifest = walk(rootDir);

  // Sobrescreve o manifest.json (ajuda na remoção de arquivos antigos)
  // Não impacta na performance. Pesquisei e parece que só impactaria se o repo fosse absurdamente grande.
  // Como não é o nosso caso, preferi deixar com que sobrescreva toda vez que for gerar o manifesto, que não leva nem 1s.
  fs.writeFileSync(outputFile, JSON.stringify(fileManifest, null, 2), "utf-8");

  console.log(
    `✅ Manifesto gerado com sucesso em "${outputFile}" com ${fileManifest.length} itens.`
  );
}

// Executa o script
generateManifest();