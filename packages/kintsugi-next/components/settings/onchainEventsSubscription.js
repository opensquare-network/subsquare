import TreasuryProposalOptions from "next-common/components/setting/notification/treasuryProposalOptions";
import TechCommMotionOptions from "next-common/components/setting/notification/techCommMotionOptions";
import DemocracyProposalOptions from "next-common/components/setting/notification/democracyProposalOptions";
import DemocracyReferendumOptions from "next-common/components/setting/notification/democracyReferendumOptions";
import { Options } from "next-common/components/setting/notification/styled";
import { useUser } from "next-common/context/user";
import { usePageProps } from "next-common/context/page";
import AccordionCard from "next-common/components/styled/containers/accordionCard";

export default function OnChainEventsSubscription() {
  const loginUser = useUser();
  const { subscription } = usePageProps();

  const isVerifiedUser = loginUser?.emailVerified;
  const telegramLinked = loginUser?.telegram?.chat;
  const disabled = !isVerifiedUser && !telegramLinked;

  return (
    <>
      <AccordionCard title="Treasury" defaultOpen={true}>
        <Options>
          <TreasuryProposalOptions
            disabled={disabled}
            treasuryProposalProposed={subscription?.treasuryProposalProposed}
            treasuryProposalApproved={subscription?.treasuryProposalApproved}
            treasuryProposalAwarded={subscription?.treasuryProposalAwarded}
            treasuryProposalRejected={subscription?.treasuryProposalRejected}
          />
        </Options>
      </AccordionCard>
      <AccordionCard title="Tech-Comm." defaultOpen={true}>
        <Options>
          <TechCommMotionOptions
            isKintsugi={true}
            disabled={disabled}
            tcMotionExecuted={subscription?.tcMotionExecuted}
          />
        </Options>
      </AccordionCard>
      <AccordionCard title="Democracy" defaultOpen={true}>
        <Options>
          <DemocracyProposalOptions
            disabled={disabled}
            democracyProposalProposed={subscription?.democracyProposalProposed}
            democracyProposalCanceled={subscription?.democracyProposalCanceled}
          />
          <DemocracyReferendumOptions
            isKintsugi={true}
            disabled={disabled}
            democracyReferendumStarted={
              subscription?.democracyReferendumStarted
            }
            democracyReferendumPassed={subscription?.democracyReferendumPassed}
            democracyReferendumNotPassed={
              subscription?.democracyReferendumNotPassed
            }
            democracyReferendumCancelled={
              subscription?.democracyReferendumCancelled
            }
            democracyReferendumExecuted={
              subscription?.democracyReferendumExecuted
            }
            democracyReferendumNotExecuted={
              subscription?.democracyReferendumNotExecuted
            }
            democracyReferendumFastTrack={
              subscription?.democracyReferendumFastTrack
            }
          />
        </Options>
      </AccordionCard>
    </>
  );
}
