import { useEffect, useState } from "react";
import nextApi from "next-common/services/nextApi";
import { normalizedNestedVote } from "next-common/store/reducers/referenda/votes/selectors";
import VotesInfoGroup from "next-common/components/popup/nestedVotesPopup/votesInfoGroup";
import StandardVoteTabs, { Aye, Nay } from "./standardVoteTabs";
import DelegationsList from "next-common/components/popup/nestedVotesPopup/delegationsList";
import { useModuleName } from "../common";

export function StandardVoteDetail({ vote }) {
  const module = useModuleName();
  const [tabIndex, setTabIndex] = useState(vote.aye ? Aye : Nay);
  const [delegations, setDelegations] = useState([]);

  useEffect(() => {
    const url = `${module === "referenda" ? "gov2" : module}/referendums/${
      vote?.referendumIndex
    }/delegation-votes`;
    nextApi
      .fetch(url, {
        target: vote?.account,
      })
      .then(({ result }) => {
        if (!result) return;
        setDelegations(result);
      });
  }, [vote?.referendumIndex, vote?.account, module]);

  const data = normalizedNestedVote(vote, delegations);

  return (
    <div className="flex flex-col gap-[24px]">
      <StandardVoteTabs
        tabIndex={tabIndex}
        setTabIndex={setTabIndex}
        isAye={vote.aye}
      />
      <VotesInfoGroup data={data} delegations={delegations} />
      <DelegationsList delegations={delegations} />
    </div>
  );
}
