import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProductoService } from '../../services/producto.service';

@Component({
  selector: 'app-inicio',
  imports: [CommonModule, RouterModule],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class InicioComponent {
  constructor(private readonly productoService: ProductoService) {}

  get totalProductos(): number {
    return this.productoService.obtenerProductos().length;
  }
}