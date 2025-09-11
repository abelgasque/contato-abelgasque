import { Component, OnInit } from '@angular/core';
import { animate, AUTO_STYLE, state, style, transition, trigger } from '@angular/animations';
import { Analytics, logEvent } from '@angular/fire/analytics';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';

import { ScrollSpyService } from '../../components/scroll-spy/scroll-spy.service';
import { Config } from '../../app-config';
import { DbService } from 'src/app/components/shared/services/db.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  providers: [NgbDropdownConfig],
  animations: [
    trigger('collapsedCard', [
      state(
        'collapsed, void',
        style({
          overflow: 'hidden',
          height: '0px'
        })
      ),
      state(
        'expanded',
        style({
          overflow: 'hidden',
          height: AUTO_STYLE
        })
      ),
      transition('collapsed <=> expanded', [animate('400ms ease-in-out')])
    ])
  ]
})
export class LayoutComponent implements OnInit {
  public currentSection;
  public themeConfig: any;
  public windowWidth: number;

  public openClass: string = '';
  public contentClass: string = 'content';

  public mobileHeaderClass: string = 'mobile-header-1';
  public desktopHeaderClass: string = 'desktop-header-1';
  public horizontalNavClass: string = 'navbar-dark';

  public desktopLogo = 'https://firebasestorage.googleapis.com/v0/b/cv-abelgasque-e8ab0.firebasestorage.app/o/assets%2Flogo.svg?alt=media&token=eeca4a85-64ab-4239-a3e9-8435899f46da';

  public collapsedCard: string = 'collapsed';

  constructor(
    private analytics: Analytics,
    private dbService: DbService,
    public scrollSpy: ScrollSpyService
  ) {
    this.themeConfig = Config.config;
    this.windowWidth = window.innerWidth;
  }

  ngOnInit(): void {
    this.scrollSpy.count.subscribe((c) => {
      this.currentSection = c;
    });
    document.querySelector('body').classList.add(this.themeConfig.themeType);
    switch (this.themeConfig.theme) {
      case 'vertical':
        this.mobileHeaderClass = 'mobile-header-1';
        this.desktopHeaderClass = 'desktop-header-1';
        switch (this.themeConfig.themeType) {
          case 'light':
            this.desktopLogo = 'https://firebasestorage.googleapis.com/v0/b/cv-abelgasque-e8ab0.firebasestorage.app/o/assets%2Flogo-dark.svg?alt=media&token=16f7e79c-4abb-4319-a18d-e2b9c4f7b10b';
            break;
          default:
            this.desktopLogo = 'https://firebasestorage.googleapis.com/v0/b/cv-abelgasque-e8ab0.firebasestorage.app/o/assets%2Flogo.svg?alt=media&token=eeca4a85-64ab-4239-a3e9-8435899f46da';
        }
        break;
      case 'collapsed':
        this.mobileHeaderClass = 'mobile-header-2';
        this.desktopHeaderClass = 'desktop-header-2';
        this.contentClass = 'content-2';
        switch (this.themeConfig.themeType) {
          case 'light':
            this.desktopLogo = 'assets/images/logo-b-dark.svg';
            break;
          default:
            this.desktopLogo = 'assets/images/logo-b-light.svg';
        }
        break;
      case 'horizontal':
        this.desktopHeaderClass = 'desktop-header-3 fixed-top';
        this.contentClass = 'content-3';
        switch (this.themeConfig.themeType) {
          case 'light':
            this.horizontalNavClass = 'navbar-light';
            this.desktopLogo = 'https://firebasestorage.googleapis.com/v0/b/cv-abelgasque-e8ab0.firebasestorage.app/o/assets%2Flogo-dark.svg?alt=media&token=16f7e79c-4abb-4319-a18d-e2b9c4f7b10b';
            break;
          default:
            this.desktopLogo = 'https://firebasestorage.googleapis.com/v0/b/cv-abelgasque-e8ab0.firebasestorage.app/o/assets%2Flogo.svg?alt=media&token=eeca4a85-64ab-4239-a3e9-8435899f46da';
        }
        break;
    }
    this.mobileHeaderClass = this.mobileHeaderClass + ' ' + this.themeConfig.themeType;
    this.desktopHeaderClass = this.desktopHeaderClass + ' ' + this.themeConfig.themeType;

    if (this.windowWidth > 991) {
      this.collapsedCard = 'false';
    }
  }

  onResize(e) {
    if (this.windowWidth > 991) {
      this.collapsedCard = 'false';
    } else {
      this.collapsedCard = 'collapsed';
    }
  }

  async scrollTo(section: string) {
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

  async collapsedCardToggle() {
    logEvent(this.analytics, `collapsed_card_${this.collapsedCard}`, {
      categoria: 'navegacao',
      label: `Collapse/Expand Card`
    });
    
    this.collapsedCard = this.collapsedCard === 'collapsed' ? 'expanded' : 'collapsed';
    
    await this.dbService.addDocument('scroll_logs', {
      section: this.collapsedCard,
      timestamp: new Date(),
      page: window.location.pathname
    });
  }
}
