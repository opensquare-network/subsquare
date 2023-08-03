import {
  Democracy,
  OpenGov,
} from "next-common/components/profile/votingHistory/common";
import { useChainSettings } from "next-common/context/chain";
import { useState } from "react";
import MyOpenGovVotes from "./myOpenGovVotes";
import MyDemocracyVotes from "./myDemocracyVotes";

export default function MyVotes() {
  const { hasReferenda } = useChainSettings();
  const [moduleTabIndex, setModuleTabIndex] = useState(
    hasReferenda ? OpenGov : Democracy,
  );

  return moduleTabIndex === OpenGov ? (
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
