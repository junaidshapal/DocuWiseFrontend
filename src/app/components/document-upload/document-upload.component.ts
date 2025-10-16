import { Component, OnInit, OnDestroy } from '@angular/core';
import { DocumentService } from '../../Services/document.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { LoadingStateService } from '../../Services/loading-state.service';
import { Subscription } from 'rxjs';
import { UploadResponse } from '../../core/Models/upload-response.model';

@Component({
  selector: 'app-document-upload',
  templateUrl: './document-upload.component.html'
})
export class DocumentUploadComponent implements OnInit, OnDestroy {
  selectedFile?: File;
  title = '';
  paragraphText = '';
  mode: 'file' | 'text' = 'file';
  loading = false;
  uploadStatus = '';
  private loadingSubscription?: Subscription;

  private get isLoading(): boolean {
    return this.loading;
  }

  private set isLoading(value: boolean) {
    this.loading = value;
    this.loadingStateService.setLoading(value);
  }

  constructor(
    private readonly documentService: DocumentService,
    private readonly toastr: ToastrService,
    private readonly router: Router,
    private readonly loadingStateService: LoadingStateService
  ) {}

  ngOnInit(): void {
    this.loadingSubscription = this.loadingStateService.isLoading$.subscribe(
      (isLoading) => (this.loading = isLoading)
    );
  }

  ngOnDestroy(): void {
    this.loadingSubscription?.unsubscribe();
  }

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.selectedFile = target.files[0];
      console.log('File selected:', this.selectedFile.name);
    }
  }

  private validateUpload(): boolean {
    if (!this.title.trim()) {
      this.toastr.error('Title is required!');
      return false;
    }

    if (this.mode === 'file' && !this.selectedFile) {
      this.toastr.error('Please select a file.');
      return false;
    }

    if (this.mode === 'text' && !this.paragraphText.trim()) {
      this.toastr.error('Please enter some text.');
      return false;
    }

    return true;
  }

  private resetForm(): void {
    this.title = '';
    this.selectedFile = undefined;
    this.paragraphText = '';
    this.uploadStatus = '';
  }

  onUpload(): void {
    if (!this.validateUpload()) {
      return;
    }

    this.uploadStatus = 'Uploading document...';
    this.isLoading = true;

    const handleError = (error: unknown): void => {
      this.isLoading = false;
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.uploadStatus = 'Upload failed: ' + errorMessage;
      this.toastr.error('Upload failed. Please try again.');
      console.error('Upload error:', error);
    };

    try {
      this.documentService
        .uploadDocument(
          this.title.trim(),
          this.selectedFile,
          this.paragraphText.trim()
        )
        .subscribe({
          next: (response: UploadResponse) => {
            this.uploadStatus = 'Document uploaded successfully!';
            this.toastr.success('Document uploaded successfully!');
            this.toastr.success(
              'Summary generated successfully!',
              'AI Processing Complete'
            );
            this.resetForm();
            this.isLoading = false;

            console.log('Preparing to navigate to documents page');
            setTimeout(() => {
              this.router
                .navigate(['/documents'])
                .then(() => console.log('Navigation successful'))
                .catch((navError: Error) => {
                  console.error('Navigation failed:', navError);
                  this.toastr.error(
                    'Failed to navigate to documents page. Please try manually.'
                  );
                });
            }, 1000);
          },
          error: (error: unknown) => {
            console.error('Upload failed:', error);
            this.loadingStateService.setLoading(false);
            const errorMessage =
              (error as any)?.error?.message ||
              'Unknown error occurred during upload';
            this.uploadStatus = 'Upload failed: ' + errorMessage;
            this.toastr.error(errorMessage, 'Upload Failed');
          },
          complete: () => {
            console.log('Upload operation completed');
          }
        });
    } catch (error: unknown) {
      console.error('Unexpected error in onUpload:', error);
      this.loadingStateService.setLoading(false);
      this.toastr.error('An unexpected error occurred');
    }
  }
}
