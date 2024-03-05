import tw from "tailwind-styled-components";

export const ToggleMenuButton = tw.button`
  w-6 h-6 bg-navigationActive rounded
  [&_svg_path]:stroke-navigationTextTertiary
`;

export const SiteName = tw.h2`text20BoldLogo max-sm:text-[20px] max-sm:font-[28px]`;

export const BrandingHint = tw.div`text12Medium mt-1 max-sm:mt-0 text-navigationTextTertiary`;
