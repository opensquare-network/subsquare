import useSubKintsugiAccount from "next-common/hooks/account/useSubKintsugiAccount";
import { CommonAccountInfoPanel } from "./accountInfoPanel";

export default function KintsugiAccountInfoPanel({ hideManageAccountLink }) {
  useSubKintsugiAccount();

  return (
    <CommonAccountInfoPanel hideManageAccountLink={hideManageAccountLink} />
  );
}
