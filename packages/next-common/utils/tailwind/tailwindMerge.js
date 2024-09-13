import { fonts } from "next-common/styles/tailwind-plugins/fonts";
import { extendTailwindMerge } from "tailwind-merge";

const fontsGroup = Object.keys(fonts).map((key) => key.slice(1));

export const twMerge = extendTailwindMerge({
  classGroups: {
    text: fontsGroup,
  },
});
