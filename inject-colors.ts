import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const COLOR_FILE = resolve(__dirname, "design-tokens/semantic/color.json");


function main(): void {
    const raw = readFileSync(COLOR_FILE, "utf8");
    const tokens = JSON.parse(raw) as { color: Record<string, unknown> };

    if (!tokens.color || typeof tokens.color !== "object") {
        throw new Error(`Unexpected structure in ${COLOR_FILE}: missing "color" object`);
    }

    // or

    const colors = {
        text: {
            warm: {
                $type: "color",
                $value: "#e29b03",
            },
            cold: {
                $type: "color",
                $value: "#4d8190",
            },
        }
    }

    const updatedTokens = {
        ...tokens,
        color: {
            ...tokens.color,
            ...colors,
        },
    };


    writeFileSync(COLOR_FILE, JSON.stringify(updatedTokens, null, 2) + "\n", "utf8");

    console.log(
        `Injected ${Object.keys(colors.text).length} custom color(s) into ${COLOR_FILE}`,
    );
}

main();
