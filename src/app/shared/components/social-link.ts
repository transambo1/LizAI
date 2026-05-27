import { Component } from '@angular/core';

@Component({
  selector: 'app-social-login',
  standalone: true,
  imports: [],
  template: `
    <div class="text-center mt-4 position-relative">
      <hr class="text-muted" />
      <span
        class="position-absolute top-50 start-50 translate-middle bg-white px-3"
        style="font-size: 10px; color: #a0aabf; font-weight: bold"
        >OR CONTINUE WITH</span
      >
    </div>

    <div class="row g-2 mt-2">
      <div class="col-4">
        <button
          class="btn btn-outline-secondary border-1 w-100 small d-flex justify-content-center align-items-center gap-2"
          style="font-size: 12px; font-weight: 500"
          type="button"
        >
          <i class="bi bi-google text-danger"></i> Google
        </button>
      </div>
      <div class="col-4">
        <button
          class="btn btn-outline-secondary border-1 w-100 small d-flex justify-content-center align-items-center gap-2"
          style="font-size: 12px; font-weight: 500"
          type="button"
        >
          <i class="bi bi-github text-dark"></i> GitHub
        </button>
      </div>
      <div class="col-4">
        <button
          class="btn btn-outline-secondary border-1 w-100 small d-flex justify-content-center align-items-center gap-2"
          style="font-size: 12px; font-weight: 500"
          type="button"
        >
          <i class="bi bi-microsoft text-info"></i> Microsoft
        </button>
      </div>
    </div>
  `,
})
export class SocialLoginComponent {}
