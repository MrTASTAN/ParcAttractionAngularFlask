import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes'; // Import des routes
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';

// ✅ Fonction pour charger les fichiers de traduction JSON
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

// ✅ Configuration des providers pour l'application
const appConfig = {
  providers: [
    importProvidersFrom(
      HttpClientModule, // 🔹 Ajout d'HttpClientModule ici
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient],
        },
      })
    ),
    provideRouter(routes), // 🔹 Fournir les routes
  ],
};

// 🚀 Bootstrapping de l'application
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error("Erreur lors du démarrage de l'application :", err));
