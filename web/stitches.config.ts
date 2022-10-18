import { createStitches } from '@stitches/react';
import { violet, mauve, sand, amber, amberDark, sandDark } from "@radix-ui/colors"

export const { styled, createTheme, getCssText } = createStitches({
    theme: {
      colors: {
        ...amber,
        ...sand,
        ...amberDark,
        ...sandDark,
      },
    },
  });