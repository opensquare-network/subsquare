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

function resolve(delegationVotes = [], directVotes = []) {
  const delegatedCapitalValue = BigNumber.sum(
    ...map(delegationVotes, "balance"),
    0,
  );
  const delegatedVotesValue = BigNumber.sum(
    ...map(delegationVotes, "votes"),
    0,
  );

  const directCapitalValue = BigNumber.sum(...map(directVotes, "balance"), 0);
  const directVotesvalue = BigNumber.sum(...map(directVotes, "votes"), 0);

  const totalCapitalValue = directCapitalValue.plus(delegatedCapitalValue);
  const totalVotesValue = directVotesvalue.plus(delegatedVotesValue);

  return {
    delegationVotes,
    directVotes,

    delegationCapitalValue: delegatedCapitalValue.toString(),
    delegationVotesValue: delegatedVotesValue.toString(),
    directCapitalValue: directCapitalValue.toString(),
    directVotesValue: directVotesvalue.toString(),
    totalCapitalValue: totalCapitalValue.toString(),
    totalVotesValue: totalVotesValue.toString(),
  };
}

export function useAyesVotesData() {
  const delegationVotes = useSelector(allAyeDelegationVotesSelector);
  const directVotes = useSelector(allAyeDirectVotesSelector);

  return resolve(delegationVotes, directVotes);
}

export function useNaysVotesData() {
  const delegationVotes = useSelector(allNayDelegationVotesSelector);
  const directVotes = useSelector(allNayDirectVotesSelector);

  return resolve(delegationVotes, directVotes);
}

export function useAbstainVotesData() {
  const delegationVotes = useSelector(allAbstainDelegationVotesSelector);
  const directVotes = useSelector(allAbstainDirectVotesSelector);

  return resolve(delegationVotes, directVotes);
}
