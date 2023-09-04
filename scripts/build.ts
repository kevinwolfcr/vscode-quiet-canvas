import { readFileSync, writeFileSync } from "node:fs"

import * as colors from "@radix-ui/colors"
import tinycolor from "tinycolor2"

function scaleToHex(name: string, scale: Record<string, string>) {
  return Object.entries(scale).reduce(
    (scale, [, value], i) => ({ ...scale, [`$${name}${i + 1}`]: `${tinycolor(value).toHexString()}` }),
    {},
  )
}

const palette = {
  dark: {
    $transparent: "#00000000",
    $contrast: "#000000",
    ...scaleToHex("base", colors.slateDark),
    ...scaleToHex("accent", colors.mintDark),
    ...scaleToHex("info", colors.blueDark),
    ...scaleToHex("success", colors.greenDark),
    ...scaleToHex("warning", colors.yellowDark),
    ...scaleToHex("error", colors.redDark),
    ...scaleToHex("cyan", colors.cyanDark),
    ...scaleToHex("magenta", colors.pinkDark),
  },
  light: {
    $transparent: "#00000000",
    $contrast: "#000000",
    ...scaleToHex("base", colors.slate),
    ...scaleToHex("accent", colors.mint),
    ...scaleToHex("info", colors.blue),
    ...scaleToHex("success", colors.green),
    ...scaleToHex("warning", colors.yellow),
    ...scaleToHex("error", colors.red),
    ...scaleToHex("cyan", colors.cyan),
    ...scaleToHex("magenta", colors.pink),
  },
} as Record<string, Record<string, string>>

const themesDir = new URL("../themes/", import.meta.url)
const template = readFileSync(new URL("./_template-color-theme.json", themesDir), { encoding: "utf-8" })

for (const type in palette) {
  let result = template
  const scale = palette[type]

  for (const color in scale) {
    result = result.replace(new RegExp(`"\\${color}"`, "g"), `"${scale[color]}"`)
  }

  result = result.replace("$type", type)
  writeFileSync(new URL(`./${type}-color-theme.json`, themesDir), result)
}
