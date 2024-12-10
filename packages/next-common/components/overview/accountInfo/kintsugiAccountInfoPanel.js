import useSubKintsugiAccount from "next-common/hooks/account/useSubKintsugiAccount";
import { CommonAccountInfoPanel } from "./accountInfoPanel";

export default function KintsugiAccountInfoPanel() {
  useSubKintsugiAccount();

  return <CommonAccountInfoPanel />;
}
