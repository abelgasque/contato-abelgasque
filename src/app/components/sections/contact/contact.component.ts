import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Analytics, logEvent } from '@angular/fire/analytics';

import { DbService } from '../../shared/services/db.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  contactForm!: FormGroup;

  constructor(
    private analytics: Analytics,
    private fb: FormBuilder,
    private dbService: DbService
  ) { }

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', Validators.required]
    });
  }

  async submitForm() {
    if (this.contactForm.invalid) {
      const message = 'Formulário de contato inválido';
      this.contactForm.markAllAsTouched();
      alert(message);
      logEvent(this.analytics, 'invalid', {
        description: message,
        fatal: true
      });
      return;
    }

    logEvent(this.analytics, 'formulario_contato', {
      categoria: 'contato',
      label: `Formulario de Contato`
    });

    await this.dbService.addDocument('contacts', this.contactForm.value);
    alert('Requisição enviada com sucesso!');
  }
}