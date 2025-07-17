import { Component, OnInit } from '@angular/core';
import { FavoriteService } from '../../Services/favorite.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-favorite-documents',
  templateUrl: './favorite-documents.component.html',
  styleUrls: ['./favorite-documents.component.css']
})
export class FavoriteDocumentsComponent implements OnInit {
  favorites: any[] = [];

  constructor(private favoriteService: FavoriteService, private router: Router) {}

  ngOnInit(): void {
    this.loadFavorites();
  }

  loadFavorites(): void {
    this.favoriteService.getFavorites().subscribe(docs => this.favorites = docs);
  }

  removeFavorite(docId: number): void {
    this.favoriteService.removeFavorite(docId).subscribe(() => {
      this.favorites = this.favorites.filter(doc => doc.id !== docId);
    });
  }

  openDetails(docId: number): void {
    this.router.navigate(['/documents', docId]);
  }
}
