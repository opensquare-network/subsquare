import { withCommonProps } from "next-common/lib";
import { useChainSettings } from "next-common/context/chain";
import { backendApi } from "next-common/services/nextApi";
import { fetchList } from "next-common/services/list";
import TreasuryBurnt from "next-common/components/treasury/burnt";
import { TreasuryProvider } from "next-common/context/treasury";

export default function TreasuryBurntPage() {
  const chainSettings = useChainSettings();
  if (!chainSettings?.modules?.treasury?.burnt) {
    return null;
  }

  return (
    <TreasuryProvider>
      <TreasuryBurnt />
    </TreasuryProvider>
  );
}

export const getServerSideProps = withCommonProps(async (context) => {
  const [{ result: burntSummary }, burntList, burntChart] = await Promise.all([
    backendApi.fetch("/treasury/burnt/summary"),
    fetchList("/treasury/burnt", context),
    backendApi.fetch("/treasury/burnt/chart"),
  ]);

  return {
    props: {
      burntSummary: burntSummary ?? null,
      burntList: burntList ?? null,
      burntChart: burntChart ?? null,
    },
  };
});
