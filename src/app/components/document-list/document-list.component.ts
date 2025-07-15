import { Component, OnInit } from '@angular/core';
import { DocumentService } from '../../Services/document.service';
import { FavoriteService } from '../../Services/favorite.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css'],
})
export class DocumentListComponent implements OnInit {
  documents: any[] = [];
  filteredDocuments: any[] = [];
  searchTerm: string = '';

  constructor(
    private documentService: DocumentService,
    private favoriteService: FavoriteService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getDocuments();
  }

  getDocuments(): void {
    this.documentService.getUserDocuments().subscribe((docs) => {
      this.documents = docs;
      this.filteredDocuments = docs;
    });
  }

  onSearchChange(): void {
    const query = this.searchTerm.trim().toLowerCase();
    this.filteredDocuments = this.documents.filter((doc) =>
      doc.title.toLowerCase().includes(query) ||
      (doc.category && doc.category.toLowerCase().includes(query))
    );
  }

  deleteDocument(id: string): void {
    this.documentService.deleteDocument(id).subscribe(() => this.getDocuments());
  }

  openDetail(docId: string): void {
    this.router.navigate(['/documents', docId]);
  }
}
