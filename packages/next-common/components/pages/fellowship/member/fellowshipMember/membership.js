import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { CardTitle } from "./styled";

function NotImported() {
  return (
    <div className="py-[16px] text-center">
      <span className="text14Medium text-textTertiary">
        Not imported in the management system
      </span>
    </div>
  );
}

export default function Membership() {
  return (
    <SecondaryCard>
      <CardTitle>Membership</CardTitle>
      <NotImported />
    </SecondaryCard>
  );
}
