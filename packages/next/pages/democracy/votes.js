import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { ssrNextApi } from "next-common/services/nextApi";
import {
  Democracy,
  ModuleTabProvider,
} from "next-common/components/profile/votingHistory/common";
import ModuleVotes from "components/myvotes/moduleVotes";
import DemocracyReferendaLayout from "next-common/components/layout/democracyLayout/referenda";
import { useUser } from "next-common/context/user";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";

export default withLoginUserRedux(({ summary }) => {
  const user = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user?.address) {
      router.push("/democracy/referenda");
    }
  }, [user, router]);

  const title = "Democracy Referenda";

  const seoInfo = { title, desc: title };

  return (
    <DemocracyReferendaLayout
      seoInfo={seoInfo}
      title={title}
      summaryData={summary}
    >
      <ModuleTabProvider defaultTab={Democracy}>
        <ModuleVotes />
      </ModuleTabProvider>
    </DemocracyReferendaLayout>
  );
});

export const getServerSideProps = withLoginUser(async (context) => {
  const [tracksProps, { result: summary }] = await Promise.all([
    fetchOpenGovTracksProps(),
    ssrNextApi.fetch("summary"),
  ]);

  return {
    props: {
      ...tracksProps,
      summary: summary ?? {},
    },
  };
});
