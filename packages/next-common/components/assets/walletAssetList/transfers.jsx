import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import AssetsTransfersHistory from "next-common/components/assets/transferHistory/index";

export default function Transfers({ setTotalCount }) {
  return (
    <div>
      <SecondaryCard>
        <AssetsTransfersHistory setTotalCount={setTotalCount} />
      </SecondaryCard>
    </div>
  );
}
