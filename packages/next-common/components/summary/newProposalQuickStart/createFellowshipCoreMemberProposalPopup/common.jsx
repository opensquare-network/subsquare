import { WarningMessage } from "next-common/components/setting/styled";
import { useCollectivesSection } from "next-common/context/collectives/collectives";

export function ReferendaWarningMessage({ referendumIndex }) {
  const section = useCollectivesSection();
  return (
    <WarningMessage>
      There is a{" "}
      <a
        className="underline"
        target="_blank"
        rel="noreferrer"
        href={`/${section}/referenda/${referendumIndex}`}
      >
        referendum #{referendumIndex}
      </a>{" "}
      currently in progress
    </WarningMessage>
  );
}
