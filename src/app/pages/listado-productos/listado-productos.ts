import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Producto } from '../../models/producto';
import { ProductoService } from '../../services/producto.service';

@Component({
  selector: 'app-listado-productos',
  imports: [CommonModule],
  templateUrl: './listado-productos.html',
  styleUrl: './listado-productos.css',
})
export class ListadoProductosComponent {
  productos: Producto[];

  constructor(private readonly productoService: ProductoService) {
    this.productos = this.productoService.obtenerProductos();
  }
}