import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { Analytics, logEvent } from '@angular/fire/analytics';
import { getPerformance, trace } from '@angular/fire/performance';
import { FirebasePerformance } from '@angular/fire/performance';

@Injectable({
  providedIn: 'root'
})
export class DbService {
  performance: FirebasePerformance;

  constructor(
    private firestore: Firestore,
    private analytics: Analytics
  ) {
    this.performance = getPerformance();
  }

  async addDocument(
    collectionName: string,
    data: any
  ) {
    const t = trace(this.performance, `add_${collectionName}`);
    t.start();

    try {
      const collectionRef = collection(this.firestore, collectionName);
      await addDoc(collectionRef, data);
    } catch (error) {
      logEvent(this.analytics, 'exception', {
        description: error.message || error.toString(),
        fatal: true
      });
      console.error('Erro ao enviar a requisição. Tente novamente.', error);
    } finally {
      t.stop();
    }

  }
}
