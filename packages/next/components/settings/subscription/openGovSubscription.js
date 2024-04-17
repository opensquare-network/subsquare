import ReferendaReferendumOptions from "next-common/components/setting/notification/referendaReferendumOptions";
import FellowshipReferendumOptions from "next-common/components/setting/notification/fellowshipReferendumOptions";
import { useChainSettings } from "next-common/context/chain";
import AccordionCard from "next-common/components/styled/containers/accordionCard";
import { Options } from "next-common/components/setting/notification/styled";

export default function OpenGovSubscription() {
  const {
    modules: { referenda: hasReferenda, fellowship: hasFellowship },
  } = useChainSettings();

  if (!hasFellowship && !hasReferenda) {
    return null;
  }

  return (
    <AccordionCard title="Open Gov" defaultOpen={true}>
      <Options>
        {hasReferenda && <ReferendaReferendumOptions />}
        {hasFellowship && <FellowshipReferendumOptions />}
      </Options>
    </AccordionCard>
  );
}
