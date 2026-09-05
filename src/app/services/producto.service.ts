import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Producto } from '../models/producto';

@Injectable({ providedIn: 'root' })
export class ProductoService {
  private productos: Producto[] = [];

  registrarProducto(producto: Producto): Observable<Producto> {
    this.productos.push({ ...producto });
    return of({ ...producto }).pipe(
      delay(1000),
      tap((registrado) => console.log('Producto registrado en el backend:', registrado))
    );
  }

  obtenerProductos(): Producto[] {
    return this.productos;
  }
}