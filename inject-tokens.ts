import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { createHash } from "node:crypto";

const __dirname = dirname(fileURLToPath(import.meta.url));

function injectCustomTypography() {
    const PRIMARY_TYPOGRAPHY_FILE = resolve(__dirname, "designsystemet/design-tokens/primitives/modes/typography/primary/demo.json");
    const SECONDARY_TYPOGRAPHY_FILE = resolve(__dirname, "designsystemet/design-tokens/primitives/modes/typography/secondary/demo.json");
    const THEME_DEMO_FILE = resolve(__dirname, "designsystemet/design-tokens/themes/demo.json");

    const secondaryTypographyTokens = JSON.parse(readFileSync(SECONDARY_TYPOGRAPHY_FILE, "utf8"));
    const primaryTypographyTokens = JSON.parse(readFileSync(PRIMARY_TYPOGRAPHY_FILE, "utf8"));

    const newFontWeights = {
        "bold": {
            "$type": "fontWeights",
            "$value": "Bold"
        },
    }

    // Update primary typography with new font weights because typography sets need to have same font-weights so text styles in Figma does not break when switching between primary and secondary typography
    const updatedPrimaryTokens = {
        ...primaryTypographyTokens,
        ...{
            demo: {
                ...primaryTypographyTokens.demo,
                "font-weight": {
                    ...primaryTypographyTokens.demo["font-weight"],
                    ...newFontWeights
                }
            }
        }
    }


    // We use secondary typography set for new font JetBrains Mono and weights
    const updatedSecondaryTokens = {
        ...secondaryTypographyTokens,
        ...{
            demo: {
                "font-family": {
                    "$type": "fontFamilies",
                    "$value": "JetBrains Mono"
                },
                "font-weight": {
                    ...secondaryTypographyTokens.demo["font-weight"],
                    ...newFontWeights
                }
            }

        }
    };



    const themeDemo = JSON.parse(readFileSync(THEME_DEMO_FILE, "utf8"));

    /** Update theme set demo with new font weights for JetBrains Mono */
    const customThemeDemo = {
        ...themeDemo,
        ...{
            "font-weight": {
                "medium": {
                    "$type": "fontWeights",
                    "$value": "{demo.font-weight.medium}"
                },
                "semibold": {
                    "$type": "fontWeights",
                    "$value": "{demo.font-weight.semibold}"
                },
                "regular": {
                    "$type": "fontWeights",
                    "$value": "{demo.font-weight.regular}"
                },
                "bold": {
                    "$type": "fontWeights",
                    "$value": "{demo.font-weight.bold}"
                }
            },
        }
    };

    writeFileSync(PRIMARY_TYPOGRAPHY_FILE, JSON.stringify(updatedPrimaryTokens, null, 2) + "\n", "utf8");
    writeFileSync(SECONDARY_TYPOGRAPHY_FILE, JSON.stringify(updatedSecondaryTokens, null, 2) + "\n", "utf8");
    writeFileSync(THEME_DEMO_FILE, JSON.stringify(customThemeDemo, null, 2) + "\n", "utf8");

    console.log(
        `Update primary typography in ${PRIMARY_TYPOGRAPHY_FILE}\n`, JSON.stringify(updatedPrimaryTokens, null, 2),
        `Update secondary typography in ${SECONDARY_TYPOGRAPHY_FILE}\n`, JSON.stringify(updatedSecondaryTokens, null, 2),
        `Update theme demo in ${THEME_DEMO_FILE}\n`, JSON.stringify(customThemeDemo, null, 2)
    );
}




