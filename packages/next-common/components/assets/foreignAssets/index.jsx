import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import ForeignAssetsTable from "./table";
import {
  ForeignAssetsProvider,
  useForeignAssets,
} from "next-common/context/foreignAssets";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";

function ForeignAssetsHeader() {
  const { count } = useForeignAssets();

  return (
    <TitleContainer className="justify-start gap-x-1">
      Foreign Asset
      <span className="text16Medium text-textTertiary">{count}</span>
    </TitleContainer>
  );
}

export default function ForeignAssets() {
  return (
    <ForeignAssetsProvider>
      <ForeignAssetsHeader />
      <SecondaryCard>
        <ForeignAssetsTable />
      </SecondaryCard>
    </ForeignAssetsProvider>
  );
}
