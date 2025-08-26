# Estrategia Speech-to-Text con Historial

## Objetivo
Crear aplicación Angular desde cero para transcripción de voz con historial y auto-copia al clipboard.

## Fase 1: Configuración del Proyecto

### Requerimientos:
- Crear nuevo proyecto Angular en directorio actual
- Configurar Angular con versión más reciente
- Instalar dependencias necesarias para speech recognition

### Reglas:
- Usar Angular CLI para scaffolding
- Configurar standalone application (sin NgModules)
- Instalar @ng-web-apis/speech y @ng-web-apis/common

## Fase 2: Service de Speech Recognition

### Requerimientos:
- Crear service que maneje el estado de transcripción
- Implementar historial de transcripciones por párrafos
- Manejar estado de escucha (activo/inactivo)
- Auto-copia solo de transcripción actual al clipboard

### Reglas Angular Senior:
- Usar signals para todo el estado reactivo
- Implementar con inject() en lugar de constructor injection
- Usar toSignal() para convertir observables de la librería
- Aplicar computed() para estado derivado
- Definir interface TypeScript para estructura de datos
- Usar providedIn: 'root' para singleton

### Definiciones de Datos:
- TranscriptEntry: id, text, timestamp, confidence
- Estados: history[], isListening, currentTranscript, currentText

## Fase 3: Componente de UI

### Requerimientos:
- Crear componente standalone para interfaz de usuario
- Mostrar historial de transcripciones con timestamps
- Botones de control (iniciar/detener, limpiar)
- Visualización en tiempo real de transcripción actual
- Indicadores visuales de estado

### Reglas Angular Senior:
- Componente standalone (sin imports de NgModules)
- ChangeDetectionStrategy.OnPush
- Control flow nativo (@if, @for) en lugar de *ngIf, *ngFor
- Class bindings en lugar de ngClass
- Template inline para componente pequeño
- Usar input() y output() si necesario

### Definiciones de UX:
- Historial scrolleable con altura máxima
- Timestamps en formato HH:mm:ss
- Porcentaje de confianza visible
- Estado visual diferenciado para "escuchando"
- Transcripción actual destacada visualmente

## Fase 4: Configuración de Providers

### Requerimientos:
- Configurar providers necesarios para la librería legacy
- Integrar con bootstrap de aplicación standalone
- Asegurar compatibilidad entre NgModules legacy y standalone

### Reglas:
- Usar importProvidersFrom() para NgModules legacy
- Configurar en main.ts con bootstrapApplication
- Mantener arquitectura standalone en toda la app

## Fase 5: Integración y Testing

### Requerimientos:
- Integrar todos los componentes
- Verificar funcionalidad de auto-copia
- Validar comportamiento del historial
- Asegurar compatibilidad con navegadores

### Reglas:
- Manejar errores de permisos de micrófono
- Validar soporte de Web Speech API
- Implementar fallbacks para funcionalidades no soportadas

## Consideraciones Técnicas

### Compatibilidad:
- Web Speech API solo funciona en Chrome/Edge
- Requiere HTTPS en producción
- Necesita permisos de micrófono

### Performance:
- OnPush change detection
- Signals para reactividad eficiente
- Lazy loading si se expande la aplicación

### Accesibilidad:
- Indicadores visuales claros
- Botones con labels descriptivos
- Contraste adecuado en estados