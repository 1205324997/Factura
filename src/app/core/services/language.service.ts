import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  constructor(public translate: TranslateService, private cookieService: CookieService) {
    let browserLang = 'es';
    this.translate.addLangs([browserLang]);
    this.translate.setDefaultLang(browserLang);

    if (this.cookieService.check('lang')) {
      browserLang = this.cookieService.get('lang');
    } else {
      this.setLanguage(browserLang);
      browserLang = translate.getBrowserLang();
    }

    translate.use(browserLang.match(/es/) ? browserLang : 'es');
  }

  public setLanguage(lang: string) {
    this.translate.use(lang);
    this.cookieService.set('lang', lang);
  }
}
