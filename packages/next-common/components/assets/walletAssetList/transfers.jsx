import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import AssetsTransfersHistory from "next-common/components/assets/transferHistory/index";

export default function Transfers() {
  return (
    <div>
      <SecondaryCard>
        <AssetsTransfersHistory />
      </SecondaryCard>
    </div>
  );
}
