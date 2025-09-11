import { GreyPanel } from "next-common/components/styled/containers/greyPanel";
import tw from "tailwind-styled-components";

const ErrorInfoPanel = tw(GreyPanel)`
  py-2.5 px-4
  text-red500 text14Medium
  bg-red100
`;

export default ErrorInfoPanel;
