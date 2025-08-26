# Despliegue en GitHub Pages

## Pasos para Desplegar

### 1. Configurar Angular para GitHub Pages
```bash
ng build --base-href "https://yoan-asdrubal.github.io/speech-to-text/"
```

### 2. Instalar gh-pages (opcional)
```bash
npm install --save-dev gh-pages
```

### 3. Agregar script en package.json
```json
{
  "scripts": {
    "deploy": "ng build --base-href 'https://yoan-asdrubal.github.io/speech-to-text/' && npx gh-pages -d dist/speech-app"
  }
}
```

### 4. Comandos de Despliegue
```bash
# Opción 1: Con gh-pages
npm run deploy

# Opción 2: Manual
git subtree push --prefix dist/speech-app origin gh-pages
```

### 5. Configurar GitHub Pages
1. Ir a Settings → Pages en GitHub
2. Source: Deploy from a branch
3. Branch: gh-pages
4. Folder: / (root)

### 6. Comandos Completos
```bash
# Build para producción
ng build --configuration production --base-href "https://yoan-asdrubal.github.io/speech-to-text/"

# Push al repositorio
git push origin master

# Desplegar a gh-pages
npx gh-pages -d dist/speech-app
```

## Consideraciones Importantes

### HTTPS Requerido
- GitHub Pages usa HTTPS automáticamente
- Web Speech API requiere HTTPS
- ✅ Compatible con GitHub Pages

### Permisos de Micrófono
- El navegador solicitará permisos
- Solo funciona en dominios seguros (HTTPS)
- GitHub Pages cumple este requisito

### Compatibilidad
- ✅ Chrome/Edge: Funciona completamente
- ⚠️ Safari: Limitado
- ❌ Firefox: No soportado

## URL Final
https://yoan-asdrubal.github.io/speech-to-text/