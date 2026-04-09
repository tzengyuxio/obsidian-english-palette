# English Palette

An [Obsidian](https://obsidian.md) plugin that lets you search commands in English within the Command Palette, regardless of your UI language.

## Problem

When Obsidian's UI language is set to a non-English language (e.g., Traditional Chinese), the Command Palette only matches localized command names. If you're used to English commands like "Split right", you can't find them without switching your input method.

## Solution

English Palette appends English keywords (derived from command IDs) to every command name, so both the localized name and the English equivalent are searchable.

**Before:** `向右分割`
**After:** `向右分割 [workspace split vertical]`

## Installation

### From Community Plugins

1. Open **Settings → Community plugins → Browse**
2. Search for **English Palette**
3. Click **Install**, then **Enable**

### Manual

1. Download `main.js` and `manifest.json` from the [latest release](https://github.com/tzengyuxio/obsidian-english-palette/releases/latest)
2. Create a folder `english-palette` in your vault's `.obsidian/plugins/` directory
3. Place both files inside the folder
4. Restart Obsidian and enable the plugin in **Settings → Community plugins**

## How It Works

On startup, the plugin reads all registered commands, formats each command's ID (which is always in English, e.g., `workspace:split-vertical`) into a readable string (`workspace split vertical`), and appends it to the command's display name in brackets.

When the plugin is disabled, all command names are restored to their original values.

## License

[MIT](LICENSE)
