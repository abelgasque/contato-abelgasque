import { Component, OnInit } from '@angular/core';
import { Analytics, logEvent } from '@angular/fire/analytics';
import { DbService } from '../../shared/services/db.service';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit {
  constructor(
    private analytics: Analytics,
    private dbService: DbService
  ) {}

  ngOnInit(): void {}

  async scrollTo(section) {
    const sectionHtml = document.querySelector('#' + section);
    if (sectionHtml !== null) {
      logEvent(this.analytics, `scroll_to_${section}`, {
        categoria: 'navegacao',
        label: `Scroll para ${section}`
      });

      sectionHtml.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });

      await this.dbService.addDocument('scroll_logs', {
        section,
        timestamp: new Date(),
        page: window.location.pathname
      });
    }
  }
}
