import { useEffect, useState } from "react";
import nextApi from "next-common/services/nextApi";
import { normalizedNestedVote } from "next-common/store/reducers/referenda/votes/selectors";
import VotesInfoGroup from "next-common/components/popup/nestedVotesPopup/votesInfoGroup";
import StandardVoteTabs, { Aye, Nay } from "./standardVoteTabs";
import DelegationsList from "next-common/components/popup/nestedVotesPopup/delegationsList";
import { useModuleName } from "../common";

export function StandardVoteDetail({ vote }) {
  const moduleName = useModuleName();
  const [tabIndex, setTabIndex] = useState(vote.aye ? Aye : Nay);
  const [delegations, setDelegations] = useState([]);

  useEffect(() => {
    const url = `${
      moduleName === "referenda" ? "gov2" : moduleName
    }/referendums/${vote?.referendumIndex}/delegation-votes`;
    nextApi
      .fetch(url, {
        target: vote?.account,
      })
      .then(({ result }) => {
        if (!result) return;
        setDelegations(result);
      });
  }, [vote?.referendumIndex, vote?.account, moduleName]);

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
