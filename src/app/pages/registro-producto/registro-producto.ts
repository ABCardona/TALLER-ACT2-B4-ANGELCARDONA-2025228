import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Producto } from '../../models/producto';
import { ProductoService } from '../../services/producto.service';

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

  get erroresNombre(): string[] {
    const errores: string[] = [];
    const control = this.form.get('nombre');
    if (control?.hasError('required')) {
      errores.push('El nombre es obligatorio.');
    }
    if (control?.hasError('minlength')) {
      const min = control.getError('minlength').requiredLength as number;
      errores.push(`El nombre debe tener al menos ${min} caracteres.`);
    }
    return errores;
  }

  get erroresDescripcion(): string[] {
    const errores: string[] = [];
    const control = this.form.get('descripcion');
    if (control?.hasError('required')) {
      errores.push('La descripción es obligatoria.');
    }
    if (control?.hasError('minlength')) {
      const min = control.getError('minlength').requiredLength as number;
      errores.push(`La descripción debe tener al menos ${min} caracteres.`);
    }
    return errores;
  }

  get erroresPrecio(): string[] {
    const errores: string[] = [];
    const control = this.form.get('precio');
    if (control?.hasError('required')) {
      errores.push('El precio es obligatorio.');
    }
    if (control?.hasError('min')) {
      errores.push('El precio debe ser mayor a 0.01.');
    }
    return errores;
  }

  get erroresCategoria(): string[] {
    const errores: string[] = [];
    const control = this.form.get('categoria');
    if (control?.hasError('required')) {
      errores.push('La categoría es obligatoria.');
    }
    return errores;
  }

  get erroresStock(): string[] {
    const errores: string[] = [];
    const control = this.form.get('stock');
    if (control?.hasError('required')) {
      errores.push('El stock es obligatorio.');
    }
    if (control?.hasError('min')) {
      errores.push('El stock no puede ser negativo.');
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
    this.resumenErrores = [
      ...this.erroresNombre.map((mensaje) => `Nombre: ${mensaje}`),
      ...this.erroresDescripcion.map((mensaje) => `Descripción: ${mensaje}`),
      ...this.erroresPrecio.map((mensaje) => `Precio: ${mensaje}`),
      ...this.erroresCategoria.map((mensaje) => `Categoría: ${mensaje}`),
      ...this.erroresStock.map((mensaje) => `Stock: ${mensaje}`),
    ];
  }
}