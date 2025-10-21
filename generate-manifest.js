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
  
  // Para atualizar a lista manifest.json, caso o workflow do github não esteja
  // funcionando, basta digitar no terminal "node generate-manifest.js" e a lista
  // atualizará. Dê commit nas atualizações do manifesto.

  return filelist
}

function filterExistingItems(previousManifest) {
  return previousManifest.filter(item => {
    try {
      fs.accessSync(item.path)
      return true
    } catch (error) {
      console.log(`Removendo item inexistente: ${item.path}`)
      return false
    }
  })

}

let previousManifest = []
try {
  if (fs.existsSync(outputFile)) {
    previousManifest = JSON.parse(fs.readFileSync(outputFile, 'utf-8'))
    console.log('Manifest anterior carregado.')
  }
} catch (error) {
  console.log('Não foi possível carregar o manifest anterior. Gerando novo.')
}

const newFileManifest = walk(rootDir)

const existingPreviousItems = filterExistingItems(previousManifest)
const combinedManifest = [...existingPreviousItems]
const existingPaths = new Set(existingPreviousItems.map(item => item.path))

newFileManifest.forEach(item => {
  if (!existingPaths.has(item.path)) {
    combinedManifest.push(item)
    existingPaths.add(item.path)
  }
})

combinedManifest.sort((a, b) => {
  if (a.type === 'dir' && b.type === 'file') return -1
  if (a.type === 'file' && b.type === 'dir') return 1
  return a.path.localeCompare(b.path)
})

fs.writeFileSync(outputFile, JSON.stringify(combinedManifest, null, 2))

console.log(`Manifesto gerado com sucesso em "${outputFile}" com ${combinedManifest.length} itens.`)
console.log(`Itens removidos: ${previousManifest.length - existingPreviousItems.length}`)