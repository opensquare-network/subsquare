import Link from "next-common/components/link";
import tw from "tailwind-styled-components";

const LinkButton = tw(Link)`
  text-textPrimary text12Medium
  border border-neutral400
  rounded-[6px] px-[11px] py-[5px] h-7
  hover:border-neutral500
`;

export default LinkButton;
