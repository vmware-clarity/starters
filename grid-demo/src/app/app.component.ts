import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  readonly url: Observable<string[]>;

  constructor(router: Router) {
    this.url = router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => router.url.substring(1).split('/'))
    );
  }
}
