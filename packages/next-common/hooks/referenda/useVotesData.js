import BigNumber from "bignumber.js";
import { map } from "lodash-es";
import {
  allAyeDelegationVotesSelector,
  allAyeDirectVotesSelector,
  allNayDelegationVotesSelector,
  allNayDirectVotesSelector,
  allAbstainDelegationVotesSelector,
  allAbstainDirectVotesSelector,
} from "next-common/store/reducers/referenda/votes/selectors";
import { useSelector } from "react-redux";

function resolveData(delegationVotes = [], directVotes = []) {
  const delegatedCapitalValue = BigNumber.sum(
    ...map(delegationVotes, "balance"),
    0,
  );
  const delegatedVotesValue = BigNumber.sum(
    ...map(delegationVotes, "votes"),
    0,
  );

  const directCapitalValue = BigNumber.sum(...map(directVotes, "balance"), 0);
  const directVotesValue = BigNumber.sum(...map(directVotes, "votes"), 0);

  const totalCapitalValue = directCapitalValue.plus(delegatedCapitalValue);
  const totalVotesValue = directVotesValue.plus(delegatedVotesValue);

  return {
    delegationVotes,
    directVotes,

    delegationCapitalValue: delegatedCapitalValue.toString(),
    delegationVotesValue: delegatedVotesValue.toString(),
    directCapitalValue: directCapitalValue.toString(),
    directVotesValue: directVotesValue.toString(),
    totalCapitalValue: totalCapitalValue.toString(),
    totalVotesValue: totalVotesValue.toString(),
  };
}

export function useAyesVotesData() {
  const delegationVotes = useSelector(allAyeDelegationVotesSelector);
  const directVotes = useSelector(allAyeDirectVotesSelector);

  return resolveData(delegationVotes, directVotes);
}

export function useNaysVotesData() {
  const delegationVotes = useSelector(allNayDelegationVotesSelector);
  const directVotes = useSelector(allNayDirectVotesSelector);

  return resolveData(delegationVotes, directVotes);
}

export function useAbstainVotesData() {
  const delegationVotes = useSelector(allAbstainDelegationVotesSelector);
  const directVotes = useSelector(allAbstainDirectVotesSelector);

  return resolveData(delegationVotes, directVotes);
}
