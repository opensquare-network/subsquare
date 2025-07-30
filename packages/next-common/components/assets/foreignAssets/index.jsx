import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import ForeignAssetsTable from "./table";
import {
  ForeignAssetsProvider,
  useForeignAssets,
} from "next-common/context/foreignAssets";

function ForeignAssetsHeader() {
  const { count } = useForeignAssets();

  return (
    <div className="pl-6 inline-flex items-center">
      <span className="text16Bold text-textPrimary">Foreign Asset</span>
      <span className="text16Medium text-textTertiary ml-1">{count}</span>
    </div>
  );
}

export default function ForeignAssets() {
  return (
    <ForeignAssetsProvider>
      <div className="mb-1">
        <ForeignAssetsHeader />
        <div className="mt-4">
          <SecondaryCard>
            <ForeignAssetsTable />
          </SecondaryCard>
        </div>
      </div>
    </ForeignAssetsProvider>
  );
}
