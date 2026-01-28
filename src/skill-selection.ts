export type LanguageKey = 'typescript' | 'rust' | 'csharp';

export const ALL_LANGUAGES: ReadonlyArray<LanguageKey> = ['typescript', 'rust', 'csharp'];

export type SkillCopyPlan = {
  // Paths relative to templates/skills
  relDirs: string[];
};

export function buildSkillCopyPlan(languages: ReadonlyArray<LanguageKey>): SkillCopyPlan {
  const relDirs: string[] = [];

  // Always install these.
  relDirs.push('planning');
  relDirs.push('review');
  relDirs.push('testing');
  relDirs.push('research-strategy');

  // Language-specific coder skills.
  const uniq = new Set(languages);
  for (const lang of ALL_LANGUAGES) {
    if (uniq.has(lang)) {
      relDirs.push(`coder/${lang}`);
    }
  }

  return { relDirs };
}
