import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DocumentService } from '../../Services/document.service';
import { FavoriteService } from '../../Services/favorite.service';
import { ToastrService } from 'ngx-toastr';
import html2pdf from 'html2pdf.js';

@Component({
  selector: 'app-document-detail',
  templateUrl: './document-detail.component.html',
  styleUrls: ['./document-detail.component.css']
})
export class DocumentDetailComponent implements OnInit {
@ViewChild('pdfContent', { static: false }) pdfContent!: ElementRef;

  document: any;
  isFavorited: boolean = false;
  selectedKeyword: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private documentService: DocumentService,
    private favoriteService: FavoriteService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const docId = this.route.snapshot.paramMap.get('id');
    if (docId) {
      this.loadDocument(docId);
    }
  }

  loadDocument(id: string) {
    this.documentService.getDocumentById(id).subscribe(doc => {
      this.document = doc;

        this.favoriteService.isFavorite(Number(doc.id)).subscribe(res => {
        this.isFavorited = res;
      });
    });
  }

  toggleFavorite(): void {
  if (!this.document) return;

  if (this.isFavorited) {
    this.favoriteService.removeFavorite(this.document.id).subscribe({
      next: () => {
        this.isFavorited = false;
        this.toastr.success('Document removed from favorites', 'Success');
      },
      error: (err) => {
        console.error('Failed to remove favorite:', err);
        this.toastr.error('Failed to remove document from favorites', 'Error');
      }
    });
  } else {
    this.favoriteService.addFavorite(this.document.id).subscribe({
      next: () => {
        this.isFavorited = true;
        this.toastr.success('Document added to favorites', 'Success');
      },
      error: (err) => {
        console.error('Failed to add favorite:', err);
        this.toastr.error('Failed to add document to favorites', 'Error');
      }
    });
  }
}


  highlightKeyword(text: string, keyword: string): string {
    const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'gi');
    return text.replace(regex, `<span class="bg-yellow-200 font-semibold">$1</span>`);
  }

  getHighlightedSummary(): string {
    if (this.selectedKeyword && this.document?.summary) {
      return this.highlightKeyword(this.document.summary, this.selectedKeyword);
    }
    return this.document?.summary || '';
  }

  keywordClicked(keyword: string): void {
    this.selectedKeyword = keyword;
  }

  getKeywordColor(index: number): string {
    const colors = ['bg-blue-100', 'bg-green-100', 'bg-pink-100', 'bg-red-100', 'bg-purple-100', 'bg-yellow-100'];
    return colors[index % colors.length];
  }

 downloadPDF() {
  if (!this.document) return;

  setTimeout(() => {
    import('html2pdf.js').then((html2pdf: any) => {
      if (!this.pdfContent || !this.pdfContent.nativeElement) {
        console.error('PDF content not found');
        return;
      }

      const element = this.pdfContent.nativeElement;
      const options = {
        margin: 0.5,
        filename: `${this.document.title || 'summary'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
      };

      html2pdf.default().from(element).set(options).save();
    });
  }, 0);
}

}
