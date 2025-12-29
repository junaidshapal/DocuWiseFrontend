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
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  lastLogin: Date | null = null;
  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

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
      const formValue = this.passwordForm.value;
      
      // Check if passwords match
      if (formValue.newPassword !== formValue.confirmPassword) {
        this.toastr.error('New password and confirm password must match', 'Validation Error');
        return;
      }
      
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
    } else {
      this.toastr.error('Please fill in all required fields correctly', 'Validation Error');
    }
  }

  toggleCurrentPasswordVisibility() {
    this.showCurrentPassword = !this.showCurrentPassword;
  }

  toggleNewPasswordVisibility() {
    this.showNewPassword = !this.showNewPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];

    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  uploadProfilePicture() {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('ProfileImage', this.selectedFile);

      this.userService.uploadProfilePicture(formData).subscribe(() => {
        this.toastr.success('Profile picture updated!');
      });
    }
  }
}
