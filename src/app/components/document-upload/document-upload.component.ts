import { Component } from '@angular/core';
import { DocumentService } from '../../Services/document.service';

@Component({
  selector: 'app-document-upload',
  templateUrl: './document-upload.component.html'
})
export class DocumentUploadComponent {
  selectedFile: File | null = null;
  title: string = '';
  uploadStatus: string = '';

  constructor(private documentService: DocumentService) {}

  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.selectedFile = target.files[0];
      console.log('File selected:', this.selectedFile.name);
    }
  }

  onUpload() {
    if (!this.selectedFile || !this.title.trim()) {
      this.uploadStatus = 'Please select a file to upload and title.';
      return;
    }

    console.log('Uploading file:', this.selectedFile.name, 'with title:',this.title);

    this.documentService.uploadDocument(this.selectedFile, this.title).subscribe({
      next: (res) => {
        console.log('Upload success response:', res);
        this.uploadStatus = 'Upload Successful!';
      },
      error: (err) => {
        console.error('Upload failed:', err);
        this.uploadStatus = 'Upload Failed. Please try again: ' + (err?.error?.message || err.message || 'Unknown error');
      }
    });
  }
}
