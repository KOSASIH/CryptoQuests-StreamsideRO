const path = require('path')
const fs = require('fs')
const { execSync } = require('child_process')

const config = require('../config/app.config')

// Clean up the `dist` directory
execSync(`rm -rf ${path.join(__dirname, '..', 'dist')}`, { stdio: 'inherit' })

// Copy the `public` directory to the `dist` directory
execSync(`cp -R ${config.appStaticDir} ${path.join(__dirname, '..', 'dist')}`, {
  stdio: 'inherit'
})

// Build the TypeScript code
execSync('tsc', { stdio: 'inherit' })

// Copy the built TypeScript code to the `dist` directory
execSync(
  `cp -R ${path.join(__dirname, '..', 'src')} ${path.join(__dirname, '..', 'dist')}`,
  { stdio: 'inherit' }
)

// Generate the `index.html` file
const indexHtml = fs.readFileSync(
  path.join(__dirname, '..', 'public', 'index.html'),
  'utf8'
)
const indexHtmlBuilt = indexHtml.replace(
  '<script src="/main.js"></script>',
  '<script src="/dist/main.js"></script>'
)
fs.writeFileSync(
  path.join(__dirname, '..', 'dist', 'index.html'),
  indexHtmlBuilt
)

console.log('Build completed successfully')
