import { Component, OnInit } from '@angular/core';
import { DocumentService } from '../../Services/document.service';
import { FavoriteService } from '../../Services/favorite.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css'],
})
export class DocumentListComponent implements OnInit {
  documents: any[] = [];
  filteredDocuments: any[] = [];
  searchTerm: string = '';

  // favorites state
  favoriteIds = new Set<string>();
  toggling = new Set<string>(); // prevent double clicks while API in-flight
  loadingFavorites = false;

  constructor(
    private documentService: DocumentService,
    private favoriteService: FavoriteService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    console.log('[DocumentList] ngOnInit');
    this.getDocuments();
  }


  toKey(id: any): string {
  return id != null ? String(id) : '';
}

  getDocuments(): void {
    console.log('[DocumentList] getDocuments -> fetching user docs...');
    this.documentService.getUserDocuments().subscribe({
      next: (docs) => {
        console.log('[DocumentList] getDocuments -> received', docs?.length, 'docs');
        this.documents = docs;
        this.filteredDocuments = docs;
        this.loadFavoriteStatus();
      },
      error: (err) => {
        console.error('[DocumentList] getDocuments -> error', err);
      },
    });
  }

  loadFavoriteStatus(): void {
    if (!this.documents?.length) {
      console.log('[DocumentList] loadFavoriteStatus -> no documents, skipping');
      return;
    }
    this.loadingFavorites = true;
    console.log('[DocumentList] loadFavoriteStatus -> start');

    this.favoriteService.getFavorites().subscribe({
      next: (items) => {
        console.log('[DocumentList] getFavorites -> raw response:', items);
        const incoming = new Set<string>();

        // Try to be flexible about shape: [id] OR [{documentId}] OR [{docId}] OR [{id}]
        for (const it of items || []) {
          const candidate = (it?.documentId ?? it?.docId ?? it?.id ?? it);
          if (candidate !== undefined && candidate !== null) {
            incoming.add(String(candidate));
          }
        }

        if (incoming.size > 0) {
          console.log('[DocumentList] favorites mapped from list:', Array.from(incoming));
          this.favoriteIds = incoming;
          this.loadingFavorites = false;
        } else {
          console.log('[DocumentList] favorites list empty/unknown shape, falling back to per-doc checks');
          this.checkFavoritesIndividually();
        }
      },
      error: (err) => {
        console.error('[DocumentList] getFavorites -> error', err);
        this.checkFavoritesIndividually();
      },
    });
  }

  private checkFavoritesIndividually(): void {
    console.log('[DocumentList] checkFavoritesIndividually -> checking', this.documents.length, 'docs');
    let remaining = this.documents.length;
    if (remaining === 0) {
      this.loadingFavorites = false;
      return;
    }

    this.documents.forEach((doc) => {
      const idStr = String(doc.id);
      const idNum = parseInt(idStr, 10);
      const apiId: any = Number.isNaN(idNum) ? idStr : idNum;

      this.favoriteService.isFavorite(apiId).subscribe({
        next: (isFav) => {
          console.log(`[DocumentList] isFavorite(${idStr}) ->`, isFav);
          if (isFav) this.favoriteIds.add(idStr);
        },
        error: (err) => {
          console.error(`[DocumentList] isFavorite(${idStr}) error ->`, err);
        },
        complete: () => {
          remaining--;
          if (remaining === 0) {
            this.loadingFavorites = false;
            console.log('[DocumentList] checkFavoritesIndividually -> done');
          }
        },
      });
    });
  }

  onSearchChange(): void {
    const query = this.searchTerm.trim().toLowerCase();
    console.log('[DocumentList] onSearchChange ->', query);
    this.filteredDocuments = this.documents.filter(
      (doc) =>
        doc.title?.toLowerCase().includes(query) ||
        (doc.category && doc.category.toLowerCase().includes(query))
    );
  }

  deleteDocument(id: string): void {
    console.log('[DocumentList] deleteDocument ->', id);
    this.documentService.deleteDocument(id).subscribe({
      next: () => {
        console.log('[DocumentList] deleteDocument -> success, refreshing list');
        this.favoriteIds.delete(String(id)); // keep local favorites in sync
        this.toastr.success('Document deleted successfully', 'Success');
        this.getDocuments();
      },
      error: (err) => {
        console.error('[DocumentList] deleteDocument -> error', err);
        this.toastr.error('Failed to delete document', 'Error');
      },
    });
  }

  openDetail(docId: string): void {
    console.log('[DocumentList] openDetail ->', docId);
    this.router.navigate(['/documents', docId]);
  }

  isFavorite(doc: any): boolean {
    return this.favoriteIds.has(String(doc?.id));
  }

  toggleFavorite(doc: any): void {
    const idStr = String(doc.id);
    if (this.toggling.has(idStr)) {
      console.log('[DocumentList] toggleFavorite -> already toggling', idStr);
      return;
    }

    const idNum = parseInt(idStr, 10);
    const apiId: any = Number.isNaN(idNum) ? idStr : idNum;

    const currentlyFav = this.isFavorite(doc);
    console.log('[DocumentList] toggleFavorite ->', { idStr, apiId, currentlyFav });

    this.toggling.add(idStr);

    if (!currentlyFav) {
      this.favoriteService.addFavorite(apiId).subscribe({
        next: () => {
          console.log('[DocumentList] addFavorite -> success', idStr);
          this.favoriteIds.add(idStr);
          this.toastr.success('Document added to favorites', 'Success');
        },
        error: (err) => {
          console.error('[DocumentList] addFavorite -> error', err);
          this.toastr.error('Failed to add document to favorites', 'Error');
        },
        complete: () => {
          this.toggling.delete(idStr);
        },
      });
    } else {
      this.favoriteService.removeFavorite(apiId).subscribe({
        next: () => {
          console.log('[DocumentList] removeFavorite -> success', idStr);
          this.favoriteIds.delete(idStr);
          this.toastr.success('Document removed from favorites', 'Success');
        },
        error: (err) => {
          console.error('[DocumentList] removeFavorite -> error', err);
          this.toastr.error('Failed to remove document from favorites', 'Error');
        },
        complete: () => {
          this.toggling.delete(idStr);
        },
      });
    }
  }
}
