async function main(): Promise<void> {
  const { tryGetPromptContext, ensureInteractive } = await import('./install/prompt-context.js');
  const { promptProductChoice } = await import('./install/prompt.js');
  const { runOpenCodeInstall } = await import('./install/opencode-install.js');
  const { runClaudeInstall } = await import('./install/claude-install.js');

  const promptCtx = tryGetPromptContext();
  ensureInteractive(promptCtx);
  const product = await promptProductChoice(promptCtx);

  if (product === 'opencode') {
    const result = await runOpenCodeInstall(promptCtx);
    process.stdout.write(`${result.lines.join('\n')}\n`);
    if (result.missingKeys.length > 0) {
      process.stdout.write(`\nMissing keys (fill these files):\n${result.missingKeys.map((p) => `- ${p}`).join('\n')}\n`);
    }
    return;
  }

  const claudeResult = await runClaudeInstall(promptCtx);
  process.stdout.write(`${claudeResult.lines.join('\n')}\n`);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`assistagents failed: ${message}\n`);
  process.exitCode = 1;
});
