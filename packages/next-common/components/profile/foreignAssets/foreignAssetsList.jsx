import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { usePageProps } from "next-common/context/page";
import SubscribedForeignAssetsList from "next-common/components/assethubMigrationAssets/subscribedForeignAssetsList";
import { colId } from "next-common/components/assethubMigrationAssets/foreignAssets/table/columns/id";
import { colToken } from "next-common/components/assethubMigrationAssets/foreignAssets/table/columns/token";
import { colTotal } from "next-common/components/assethubMigrationAssets/foreignAssets/table/columns/total";
import { colTransferable } from "next-common/components/assethubMigrationAssets/foreignAssets/table/columns/transferable";

export default function ProfileForeignAssetsTable() {
  const { id } = usePageProps();
  const columnsDef = [colToken, colId, colTotal, colTransferable];

  return (
    <div className="flex flex-col gap-[16px]">
      <SecondaryCard>
        <SubscribedForeignAssetsList address={id} columnsDef={columnsDef} />
      </SecondaryCard>
    </div>
  );
}
