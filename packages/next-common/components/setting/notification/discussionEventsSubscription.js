import { useUser } from "next-common/context/user";
import { Options } from "./styled";
import AccordionCard from "next-common/components/styled/containers/accordionCard";
import DiscussionOptions from "./discussionOptions";

export default function DiscussionEventsSubscription() {
  const loginUser = useUser();

  const isVerifiedUser = loginUser?.emailVerified;
  const telegramLinked = loginUser?.telegram?.chat;
  const disabled = !isVerifiedUser && !telegramLinked;

  return (
    <AccordionCard title="Discussions" defaultOpen={true}>
      <Options>
        <DiscussionOptions
          disabled={disabled}
          reply={!!loginUser?.notification?.reply}
          mention={!!loginUser?.notification?.mention}
        />
      </Options>
    </AccordionCard>
  );
}
