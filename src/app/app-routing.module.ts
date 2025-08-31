import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocumentUploadComponent } from './components/document-upload/document-upload.component';
import { DocumentListComponent } from './components/document-list/document-list.component';
import { AuthGuard } from './core/auth.guard';
import { FavoriteDocumentsComponent } from './components/favorite-documents/favorite-documents.component';
import { DocumentDetailComponent } from './components/document-detail/document-detail.component';
import { ManageProfileComponent } from './components/manage-profile/manage-profile.component';



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
