import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationComponent } from './components/navigation/navigation.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavigationComponent],
  template: `
    <app-navigation></app-navigation>
    <main class="main-content">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      background: #000000;
    }
    
    .main-content {
      flex: 1;
      padding-top: 1.5rem;
      padding-bottom: 3rem;
      width: 100%;
      position: relative;
      background: transparent;
    }
  `]
})
export class AppComponent {}