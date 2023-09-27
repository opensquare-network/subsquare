import styled from "styled-components";
import { NoticeWrapper } from "next-common/components/styled/containers/titleContainer";
import tw from "tailwind-styled-components";

export const LinkButton = tw.div`
  text14Medium
  cursor-pointer
  inline-flex items-center
  text-center text-textSecondary

  [&_svg]:ml-2 [&_svg]:mr-1
`;

export const CountDownWrapper = styled(NoticeWrapper)`
  position: static;
  height: 38px;

  gap: 8px;
`;
