# Límites de Transcripción - Web Speech API

## Problema Identificado
La Web Speech API tiene limitaciones inherentes que causan cortes en la transcripción:

### Límites Técnicos
1. **Tiempo máximo por sesión**: ~60 segundos
2. **Pausa de silencio**: ~3-5 segundos corta la sesión
3. **Límite de caracteres**: Varía por navegador
4. **Reinicio automático**: Necesario para transcripción larga

## Soluciones Implementadas

### 1. Reinicio Automático
- Detección de `onend` event
- Reinicio automático cada 500ms
- Preservación del texto acumulado

### 2. Separación de Texto
- **Final**: Texto confirmado (azul)
- **Interim**: Texto temporal (gris, cursiva)
- Formato: `textoFinal|textoInterim`

### 3. Acumulación de Texto
- Mantiene todo el texto previo
- Solo agrega nuevos segmentos al historial
- Evita duplicación de contenido

### 4. Configuración Optimizada
```typescript
continuous: true        // Transcripción continua
interimResults: true   // Resultados temporales
lang: 'es-ES'         // Idioma español
maxAlternatives: 1    // Una alternativa
```

## Limitaciones Conocidas

### Por Navegador
- **Chrome**: Mejor soporte, límite ~60s
- **Edge**: Similar a Chrome
- **Safari**: Limitado, puede fallar
- **Firefox**: No soportado

### Por Sistema
- **Conexión**: Requiere internet (API en la nube)
- **Micrófono**: Calidad afecta precisión
- **Ruido**: Ambiente silencioso recomendado

## Recomendaciones de Uso

### Para Transcripciones Largas
1. Hablar en segmentos de 30-45 segundos
2. Hacer pausas breves (1-2 segundos)
3. Evitar silencios largos (>3 segundos)
4. Usar palabra "stop" para finalizar

### Para Mejor Precisión
1. Hablar claramente y despacio
2. Usar micrófono de calidad
3. Ambiente sin ruido de fondo
4. Pronunciar bien las palabras

## Alternativas para Transcripciones Largas
1. **Dividir en sesiones**: Múltiples grabaciones cortas
2. **Servicios externos**: Google Cloud Speech, AWS Transcribe
3. **Aplicaciones nativas**: Mejor para uso intensivo
4. **Grabación + transcripción**: Grabar audio y procesar después