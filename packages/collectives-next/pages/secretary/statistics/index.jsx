import ListLayout from "next-common/components/layout/ListLayout";
import SecretaryCollectivesStatistics from "next-common/components/secretary/statistics/collectives";
import CollectivesProvider from "next-common/context/collectives/collectives";
import { withCommonProps } from "next-common/lib";
import { backendApi } from "next-common/services/nextApi";
import { secretaryMembersApiUri } from "next-common/services/url";

export default function SecretaryStatisticsPage() {
  const category = "Secretary Statistics";
  const seoInfo = { title: category, desc: category };

  return (
    <CollectivesProvider section="secretary">
      <ListLayout seoInfo={seoInfo} title={category}>
        <SecretaryCollectivesStatistics />
      </ListLayout>
    </CollectivesProvider>
  );
}

export const getServerSideProps = withCommonProps(async () => {
  const { result: secretaryMembers } = await backendApi.fetch(
    secretaryMembersApiUri,
  );

  return {
    props: {
      secretaryMembers: secretaryMembers ?? null,
    },
  };
});
