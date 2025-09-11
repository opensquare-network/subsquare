import { isSameAddress } from "next-common/utils";
import { calcVotes } from "next-common/utils/democracy/votes/passed/common";

export default function extractDelegations(mapped, track, directVotes = []) {
  const delegations = mapped
    .filter(({ trackId, voting }) => voting.isDelegating && trackId === track)
    .map(({ account, voting }) => {
      return {
        account,
        delegating: voting.asDelegating,
      };
    });

  return delegations.reduce(
    (result, { account, delegating: { balance, conviction, target } }) => {
      const to = directVotes.find(
        ({ account, isStandard }) =>
          isSameAddress(account, target.toString()) && isStandard,
      );
      if (!to) {
        return result;
      }

      return [
        ...result,
        {
          account,
          target: target.toString(),
          balance: balance.toBigInt().toString(),
          isDelegating: true,
          aye: to.aye,
          conviction: conviction.toNumber(),
          votes: calcVotes(
            balance.toBigInt().toString(),
            conviction.toNumber(),
          ),
        },
      ];
    },
    [],
  );
}
