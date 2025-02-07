import Loading from "next-common/components/loading";
import {
  InfoMessage,
  WarningMessage,
} from "next-common/components/setting/styled";
import { AddressUser } from "next-common/components/user";
import { useCollectivesSection } from "next-common/context/collectives/collectives";

export function ReferendaWarningMessage({ isLoading, relatedReferenda }) {
  const section = useCollectivesSection();

  if (isLoading) {
    return (
      <div className="flex justify-center py-[12px]">
        <Loading size={20} />
      </div>
    );
  }

  if (relatedReferenda.length === 0) {
    return null;
  }

  return (
    <WarningMessage>
      There is a{" "}
      <a
        className="underline"
        target="_blank"
        rel="noreferrer"
        href={`/${section}/referenda/${relatedReferenda[0].referendumIndex}`}
      >
        referendum #{relatedReferenda[0].referendumIndex}
      </a>{" "}
      currently in progress
    </WarningMessage>
  );
}

export function ReferendaActionMessage({ rank, who, trackName, action = "" }) {
  if (!rank || !who) {
    return null;
  }

  return (
    <InfoMessage className="flex-wrap gap-x-2">
      Will create a referendum in {trackName} track to {action}
      <AddressUser add={who} />
    </InfoMessage>
  );
}
