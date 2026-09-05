import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Producto } from '../../models/producto';
import { ProductoService } from '../../services/producto.service';

const MENSAJES_ERROR: Record<string, Record<string, string>> = {
  nombre: {
    required: 'El nombre es obligatorio.',
    minlength: 'El nombre debe tener al menos {min} caracteres.',
  },
  descripcion: {
    required: 'La descripción es obligatoria.',
    minlength: 'La descripción debe tener al menos {min} caracteres.',
  },
  precio: {
    required: 'El precio es obligatorio.',
    min: 'El precio debe ser mayor a 0.01.',
  },
  categoria: {
    required: 'La categoría es obligatoria.',
  },
  stock: {
    required: 'El stock es obligatorio.',
    min: 'El stock no puede ser negativo.',
  },
};

const ETIQUETAS: Record<string, string> = {
  nombre: 'Nombre',
  descripcion: 'Descripción',
  precio: 'Precio',
  categoria: 'Categoría',
  stock: 'Stock',
};

@Component({
  selector: 'app-registro-producto',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registro-producto.html',
  styleUrl: './registro-producto.css',
})
export class RegistroProductoComponent implements OnInit {
  form!: FormGroup;
  formEnviado = false;
  registrando = false;
  registrado = false;
  resumenErrores: string[] = [];

  constructor(
    private readonly fb: FormBuilder,
    private readonly productoService: ProductoService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      precio: [null, [Validators.required, Validators.min(0.01)]],
      categoria: ['', [Validators.required]],
      stock: [null, [Validators.required, Validators.min(0)]],
    });
  }

  obtenerErrores(nombreControl: string): string[] {
    const control = this.form.get(nombreControl);
    const configuracion = MENSAJES_ERROR[nombreControl];
    const errores: string[] = [];
    if (!control || !configuracion) {
      return errores;
    }
    if (control.hasError('required') && configuracion['required']) {
      errores.push(configuracion['required']);
    }
    if (control.hasError('minlength') && configuracion['minlength']) {
      const requerida = (control.getError('minlength') as { requiredLength: number })
        .requiredLength;
      errores.push(configuracion['minlength'].replace('{min}', String(requerida)));
    }
    if (control.hasError('min') && configuracion['min']) {
      errores.push(configuracion['min']);
    }
    return errores;
  }

  esInvalido(nombreControl: string): boolean {
    const control = this.form.get(nombreControl);
    return !!(control?.invalid && (control.touched || control.dirty));
  }

  onSubmit(): void {
    this.formEnviado = true;
    this.resumenErrores = [];

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.generarResumenErrores();
      return;
    }

    this.registrando = true;
    const producto: Producto = this.form.value;
    this.productoService.registrarProducto(producto).subscribe({
      next: () => {
        this.registrando = false;
        this.registrado = true;
        this.form.reset();
        this.formEnviado = false;
        this.resumenErrores = [];
      },
      error: () => {
        this.registrando = false;
        this.registrado = false;
      },
    });
  }

  private generarResumenErrores(): void {
    this.resumenErrores = [];
    for (const nombreControl of Object.keys(MENSAJES_ERROR)) {
      const etiqueta = ETIQUETAS[nombreControl];
      for (const mensaje of this.obtenerErrores(nombreControl)) {
        this.resumenErrores.push(`${etiqueta}: ${mensaje}`);
      }
    }
  }
}