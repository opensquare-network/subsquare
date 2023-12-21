import tw from "tailwind-styled-components";

export const Title = tw.div`
  text-textPrimary text16Bold
  ${(p) => p.disabled && "text-textTertiary"}
`;
