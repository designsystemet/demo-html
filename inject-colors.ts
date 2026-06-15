import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const COLOR_FILE = resolve(__dirname, "design-tokens/semantic/color.json");


function main(): void {
    const raw = readFileSync(COLOR_FILE, "utf8");
    const tokens = JSON.parse(raw);

    const customColors = {
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
            ...customColors,
        },
    };

    writeFileSync(COLOR_FILE, JSON.stringify(updatedTokens, null, 2) + "\n", "utf8");

    console.log(
        `Injected custom colors into ${COLOR_FILE}\n`, JSON.stringify(customColors, null, 2)
    );
}

main();
