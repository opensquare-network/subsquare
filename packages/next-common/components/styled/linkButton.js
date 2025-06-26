import Link from "next/link";
import tw from "tailwind-styled-components";

const LinkButtonStyled = tw(Link)`
  text-textPrimary text12Medium
  border border-neutral400
  rounded-[6px] px-[11px] py-[5px] h-7
  hover:border-neutral500
`;

export default LinkButtonStyled;
