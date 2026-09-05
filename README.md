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
- Las plantillas de mensajes se centralizan en el objeto `MENSAJES_ERROR`, que mapea cada nombre de control a sus mensajes por tipo de error (`required`, `minlength`, `min`).
- El método genérico `obtenerErrores(nombreControl)` consulta ese mapa y el control del `FormGroup` (`hasError`) para devolver el **arreglo de mensajes** de ese campo.
- En el template, `*ngIf` evalúa `invalid && (touched || dirty)` para decidir si mostrar errores, y `*ngFor` itera el arreglo devuelto por `obtenerErrores('nombre')`, `obtenerErrores('precio')`, etc., cuando un control tiene más de un error posible.
- Los campos con error reciben la clase condicional `is-invalid` mediante `[class.is-invalid]`.

### Envío del formulario
- `onSubmit()`: si el formulario es inválido, llama `markAllAsTouched()` para marcar todos los controles como tocados y construye y muestra un **resumen de errores** (`formEnviado && form.invalid`).
- Solo si el formulario es válido llama a `ProductoService.registrarProducto()`.

### Servicio
- `ProductoService` (`providedIn: 'root'`) guarda los productos en un arreglo en memoria durante la sesión.
- `registrarProducto(producto)` simula el envío al backend: devuelve un `Observable` de RxJS con `delay(1000)` y un `console.log` de confirmación.
- `obtenerProductos()` alimenta el `ListadoProductosComponent`, que los muestra en una tabla.

## Pruebas realizadas

Cuando se hace clic en "Registrar producto" sin haber tocado ningún campo, la validación se dispara por completo: los cinco controles se marcan como tocados y cada uno muestra su aviso de campo obligatorio (nombre, descripción, precio, categoría y stock). También se despliega el bloque de resumen con la lista punto por punto. El observable del servicio nunca se dispara, así que no hay fila nueva en el listado ni mensaje en la consola; en otras palabras, un formulario vacío no llega al backend simulado.

Introducir un precio en cero o negativo combinado con un stock negativo deja el formulario en rojo de inmediato. El control de precio exhibe "El precio debe ser mayor a 0.01" y el de stock "El stock no puede ser negativo", y aunque el resto de campos esté correcto, el envío queda bloqueado y el resumen de errores vuelve a aparecer al intentarlo. El producto, por supuesto, no se guarda.

Con un nombre abreviado a dos letras y una descripción corta (menos de diez caracteres), el formulario reclama la longitud mínima exacta de cada uno: "El nombre debe tener al menos 3 caracteres" para el primero y "La descripción debe tener al menos 10 caracteres" para el segundo. Ocurre lo que cabía esperar: ambos mensajes aparecen en sus respectivos campos y, al tratar de enviar, la validación impide pasar; el sistema se comporta igual de estricto que en los casos anteriores con respecto al resumen de errores.

El último caso, con todos los datos válidos, es el único que llega hasta el servicio. El formulario pasa la validación sin obstáculos, `registrarProducto()` se ejecuta y, tras el retardo simulado de un segundo, la interfaz confirma el registro, el formulario vuelve a quedar limpio y en la consola del navegador aparece la confirmación "Producto registrado en el backend". Para rematar la verificación se navegó al listado y el producto apareció en la tabla con todos sus datos; además, la pantalla de inicio actualizó el contador de productos registrados en la sesión.
