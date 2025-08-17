import { Component, OnInit, inject, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CORE_IMPORTS, MATERIAL_IMPORTS } from '../../shared';
import { ProfileService } from '../../services/profile.service';
import { NotificationService } from '../../shared/services/notification.service';
import { UserProfile } from '../../models/profile.model';
import { MessagesService } from '../../shared/services/messages.service';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [
    ...CORE_IMPORTS,
    ...MATERIAL_IMPORTS,
    ReactiveFormsModule
  ],
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss']
})
export class ProfilePage implements OnInit {
  private readonly profileService = inject(ProfileService);
  private readonly notification = inject(NotificationService);
  private readonly fb = inject(FormBuilder);
  private readonly messages = inject(MessagesService);

  profileForm!: FormGroup;
  
  profile: WritableSignal<UserProfile | null> = signal(null);
  isLoading = this.profileService.isLoading;
  error = this.profileService.error;

  ngOnInit(): void {
    this.loadProfileData();

    this.profileForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      userName: [{ value: '', disabled: true }]
    });
  }

  loadProfileData(): void {
    this.profileService.getProfile().subscribe({
      next: (userProfile) => {
        this.profile.set(userProfile);
        this.profileForm.patchValue(userProfile);
      }
    });
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      const updatedData = { email: this.profileForm.get('email')?.value };
      this.profileService.updateProfile(updatedData).subscribe(() => {
        this.notification.success(this.messages.general().profileUpdateSuccess);
      });
    }
  }
}
