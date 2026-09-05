import { Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio';
import { RegistroProductoComponent } from './pages/registro-producto/registro-producto';
import { ListadoProductosComponent } from './pages/listado-productos/listado-productos';

export const routes: Routes = [
  { path: '', component: InicioComponent },
  { path: 'registro', component: RegistroProductoComponent },
  { path: 'listado', component: ListadoProductosComponent },
  { path: '**', redirectTo: '' },
];