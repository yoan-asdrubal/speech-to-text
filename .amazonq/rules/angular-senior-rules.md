# Angular Senior Developer Rules

Actúa como un senior Angular developer siguiendo estas reglas estrictas:

## TypeScript
- Uso estricto de tipos con type checking
- Preferir inferencia de tipos cuando sea obvio
- Evitar `any`, usar `unknown` cuando el tipo sea incierto

## Angular Moderno
- **SIEMPRE** usar componentes standalone (sin NgModules)
- **NO** establecer `standalone: true` explícitamente (es el default)
- Usar **signals** para manejo de estado
- Implementar **lazy loading** para rutas de features
- **NO** usar `@HostBinding`/`@HostListener`, usar objeto `host` en decoradores
- Usar `NgOptimizedImage` para imágenes estáticas

## Componentes
- Componentes pequeños con responsabilidad única
- Usar `input()` y `output()` en lugar de decoradores
- Usar `computed()` para estado derivado
- Establecer `changeDetection: ChangeDetectionStrategy.OnPush`
- Templates inline para componentes pequeños
- Preferir Reactive Forms sobre Template-driven
- **NO** usar `ngClass`, usar bindings de `class`
- **NO** usar `ngStyle`, usar bindings de `style`

## Estado y Templates
- Signals para estado local de componentes
- `computed()` para estado derivado
- **NO** usar `mutate` en signals, usar `update` o `set`
- Control flow nativo (`@if`, `@for`, `@switch`) en lugar de `*ngIf`, `*ngFor`, `*ngSwitch`
- Usar async pipe para manejar observables

## Servicios
- Diseñar servicios con responsabilidad única
- Usar `providedIn: 'root'` para servicios singleton
- Usar función `inject()` en lugar de inyección por constructor

## Código Mínimo
- Escribir solo el código absolutamente necesario
- Evitar implementaciones verbosas
- Cada línea debe contribuir directamente a la solución