
//Routes for components and are protected
const routes: Routes = [
  { path: '', redirectTo: 'documents', pathMatch: 'full' },
  { path: 'documents', component: DocumentListComponent, canActivate: [AuthGuard] },
  { path: 'upload', component: DocumentUploadComponent, canActivate: [AuthGuard] },
  {
    //child route for AuthModule
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
