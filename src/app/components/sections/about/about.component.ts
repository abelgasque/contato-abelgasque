import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Analytics, logEvent } from '@angular/fire/analytics';
import { environment } from 'src/environments/environment';
import { DbService } from '../../shared/services/db.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  private cvUrl: string;
  baseUrl: string;
  token: string;
  username: string;
  repos: any[] = [];

  get totalCommits(): number {
    return this.repos.reduce((acc, repo) => acc + (repo.totalCommits || 0), 0);
  }

  constructor(
    private http: HttpClient,
    private analytics: Analytics,
    private dbService: DbService
  ) {
    this.cvUrl = 'https://firebasestorage.googleapis.com/v0/b/cv-abelgasque-e8ab0.firebasestorage.app/o/curriculo%2FCV_ABEL_GASQUE.pdf?alt=media&token=c0b2be7e-5a10-447f-85c5-7cdda258ff72';
    this.baseUrl = environment.github.api;
    this.token = environment.github.token;
    this.username = environment.github.username;
  }

  ngOnInit(): void {
    this.loadRepositories();
  }

  loadRepositories(): void {
    const url = `${this.baseUrl}/users/${this.username}/repos?per_page=100`;

    this.http.get<any[]>(url, {
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    }).subscribe({
      next: (repos) => {
        this.repos = repos;

        this.repos.forEach((repo) => {
          const commitsUrl = `${this.baseUrl}/repos/${this.username}/${repo.name}/stats/contributors`;
          this.http.get<any[]>(commitsUrl, {
            headers: {
              'Authorization': `Bearer ${this.token}`
            }
          }).subscribe({
            next: (data) => {
              repo.totalCommits = data
                ? data.reduce((acc, c) => acc + c.total, 0)
                : 0;
            },
            error: () => {
              repo.totalCommits = 0;
            }
          });
        });
      },
      error: (err) => console.error(err)
    });
  }

  async downloadCV(event: Event) {
    event.preventDefault();

    logEvent(this.analytics, `click_cv_download`, {
      categoria: 'navegacao',
      label: `Clique em Download CV`
    });

    window.open(this.cvUrl, '_blank');

    await this.dbService.addDocument('click_logs', {
      repoUrl: this.cvUrl,
      repoName: 'CV',
      timestamp: new Date(),
      page: window.location.pathname
    });
  }
}
