import fsSync from 'node:fs';
import { Readable, Writable } from 'node:stream';

export type PromptContext = { input: Readable; output: Writable } | undefined;

export function tryGetPromptContext(): PromptContext {
  const ttyOk = Boolean(process.stdin.isTTY && process.stdout.isTTY);
  if (ttyOk) return undefined;

  // Some runners (npm exec/npx) may not provide a TTY stdin even in a terminal.
  // Try to attach to /dev/tty on Unix.
  if (process.platform !== 'win32') {
    try {
      // createReadStream('/dev/tty') can emit async errors that bypass try/catch.
      // Use openSync so we can fail fast and safely.
      const inFd = fsSync.openSync('/dev/tty', 'r');
      const outFd = fsSync.openSync('/dev/tty', 'w');

      const input = fsSync.createReadStream('', { fd: inFd, autoClose: true });
      const output = fsSync.createWriteStream('', { fd: outFd, autoClose: true });

      input.on('error', () => {});
      output.on('error', () => {});

      return { input, output };
    } catch {
      return undefined;
    }
  }

  return undefined;
}

export function ensureInteractive(promptCtx: PromptContext): void {
  const interactive = Boolean(process.stdin.isTTY && process.stdout.isTTY) || Boolean(promptCtx);
  if (!interactive) {
    throw new Error('This installer only works in interactive TUI mode (TTY not found).');
  }
}
