# RegistroProductos

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 22.1.4.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## Documentación del flujo

### Rutas y navegación
- `app.routes.ts` define las rutas: `/` (Inicio), `/registro` (Registro de Productos), `/listado` (Listado de Productos) y un redirect para rutas desconocidas (`**`).
- `MenuComponent` (navbar) usa `routerLink` para los enlaces y `routerLinkActive="active"` para resaltar la ruta activa.

### Formulario reactivo
- `RegistroProductoComponent` construye un `FormGroup` con `FormBuilder` (`FormBuilder`) y `ReactiveFormsModule`.
- Controles y validadores:
  - `nombre`: `required`, `minLength(3)`
  - `descripcion`: `required`, `minLength(10)`
  - `precio`: `required`, `min(0.01)`
  - `categoria`: `required`
  - `stock`: `required`, `min(0)`

### Mensajes de error con *ngIf / *ngFor
- Cada control expone un getter (`erroresNombre`, `erroresDescripcion`, etc.) que devuelve un **arreglo de mensajes** según el error presente (`hasError`).
- En el template, `*ngIf` evalúa `invalid && (touched || dirty)` para decidir si mostrar errores, y `*ngFor` itera el arreglo de mensajes cuando un control tiene más de un error posible.
- Los campos con error reciben la clase condicional `is-invalid` mediante `[class.is-invalid]`.

### Envío del formulario
- `onSubmit()`: si el formulario es inválido, llama `markAllAsTouched()` para marcar todos los controles como tocados y construye y muestra un **resumen de errores** (`formEnviado && form.invalid`).
- Solo si el formulario es válido llama a `ProductoService.registrarProducto()`.

### Servicio
- `ProductoService` (`providedIn: 'root'`) guarda los productos en un arreglo en memoria durante la sesión.
- `registrarProducto(producto)` simula el envío al backend: devuelve un `Observable` de RxJS con `delay(1000)` y un `console.log` de confirmación.
- `obtenerProductos()` alimenta el `ListadoProductosComponent`, que los muestra en una tabla.
