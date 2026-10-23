import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PRIMARY_TYPOGRAPHY_FILE = resolve(__dirname, "designsystemet/design-tokens/primitives/modes/typography/primary/demo.json");
const SECONDARY_TYPOGRAPHY_FILE = resolve(__dirname, "designsystemet/design-tokens/primitives/modes/typography/secondary/demo.json");
const THEME_DEMO_FILE = resolve(__dirname, "designsystemet/design-tokens/themes/demo.json");


function injectCustomTypography() {

    /** Update primary typography with custom JetBrains Mono font and weights */
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


    // We use secondary typography set for custom JetBrains Mono font and weights
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

    /** Update theme demo with custom font weights for JetBrains Mono */
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

/**
 * Make sure to run this script after `designsystmet tokens create`, but before `designsystemet tokens build` to inject custom colors into the generated color tokens.
 */
injectCustomTypography();