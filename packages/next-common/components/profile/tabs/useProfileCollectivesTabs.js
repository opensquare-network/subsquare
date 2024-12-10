import { useChain } from "next-common/context/chain";
import { usePageProps } from "next-common/context/page";
import { isCollectivesChain } from "next-common/utils/chain";
import { useCollectivesContext } from "../../../context/collectives/collectives";
import { useCollectivesMemberContext } from "next-common/context/collectives/member";

export function useProfileCollectivesTabs() {
  const chain = useChain();
  const { id: address } = usePageProps();
  const { section } = useCollectivesContext();
  const { member } = useCollectivesMemberContext();

  if (!isCollectivesChain(chain)) {
    return [];
  }

  return [
    section === "fellowship" &&
      member && {
        label: "Fellowship",
        value: "fellowship",
        url: `/user/${address}/fellowship`,
        exactMatch: false,
      },
    section === "ambassador" &&
      member && {
        label: "Ambassador",
        value: "ambassador",
        url: `/user/${address}/ambassador`,
        exactMatch: false,
      },
  ].filter(Boolean);
}
