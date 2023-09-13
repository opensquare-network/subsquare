import { withLoginUser } from "next-common/lib";
import { ssrNextApi } from "next-common/services/nextApi";
import { gov2ReferendumsSummaryApi } from "next-common/services/url";
import ReferendaLayout from "next-common/components/layout/referendaLayout";
import {
  ModuleTabProvider,
  Referenda,
} from "next-common/components/profile/votingHistory/common";
import ModuleVotes from "components/myvotes/moduleVotes";
import { useUser } from "next-common/context/user";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";

export default function ReferendaVotesPage({ summary }) {
  const user = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user?.address) {
      router.push("/referenda");
    }
  }, [user, router]);

  const title = "OpenGov Referenda";

  const seoInfo = { title, desc: title };

  return (
    <ReferendaLayout seoInfo={seoInfo} title={title} summaryData={summary}>
      <ModuleTabProvider defaultTab={Referenda}>
        <ModuleVotes />
      </ModuleTabProvider>
    </ReferendaLayout>
  );
}

export const getServerSideProps = withLoginUser(async () => {
  const [tracksProps, { result: summary }] = await Promise.all([
    fetchOpenGovTracksProps(),
    ssrNextApi.fetch(gov2ReferendumsSummaryApi),
  ]);

  return {
    props: {
      ...tracksProps,
      summary: summary ?? {},
    },
  };
});
