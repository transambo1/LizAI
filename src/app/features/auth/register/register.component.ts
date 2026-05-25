import { Component } from '@angular/core';
import { SocialLoginComponent } from '../../../shared/components/social-link';
import { MatIcon } from "@angular/material/icon";

@Component({
  standalone: true,
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  imports: [SocialLoginComponent, MatIcon]
})
export class RegisterComponent {}