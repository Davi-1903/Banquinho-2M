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

function walk(dir, filelist = []) {
  const files = fs.readdirSync(dir)

  files.forEach(file => {
    const filepath = path.join(dir, file)
    
    if (ignoreList.includes(file)) {
      return // pula o item se estiver na lista de ignorados
    }

    const stats = fs.statSync(filepath)
    // normaliza para usar barras '/'
    const relativePath = path.relative(rootDir, filepath).replace(/\\/g, '/') 

    if (stats.isDirectory()) {
      filelist.push({ path: relativePath, type: 'dir' })
      walk(filepath, filelist)
    } else {
      filelist.push({ path: relativePath, type: 'file' })
    }
  })
  console.log('yaml workflow github actions pesquisar sobre')
  console.log('ver se tem como ou implementar esse arquivo direto no index.html ou incluir na função de init no main.js')
  console.log('gerando no terminal: node generate-manifest.js')
  return filelist
}

const fileManifest = walk(rootDir)
fs.writeFileSync(outputFile, JSON.stringify(fileManifest, null, 2))

console.log(`Manifesto gerado com sucesso em "${outputFile}" com ${fileManifest.length} itens.`)