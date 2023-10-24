import TreasuryProposalOptions from "next-common/components/setting/notification/treasuryProposalOptions";
import TechCommMotionOptions from "next-common/components/setting/notification/techCommMotionOptions";
import DemocracyProposalOptions from "next-common/components/setting/notification/democracyProposalOptions";
import DemocracyReferendumOptions from "next-common/components/setting/notification/democracyReferendumOptions";
import { Options } from "next-common/components/setting/notification/styled";
import AccordionCard from "next-common/components/styled/containers/accordionCard";

export default function OnChainEventsSubscription() {
  return (
    <>
      <AccordionCard title="Treasury" defaultOpen={true}>
        <Options>
          <TreasuryProposalOptions />
        </Options>
      </AccordionCard>
      <AccordionCard title="Tech-Comm." defaultOpen={true}>
        <Options>
          <TechCommMotionOptions />
        </Options>
      </AccordionCard>
      <AccordionCard title="Democracy" defaultOpen={true}>
        <Options>
          <DemocracyProposalOptions />
          <DemocracyReferendumOptions />
        </Options>
      </AccordionCard>
    </>
  );
}
