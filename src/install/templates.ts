import path from 'node:path';
import { fileURLToPath } from 'node:url';

export function getTemplatesRoot(): string {
  const here = path.dirname(fileURLToPath(import.meta.url));
  // dist/install/*.js -> packageRoot/templates
  return path.resolve(here, '..', '..', 'templates');
}
