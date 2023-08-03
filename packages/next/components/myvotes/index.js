import {
  Democracy,
  Referenda,
} from "next-common/components/profile/votingHistory/common";
import { useChainSettings } from "next-common/context/chain";
import { useState } from "react";
import MyOpenGovVotes from "./myOpenGovVotes";
import MyDemocracyVotes from "./myDemocracyVotes";

export default function MyVotes() {
  const { hasReferenda } = useChainSettings();
  const [moduleTabIndex, setModuleTabIndex] = useState(
    hasReferenda ? Referenda : Democracy,
  );

  return moduleTabIndex === Referenda ? (
    <MyOpenGovVotes
      moduleTabIndex={moduleTabIndex}
      setModuleTabIndex={setModuleTabIndex}
    />
  ) : (
    <MyDemocracyVotes
      moduleTabIndex={moduleTabIndex}
      setModuleTabIndex={setModuleTabIndex}
    />
  );
}
