import {
  Democracy,
  ModuleTabProvider,
} from "next-common/components/profile/votingHistory/common";
import ModuleVotes from "components/myvotes/moduleVotes";
import DemocracyReferendaLayout from "next-common/components/layout/democracyLayout/referenda";
import { useUser } from "next-common/context/user";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { getServerSidePropsWithTracks } from "next-common/services/serverSide";
import { cn } from "next-common/utils";
import { Title } from "components/myvotes/styled";
import { ModuleTab } from "next-common/components/profile/votingHistory/common";

function DemocracyVoteLayout({ children }) {
  return (
    <ModuleTabProvider defaultTab={Democracy}>
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
    </ModuleTabProvider>
  );
}

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
      <DemocracyVoteLayout>
        <ModuleVotes />
      </DemocracyVoteLayout>
    </DemocracyReferendaLayout>
  );
}

export const getServerSideProps = getServerSidePropsWithTracks;
