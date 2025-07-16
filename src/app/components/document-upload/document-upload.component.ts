import { Component } from '@angular/core';
import { DocumentService } from '../../Services/document.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-document-upload',
  templateUrl: './document-upload.component.html'
})
export class DocumentUploadComponent {
  selectedFile: File | undefined = undefined;
  title: string = '';
  paragraphText: string = '';
  mode: 'file' | 'text' = 'file';
  loading = false;

  constructor(
    private documentService: DocumentService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.selectedFile = target.files[0];
      console.log('File selected:', this.selectedFile.name);
    }
  }

  onUpload() {

    console.log('Paragraph Text:', this.paragraphText);
    if (!this.title.trim()) {
      this.toastr.error('Title is required!');
      console.log('Error: Title is empty');
      return;
    }

    if (this.mode === 'file' && !this.selectedFile) {
      this.toastr.error('Please select a file.');
      return;
    }

    if (this.mode === 'text' && !this.paragraphText.trim()) {
      this.toastr.error('Please enter some text.');
      return;
    }

    this.loading = true;

    this.documentService.uploadDocument(this.title, this.selectedFile, this.paragraphText).subscribe({
      next: (res) => {
        this.toastr.success('Document uploaded successfully!');
        setTimeout(() => {
          this.loading = false;
          this.router.navigate(['/documents']);
        }, 1000);
      },
      error: (err) => {
        this.loading = false;
        this.toastr.error('Upload failed: ' + (err?.error?.message || 'Unknown error'));
      }
    });
  }
}
