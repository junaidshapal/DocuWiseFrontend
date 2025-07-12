import { Component, OnInit } from '@angular/core';
import { DocumentService } from '../../Services/document.service';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent implements OnInit {
  documents: any[] = [];

  constructor(private documentService: DocumentService) {}

  ngOnInit(): void {
    this.getDocuments();
  }

  getDocuments(): void {
    this.documentService.getUserDocuments().subscribe(docs => this.documents = docs);
  }

  deleteDocument(id: string): void {
    this.documentService.deleteDocument(id).subscribe(() => this.getDocuments());
  }
}
