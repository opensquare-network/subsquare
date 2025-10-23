import { usePageProps } from "next-common/context/page";
import ForeignAssetsTransfersTable from "next-common/components/assets/foreignAssets/transfers";

export default function ProfileForeignAssetsTransfers() {
  const { id } = usePageProps();

  return <ForeignAssetsTransfersTable address={id} />;
}
