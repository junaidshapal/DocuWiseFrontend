import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../Services/user.service';

@Component({
  selector: 'app-manage-profile',
  templateUrl: './manage-profile.component.html',
})
export class ManageProfileComponent implements OnInit {
  profileForm!: FormGroup;
  passwordForm!: FormGroup;
  selectedImage: File | null = null;
  lastLogin: Date | null = null;
  imagePreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    });

    this.loadProfile();
  }

  loadProfile() {
  this.userService.getProfile().subscribe({
    next: (res) => {
      this.profileForm.patchValue(res);
      this.lastLogin = new Date(res.lastLogin);

      console.log('Profile loaded:', res);

      if (res.profilePictureUrl) {
        this.imagePreview = `https://localhost:7187${res.profilePictureUrl}`;
        console.log('Loaded image URL:', this.imagePreview);
      } else {
        console.warn('No profile image URL in profile data');
      }
    },
    error: (err) => {
      console.error('Failed to load profile:', err);
    }
  });
}
  onProfileUpdate() {
    if (this.profileForm.valid) {
      this.userService.updateProfile(this.profileForm.value).subscribe(() => {
        this.toastr.success('Profile updated!');
      });
    }
  }

  onPasswordChange() {
    if (this.passwordForm.valid) {
      this.userService.changePassword(this.passwordForm.value).subscribe({
        next: (res) => {
          this.toastr.success(res);
          this.passwordForm.reset();
        },
        error: (err) => {
          this.toastr.error(err.error || 'Password change failed');
          console.error(err);
        },
      });
    }
  }

  onFileChange(event: any) {
    this.selectedImage = event.target.files[0];

    if (this.selectedImage) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(this.selectedImage);
    }
  }

  uploadProfilePicture() {
    if (this.selectedImage) {
      const formData = new FormData();
      formData.append('ProfileImage', this.selectedImage);

      this.userService.uploadProfilePicture(formData).subscribe(() => {
        this.toastr.success('Profile picture updated!');
      });
    }
  }
}
