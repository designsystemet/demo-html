import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const COLOR_FILE = resolve(__dirname, "design-tokens/semantic/color.json");

type ColorToken = {
    $type: "color";
    $value: string;
};

const CUSTOM_COLORS: Record<string, string> = {
    "text-color-warm": "#e29b03",
    "text-color-cold": "#4d8190",
};

function makeToken(value: string): ColorToken {
    return { $type: "color", $value: value };
}

function main(): void {
    const raw = readFileSync(COLOR_FILE, "utf8");
    const tokens = JSON.parse(raw) as { color: Record<string, unknown> };

    if (!tokens.color || typeof tokens.color !== "object") {
        throw new Error(`Unexpected structure in ${COLOR_FILE}: missing "color" object`);
    }

    for (const [name, value] of Object.entries(CUSTOM_COLORS)) {
        tokens.color[name] = makeToken(value);
    }

    writeFileSync(COLOR_FILE, JSON.stringify(tokens, null, 2) + "\n", "utf8");

    console.log(
        `Injected ${Object.keys(CUSTOM_COLORS).length} custom color(s) into ${COLOR_FILE}`,
    );
}

main();
