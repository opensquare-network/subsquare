import { withCommonProps } from "next-common/lib";
import nextApi from "next-common/services/nextApi";
import { gov2ReferendumsSummaryApi } from "next-common/services/url";
import ReferendaLayout from "next-common/components/layout/referendaLayout";
import {
  ModuleTabProvider,
  Referenda,
} from "next-common/components/profile/votingHistory/common";
import ModuleVotes from "next-common/components/myvotes/moduleVotes";
import { useUser } from "next-common/context/user";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import { cn } from "next-common/utils";
import { ModuleTab } from "next-common/components/profile/votingHistory/common";
import { Title } from "next-common/components/myvotes/styled";

export function ReferendaVoteLayout({ children }) {
  return (
    <div className="flex flex-col gap-[16px]">
      <div
        className={cn(
          "flex justify-between items-center gap-3 mx-6",
          "max-sm:block max-sm:space-y-3",
        )}
      >
        <Title>My Votes</Title>
        <ModuleTab />
      </div>
      {children}
    </div>
  );
}

export default function ReferendaVotesPage({ referendaSummary }) {
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
    <ReferendaLayout
      seoInfo={seoInfo}
      title={title}
      summaryData={referendaSummary}
    >
      <ModuleTabProvider defaultTab={Referenda}>
        <ReferendaVoteLayout>
          <ModuleVotes />
        </ReferendaVoteLayout>
      </ModuleTabProvider>
    </ReferendaLayout>
  );
}

export const getServerSideProps = withCommonProps(async () => {
  const [tracksProps, { result: referendaSummary }] = await Promise.all([
    fetchOpenGovTracksProps(),
    nextApi.fetch(gov2ReferendumsSummaryApi),
  ]);

  return {
    props: {
      referendaSummary: referendaSummary ?? {},
      ...tracksProps,
    },
  };
});
