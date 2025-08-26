# Actualizar Aplicación en GitHub Pages

## Comandos para Nuevos Cambios

### Opción 1: Un Solo Comando
```bash
npm run deploy
```

### Opción 2: Paso a Paso
```bash
# 1. Build de producción
npm run build -- --configuration production --base-href "https://yoan-asdrubal.github.io/speech-to-text/"

# 2. Deploy a GitHub Pages
npx gh-pages -d dist/speech-app/browser
```

### Opción 3: Con Git (Opcional)
```bash
# 1. Commit cambios
git add .
git commit -m "Update: descripción de cambios"
git push origin master

# 2. Deploy
npm run deploy
```

## Tiempo de Actualización
- **Deploy:** Inmediato
- **GitHub Pages:** 2-5 minutos
- **Cache navegador:** Ctrl+F5 para forzar actualización

## Verificar Deploy
https://yoan-asdrubal.github.io/speech-to-text/