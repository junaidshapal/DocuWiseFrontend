import { Component, OnInit } from '@angular/core';
import { FavoriteService } from '../../Services/favorite.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-favorite-documents',
  templateUrl: './favorite-documents.component.html',
  styleUrls: ['./favorite-documents.component.css']
})
export class FavoriteDocumentsComponent implements OnInit {
  favorites: any[] = [];
  filteredFavorites: any[] = [];
  searchTerm: string = '';

  constructor(private favoriteService: FavoriteService, private router: Router, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.loadFavorites();
  }

  loadFavorites(): void {
    this.favoriteService.getFavorites().subscribe(docs => {
      this.favorites = docs;
      this.filteredFavorites = docs;
    });
  }

  onSearchChange(): void {
    if (!this.searchTerm.trim()) {
      this.filteredFavorites = this.favorites;
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredFavorites = this.favorites.filter(doc => 
        doc.title.toLowerCase().includes(term) ||
        doc.category.toLowerCase().includes(term)
      );
    }
  }

  removeFavorite(docId: number): void {
    this.favoriteService.removeFavorite(docId).subscribe({
      next: () => {
        this.favorites = this.favorites.filter(doc => doc.id !== docId);
        this.filteredFavorites = this.filteredFavorites.filter(doc => doc.id !== docId);
        this.toastr.success('Document removed from favorites', 'Success');
      },
      error: (err) => {
        console.error('Failed to remove favorite:', err);
        this.toastr.error('Failed to remove document from favorites', 'Error');
      }
    });
  }

  openDetails(docId: number): void {
    this.router.navigate(['/documents', docId]);
  }
}
