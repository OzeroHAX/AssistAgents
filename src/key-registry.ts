import path from 'node:path';

export const KEYS = {
  zaiApi: {
    label: 'ZAI_API_KEY',
    fileName: 'zai_api.txt',
  },
  context7: {
    label: 'CONTEXT7_API_KEY',
    fileName: 'context7.txt',
  },
  tavily: {
    label: 'TAVILY_API_KEY',
    fileName: 'tavily_search.txt',
  },
} as const;

export type KeyId = keyof typeof KEYS;
export type KeyFiles = Record<KeyId, string>;

const KEY_IDS = Object.keys(KEYS) as KeyId[];

export function getKeyLabel(keyId: KeyId): string {
  return KEYS[keyId].label;
}

export function buildKeyFiles(targetKeysDir: string): KeyFiles {
  const keyFiles = {} as KeyFiles;
  for (const keyId of KEY_IDS) {
    keyFiles[keyId] = path.join(targetKeysDir, KEYS[keyId].fileName);
  }
  return keyFiles;
}

export function getKeyFileRefsForBase(baseDir: string): KeyFiles {
  const keyFiles = {} as KeyFiles;
  for (const keyId of KEY_IDS) {
    keyFiles[keyId] = `${baseDir}/${KEYS[keyId].fileName}`;
  }
  return keyFiles;
}
