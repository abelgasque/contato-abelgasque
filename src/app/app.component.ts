import { Component, OnInit } from '@angular/core';
import { Analytics, logEvent } from '@angular/fire/analytics';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Okk';

  constructor(private analytics: Analytics) { }

  ngOnInit(): void {
    logEvent(this.analytics, 'usuario_abriu_o_site', {
      categoria: 'navegacao',
      label: 'Inicio'
    });
  }
}