function injectCustomSizes() {
    const TOKENS_DIR = resolve(__dirname, "designsystemet/design-tokens");
    const THEMES_FILE = resolve(TOKENS_DIR, "$themes.json");
    const METADATA_FILE = resolve(TOKENS_DIR, "$metadata.json");

    // Names must be `xsmall` and `xlarge` so `designsystemet tokens build` maps them to `data-size="xs"` and `data-size="xl"` and orders them correctly
    const newSizeModes = [
        {
            name: "xsmall",
            // Inserted before this size mode in $themes.json and $metadata.json
            before: "small",
            modeFontSize: "14",
            fontSizes: ["10", "12", "13", "14", "16", "18", "21", "24", "30", "36"]
        },
        {
            name: "xlarge",
            // Inserted after this size mode in $themes.json and $metadata.json
            after: "large",
            modeFontSize: "24",
            fontSizes: ["14", "18", "21", "24", "30", "36", "48", "60", "72", "96"]
        }
    ];

    const sizeTokenSet = (size: string) => `primitives/modes/size/${size}`;
    const typographySizeTokenSet = (size: string) => `primitives/modes/typography/size/${size}`;
    const tokenSetFile = (tokenSet: string) => resolve(TOKENS_DIR, `${tokenSet}.json`);

    // Base new size modes on medium so they get the same tokens
    const mediumSizeTokens = JSON.parse(readFileSync(tokenSetFile(sizeTokenSet("medium")), "utf8"));
    const mediumTypographySizeTokens = JSON.parse(readFileSync(tokenSetFile(typographySizeTokenSet("medium")), "utf8"));

    const themes: { name: string; group?: string;[key: string]: unknown }[] = JSON.parse(readFileSync(THEMES_FILE, "utf8"));
    const metadata = JSON.parse(readFileSync(METADATA_FILE, "utf8"));

    for (const { name, before, after, modeFontSize, fontSizes } of newSizeModes) {
        const updatedSizeTokens = {
            ...mediumSizeTokens,
            size: {
                ...mediumSizeTokens.size,
                "_mode-font-size": {
                    ...mediumSizeTokens.size["_mode-font-size"],
                    "$value": modeFontSize
                }
            }
        };

        const updatedTypographySizeTokens = {
            ...mediumTypographySizeTokens,
            "font-size": Object.fromEntries(
                fontSizes.map((fontSize, index) => [`${index + 1}`, { "$type": "fontSizes", "$value": fontSize }])
            )
        };

        writeFileSync(tokenSetFile(sizeTokenSet(name)), JSON.stringify(updatedSizeTokens, null, 2) + "\n", "utf8");
        writeFileSync(tokenSetFile(typographySizeTokenSet(name)), JSON.stringify(updatedTypographySizeTokens, null, 2) + "\n", "utf8");

        /** Add size mode to $themes.json next to the existing size modes */
        const existingIndex = themes.findIndex((theme) => theme.group === "Size" && theme.name === name);
        if (existingIndex !== -1) themes.splice(existingIndex, 1);
        const sizeThemes = themes.filter((theme) => theme.group === "Size");

        const newTheme = {
            // Deterministic id so reruns produce the same output
            id: createHash("sha1").update(`size-${name}`).digest("hex"),
            name,
            "$figmaStyleReferences": {},
            selectedTokenSets: {
                [sizeTokenSet(name)]: "source",
                [sizeTokenSet("global")]: "enabled",
                [typographySizeTokenSet(name)]: "enabled"
            },
            "$figmaCollectionId": sizeThemes[0]?.["$figmaCollectionId"],
            group: "Size"
        };
        const lastSizeIndex = themes.indexOf(sizeThemes[sizeThemes.length - 1]);
        themes.splice(lastSizeIndex + 1, 0, newTheme);

        /** Add token sets to $metadata.json in size order */
        for (const tokenSet of [sizeTokenSet, typographySizeTokenSet]) {
            const order: string[] = metadata.tokenSetOrder.filter((set: string) => set !== tokenSet(name));
            const anchorIndex = order.indexOf(tokenSet(before ?? after!));
            order.splice(before ? anchorIndex : anchorIndex + 1, 0, tokenSet(name));
            metadata.tokenSetOrder = order;
        }
    }

    writeFileSync(THEMES_FILE, JSON.stringify(themes, null, 2) + "\n", "utf8");
    writeFileSync(METADATA_FILE, JSON.stringify(metadata, null, 2) + "\n", "utf8");

    console.log(
        `Added size modes ${newSizeModes.map(({ name }) => name).join(", ")} to ${THEMES_FILE} and ${METADATA_FILE}`
    );
}

/**
 * Make sure to run this script after `designsystmet tokens create`, but before `designsystemet tokens build` to inject custom colors into the generated color tokens.
 */
injectCustomTypography();
injectCustomSizes();