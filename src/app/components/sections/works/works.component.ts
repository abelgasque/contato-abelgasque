import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Analytics, logEvent } from '@angular/fire/analytics';

import { environment } from 'src/environments/environment';
import { DbService } from '../../shared/services/db.service';

@Component({
  selector: 'app-works',
  templateUrl: './works.component.html',
  styleUrls: ['./works.component.scss']
})
export class WorksComponent implements OnInit {
  baseUrl: string;
  username: string;
  token: string;
  repos: any[] = [];
  languages: string[] = [];
  workFilter: string = 'all';

  constructor(
    private http: HttpClient,
    private analytics: Analytics,
    private dbService: DbService
  ) {
    this.baseUrl = environment.github.api;
    this.token = environment.github.token;
    this.username = environment.github.username;
  }

  ngOnInit(): void {
    this.loadRepos();
  }

  loadRepos() {
    this.http
      .get<any[]>(`${this.baseUrl}/users/${this.username}/repos?per_page=6`, {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      })
      .subscribe((data) => {
        this.repos = data;

        const langs = data
          .map((repo) => repo.language)
          .filter((lang) => lang !== null);

        this.languages = Array.from(new Set(langs)).sort();
      });
  }

  async onChange(event: any) {
    logEvent(this.analytics, `click_${event.target.value}`, {
      categoria: 'navegacao',
      label: `Clique em ${event.target.value}`
    });

    this.workFilter = event.target.value;

    await this.dbService.addDocument('scroll_logs', {
      section: this.workFilter,
      timestamp: new Date(),
      page: window.location.pathname
    });
  }

  async openRepo(repoUrl: string, repoName: string) {
    logEvent(this.analytics, `click_${repoName}`, {
      categoria: 'navegacao',
      label: `Clique em ${repoName}`
    });

    window.open(repoUrl, '_blank');

    await this.dbService.addDocument('click_logs', {
      repoUrl,
      repoName,
      timestamp: new Date(),
      page: window.location.pathname
    });
  }
}