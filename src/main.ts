import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppModule } from './app/app.module';
import { provideToastr } from 'ngx-toastr';



platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
