import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

try {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const projectRoot = path.join(__dirname, '../../../');

  if (!fs.existsSync(projectRoot)) {
    fs.mkdirSync(projectRoot, { recursive: true });
  }

  const environmentVariables = {
    "projects": {
      "default": process.env.FIREBASE_PROJECT_ID
    }
  };

  const filePath = path.join(projectRoot, '.firebaserc');
  const fileContent = JSON.stringify(environmentVariables, null, 2);

  fs.writeFileSync(filePath, fileContent);
  console.log(`✅ Variáveis de ambiente firebase criadas com sucesso em: ${filePath}`);
} catch (error) {
  console.error("❌ Erro ao atualizar variáveis de ambiente firebase:", error);
  process.exit(1);
}