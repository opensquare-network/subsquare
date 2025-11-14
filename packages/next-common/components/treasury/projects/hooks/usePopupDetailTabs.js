import { useMemo } from "react";
import ProjectProposalsList from "../projectDetailPopup/proposalsList";
import ProjectSpendsList from "../projectDetailPopup/spendsList";
import useProposals from "./useProposals";
import useSpends from "./useSpends";

export const TAB_VALUES = {
  proposals: "proposals",
  spends: "spends",
};

export default function usePopupDetailTabs({ proposalList, spendList }) {
  const { proposalIndexes, spendIndexes } = useFormatIndexes({
    proposalList,
    spendList,
  });

  const { proposals, loading: proposalsLoading } =
    useProposals(proposalIndexes);
  const { spends, loading: spendsLoading } = useSpends(spendIndexes);

  const normalizedProposals = useMemo(() => {
    const proportionMap = new Map(
      proposalList.map((p) => [p.id, p.proportion]),
    );
    return proposals.map((proposal) => ({
      ...proposal,
      proportion: proportionMap.get(proposal.proposalIndex) ?? 1,
    }));
  }, [proposals, proposalList]);

  const normalizedSpends = useMemo(() => {
    const proportionMap = new Map(spendList.map((s) => [s.id, s.proportion]));
    return spends.map((spend) => ({
      ...spend,
      proportion: proportionMap.get(spend.index) ?? 1,
    }));
  }, [spends, spendList]);

  const tabs = useMemo(
    () => [
      {
        value: TAB_VALUES.proposals,
        label: "Proposals",
        activeCount: normalizedProposals?.length,
        content: (
          <ProjectProposalsList
            proposals={normalizedProposals}
            loading={proposalsLoading}
            proposalList={proposalList}
          />
        ),
      },
      {
        value: TAB_VALUES.spends,
        label: "Spends",
        activeCount: normalizedSpends?.length,
        content: (
          <ProjectSpendsList
            spends={normalizedSpends}
            loading={spendsLoading}
            spendList={spendList}
          />
        ),
      },
    ],
    [
      normalizedProposals,
      normalizedSpends,
      proposalsLoading,
      spendsLoading,
      proposalList,
      spendList,
    ],
  );

  return {
    tabs,
    proposals: normalizedProposals,
    spends: normalizedSpends,
    proposalsLoading,
    spendsLoading,
    proposalIndexes,
    spendIndexes,
  };
}

function useFormatIndexes({ proposalList, spendList }) {
  return useMemo(() => {
    return {
      proposalIndexes: proposalList.map((proposal) => proposal.id),
      spendIndexes: spendList.map((spend) => spend.id),
    };
  }, [proposalList, spendList]);
}
