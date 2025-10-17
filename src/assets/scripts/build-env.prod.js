import 'dotenv/config';
import './build-firebase.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const {
  GITHUB_URL,
  GITHUB_TOKEN,
  GITHUB_USERNAME,
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_DB_URL,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID,
  FIREBASE_MEASUREMENT_ID
} = process.env;

try {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const envDir = path.join(__dirname, '../../environments');
  if (!fs.existsSync(envDir)) {
    fs.mkdirSync(envDir, { recursive: true });
  }

  const environmentVariables = {
    production: true,
    github: {
      api: GITHUB_URL || '',
      token: GITHUB_TOKEN || '',
      username: GITHUB_USERNAME || ''
    },
    firebase: {
      apiKey: FIREBASE_API_KEY,
      authDomain: FIREBASE_AUTH_DOMAIN,
      databaseURL: FIREBASE_DB_URL,
      projectId: FIREBASE_PROJECT_ID,
      storageBucket: FIREBASE_STORAGE_BUCKET,
      messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
      appId: FIREBASE_APP_ID,
      measurementId: FIREBASE_MEASUREMENT_ID
    },
  };

  const filePath = path.join(envDir, 'environment.ts');
  const fileContent = `export const environment = ${JSON.stringify(environmentVariables, null, 2)};\n`;

  fs.writeFileSync(filePath, fileContent);

  console.log(`✅ Variáveis de ambiente criadas com sucesso em: ${filePath}`);
} catch (error) {
  console.error("❌ Erro ao atualizar variáveis de ambiente:", error);
  process.exit(1);
}