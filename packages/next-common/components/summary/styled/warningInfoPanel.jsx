import { GreyPanel } from "next-common/components/styled/containers/greyPanel";
import tw from "tailwind-styled-components";

const WarningInfoPanel = tw(GreyPanel)`
  py-2.5 px-4
  text-orange500 text14Medium
  bg-orange100
`;

export default WarningInfoPanel;
