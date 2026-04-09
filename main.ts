import { Plugin } from "obsidian";

// Extend Obsidian's undocumented internal API typings
interface InternalCommand {
	id: string;
	name: string;
}

interface CommandRegistry {
	commands: Record<string, InternalCommand>;
}

/**
 * English Palette
 *
 * Appends English keywords (derived from command IDs) to every command name,
 * so users can search in English even when the UI is in another language.
 *
 * Example: "向右分割" → "向右分割 [workspace split vertical]"
 */
export default class EnglishPalettePlugin extends Plugin {
	// Stores original command names for restoration on unload
	private originalNames = new Map<string, string>();

	async onload() {
		this.app.workspace.onLayoutReady(() => {
			this.patchCommandNames();
		});
	}

	onunload() {
		this.restoreCommandNames();
	}

	/**
	 * Iterate all registered commands and append formatted English keywords
	 * derived from the command ID.
	 */
	private patchCommandNames() {
		const registry = (this.app as any).commands as CommandRegistry;
		if (!registry?.commands) return;

		for (const cmd of Object.values(registry.commands)) {
			// Skip if already patched (defensive against double-load)
			if (this.originalNames.has(cmd.id)) continue;

			const englishLabel = this.formatCommandId(cmd.id);

			// Skip if the name already contains the English label
			// (e.g., English UI where name ≈ id)
			if (cmd.name.toLowerCase().includes(englishLabel.toLowerCase())) continue;

			// Save original name for restoration
			this.originalNames.set(cmd.id, cmd.name);

			// Append English keywords in brackets
			cmd.name = `${cmd.name} [${englishLabel}]`;
		}
	}

	/**
	 * Restore all command names to their original values.
	 */
	private restoreCommandNames() {
		const registry = (this.app as any).commands as CommandRegistry;
		if (!registry?.commands) return;

		for (const [id, originalName] of this.originalNames) {
			const cmd = registry.commands[id];
			if (cmd) {
				cmd.name = originalName;
			}
		}

		this.originalNames.clear();
	}

	/**
	 * Convert a command ID into a readable English string.
	 *
	 * "workspace:split-vertical" → "workspace split vertical"
	 * "editor:toggle-bold"       → "editor toggle bold"
	 */
	private formatCommandId(id: string): string {
		return id.replace(/:/g, " ").replace(/[-_]/g, " ");
	}
}
