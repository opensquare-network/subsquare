import { NoticeWrapper } from "next-common/components/styled/containers/titleContainer";
import tw from "tailwind-styled-components";

export const LinkButton = tw.div`
  text14Medium
  cursor-pointer
  inline-flex items-center
  text-center text-textSecondary

  [&_svg]:ml-2 [&_svg]:mr-1
`;

export const CountDownWrapper = tw(NoticeWrapper)`
  gap-2
  px-4 !py-2.5
`;
