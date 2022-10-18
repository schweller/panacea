import { createStitches } from '@stitches/react';
import { sand, amber, amberDark, sandDark, lime, limeDark, blue, blueDark, plum, plumDark, mauve, mauveDark } from "@radix-ui/colors"

export const { styled, createTheme, getCssText } = createStitches({
    theme: {
      colors: {
        ...amber,
        ...sand,
        ...lime,
        ...blue,
        ...plum,
        ...mauve
      },
    },
  });

  export const darkTheme = createTheme({
    colors: {
      ...mauveDark,
      ...plumDark,
      ...blueDark,
      ...limeDark,
      ...amberDark,
      ...sandDark
    },
  });
