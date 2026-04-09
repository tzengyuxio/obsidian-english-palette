import { App, Plugin } from "obsidian";

interface InternalCommand {
	id: string;
	name: string;
}

interface AppWithCommands extends App {
	commands: {
		commands: Record<string, InternalCommand>;
	};
}

export default class EnglishPalettePlugin extends Plugin {
	private originalNames = new Map<string, string>();

	onload() {
		this.app.workspace.onLayoutReady(() => {
			this.patchCommandNames();
		});
	}

	onunload() {
		this.restoreCommandNames();
	}

	private get commandRegistry(): Record<string, InternalCommand> | null {
		const registry = (this.app as unknown as AppWithCommands).commands;
		return registry?.commands ?? null;
	}

	private patchCommandNames() {
		const commands = this.commandRegistry;
		if (!commands) return;

		for (const cmd of Object.values(commands)) {
			if (this.originalNames.has(cmd.id)) continue;
			if (this.isAscii(cmd.name)) continue;

			const englishLabel = this.formatCommandId(cmd.id);

			this.originalNames.set(cmd.id, cmd.name);
			cmd.name = `${cmd.name} [${englishLabel}]`;
		}
	}

	private restoreCommandNames() {
		const commands = this.commandRegistry;
		if (!commands) return;

		for (const [id, originalName] of this.originalNames) {
			const cmd = commands[id];
			if (cmd) {
				cmd.name = originalName;
			}
		}

		this.originalNames.clear();
	}

	private isAscii(str: string): boolean {
		return !/[^\x20-\x7E]/.test(str);
	}

	/** "workspace:split-vertical" → "workspace split vertical" */
	private formatCommandId(id: string): string {
		return id.replace(/[:_-]/g, " ");
	}
}
