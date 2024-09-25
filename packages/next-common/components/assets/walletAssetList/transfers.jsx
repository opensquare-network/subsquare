import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import AssetsTransfersHistory from "next-common/components/assets/transferHistory/index";
import useRealAddress from "next-common/utils/hooks/useRealAddress";

export default function Transfers() {
  const address = useRealAddress();

  return (
    <div>
      <SecondaryCard>
        <AssetsTransfersHistory address={address} />
      </SecondaryCard>
    </div>
  );
}
