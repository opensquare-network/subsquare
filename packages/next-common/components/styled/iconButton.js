import tw from "tailwind-styled-components";
import Button from "next-common/lib/button";

export const IconButton = tw(Button)`
  flex
  justify-center
  items-center
  p-0
  w-[32px]
  h-[32px]
  rounded-[8px]
  bg-neutral200
`;
