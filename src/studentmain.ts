import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

//import { StudentAppModule } from './app/studentapp.module';
import {StudentAppModule} from './app/studentapp.module';

import { environment } from './environments/environment';

if (environment.production) {
    enableProdMode();
}

platformBrowserDynamic().bootstrapModule(StudentAppModule)
    .catch(err => console.error(err));
