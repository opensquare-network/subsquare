import { withCommonProps } from "next-common/lib";
import { useChainSettings } from "next-common/context/chain";
import ListLayout from "next-common/components/layout/ListLayout";
import { TreasuryProvider } from "next-common/context/treasury";
import businessCategory from "next-common/utils/consts/business/category";
import { backendApi } from "next-common/services/nextApi";
import { fetchList } from "next-common/services/list";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import TreasuryBurnt from "next-common/components/treasury/burnt";

export default function TreasuryBurntPage() {
  const chainSettings = useChainSettings();
  if (!chainSettings?.modules?.treasury?.burnt) {
    return null;
  }
  const category = businessCategory.treasuryBurnt;
  const seoInfo = { title: category, desc: category };

  return (
    <TreasuryProvider>
      <ListLayout seoInfo={seoInfo} title={category}>
        <TreasuryBurnt />
      </ListLayout>
    </TreasuryProvider>
  );
}

export const getServerSideProps = withCommonProps(async (context) => {
  const [{ result: burntSummary }, burntList] = await Promise.all([
    fetchOpenGovTracksProps(),
    backendApi.fetch("/treasury/burnt/summary"),
    fetchList("/treasury/burnt", context),
  ]);

  return {
    props: {
      burntSummary,
      burntList,
    },
  };
});
