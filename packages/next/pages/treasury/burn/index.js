import { withCommonProps } from "next-common/lib";
import { useChainSettings } from "next-common/context/chain";
import { backendApi } from "next-common/services/nextApi";
import { fetchList } from "next-common/services/list";
import TreasuryBurn from "next-common/components/treasury/burn";
import { TreasuryProvider } from "next-common/context/treasury";

export default function TreasuryBurnPage() {
  const chainSettings = useChainSettings();
  if (!chainSettings?.modules?.treasury?.burn) {
    return null;
  }

  return (
    <TreasuryProvider>
      <TreasuryBurn />
    </TreasuryProvider>
  );
}

export const getServerSideProps = withCommonProps(async (context) => {
  const [{ result: burnSummary }, burnList, burnChart] = await Promise.all([
    backendApi.fetch("/treasury/burnt/summary"),
    fetchList("/treasury/burnt", context),
    backendApi.fetch("/treasury/burnt/chart"),
  ]);

  return {
    props: {
      burnSummary: burnSummary ?? null,
      burnList: burnList ?? null,
      burnChart: burnChart ?? null,
    },
  };
});
