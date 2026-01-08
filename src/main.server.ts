import 'zone.js/node';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';

// هنا بنعمل bootstrap للتطبيق كـ SSR
export default function bootstrap() {
  return bootstrapApplication(AppComponent, config);
}
