import { Options } from "./styled";
import AccordionCard from "next-common/components/styled/containers/accordionCard";
import DiscussionOptions from "./discussionOptions";

export default function DiscussionEventsSubscription() {
  return (
    <AccordionCard title="Discussions" defaultOpen={true}>
      <Options>
        <DiscussionOptions />
      </Options>
    </AccordionCard>
  );
}
