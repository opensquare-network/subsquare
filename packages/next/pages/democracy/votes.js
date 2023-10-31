import { withCommonProps } from "next-common/lib";
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

export default function DemocracyVotes({ summary }) {
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
}

export const getServerSideProps = withCommonProps(async (context) => {
  const tracksProps = await fetchOpenGovTracksProps();

  return {
    props: {
      ...tracksProps,
    },
  };
});
