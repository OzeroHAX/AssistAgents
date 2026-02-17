# FAQ

## Do I need to remove the previous installation first?

No. The installer updates required directories in `~/.opencode` automatically.

## Can I use the package without API keys?

Yes. No-key integrations are available immediately. Integrations that require keys are disabled if a key is not set.

## How do I change the agent response language after installation?

Re-run the installer and set a new `Preferred response language` value. 

## Which user profile settings can I configure?

During installation you can configure:
- `Preferred user skill level` (`Zero`, `Junior`, `Middle`, `Senior`)
- `Known technologies (comma-separated)`
- `Communication style` (`direct`, `friendly`, `academic`)

## Can I choose different models for different agents?

Yes. During installation there is a step `Select agents to set explicit models (optional)` where you can set models per selected agent.

## Is it safe to store keys in `~/.opencode/keys`?

It is local user key storage. Do not publish these files and do not commit them to git.

## What if agent behavior changed after an update?

1. Check whether your manual edits in `agents/skills` were overwritten.
2. Verify enabled MCP integrations.
3. Restore a known-good state from a zip backup if needed.
