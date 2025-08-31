import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocumentUploadComponent } from './components/document-upload/document-upload.component';
import { DocumentListComponent } from './components/document-list/document-list.component';
import { AuthGuard } from './core/auth.guard';
import { FavoriteDocumentsComponent } from './components/favorite-documents/favorite-documents.component';
import { DocumentDetailComponent } from './components/document-detail/document-detail.component';
import { ManageProfileComponent } from './components/manage-profile/manage-profile.component';

const routes: Routes = [
  { path: '', redirectTo: 'documents', pathMatch: 'full' },
  { path: 'documents', component: DocumentListComponent, canActivate: [AuthGuard] },
  { path: 'upload', component: DocumentUploadComponent, canActivate: [AuthGuard] },
  {
    path: '',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  { path: 'favorites', component: FavoriteDocumentsComponent, canActivate: [AuthGuard] },
  { path: 'documents/:id', component: DocumentDetailComponent, canActivate: [AuthGuard] },
  { path: 'manage', component: ManageProfileComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'documents' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
