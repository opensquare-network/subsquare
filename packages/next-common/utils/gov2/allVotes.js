import {
  objectSpread,
  sortVotesWithConviction,
} from "../democracy/votes/passed/common";
const { encodeAddress } = require("@polkadot/util-crypto");

// votingFor storage: (account, trackId, votingOf)
// key u8a[] composition: section + method = 32; account twox64 hash = 8, account = 32;
/**
 * key u8a[] composition:
 * section + method = 32;
 * account twox64 hash = 8, account = 32;
 * trackId twox64 hash = 8, trackId(u16) = 2;
 *
 * total: 32 + 40 + 10 = 82;
 * 42
 */

function extractAddressAndTrackId(storageKey = [], api) {
  const sectionRemoved = storageKey.slice(32);
  const accountHashRemoved = sectionRemoved.slice(8);
  const accountU8a = accountHashRemoved.slice(0, 32);

  const accountRemoved = accountHashRemoved.slice(32);
  const classIdU8a = accountRemoved.slice(8);

  const address = encodeAddress(accountU8a, api.registry.chainSS58);
  const trackId = api.registry.createType("U16", classIdU8a).toNumber();

  return {
    address,
    trackId,
  };
}

function normalizeVotingOfEntry([storageKey, voting], blockApi) {
  const { address, trackId } = extractAddressAndTrackId(storageKey, blockApi);
  return { account: address, trackId, voting };
}

function extractVotes(mapped, targetReferendumIndex) {
  return mapped
    .filter(({ voting }) => voting.isCasting)
    .map(({ account, voting }) => {
      return {
        account,
        votes: voting.asCasting.votes.filter(([idx]) =>
          idx.eq(targetReferendumIndex)
        ),
      };
    })
    .filter(({ votes }) => votes.length > 0)
    .map(({ account, votes }) => {
      return {
        account,
        vote: votes[0][1],
      };
    })
    .reduce((result, { account, vote }) => {
      // FIXME We are ignoring split votes
      if (vote.isStandard) {
        const standard = vote.asStandard;
        const balance = standard.balance.toBigInt().toString();

        result.push(
          objectSpread(
            {
              account,
              isDelegating: false,
            },
            {
              balance,
              aye: standard.vote.isAye,
              conviction: standard.vote.conviction.toNumber(),
            }
          )
        );
      }

      return result;
    }, []);
}

function extractDelegations(mapped, track, directVotes = [], blockApi) {
  const delegations = mapped
    .filter(({ trackId, voting }) => voting.isDelegating && trackId === track)
    .map(({ account, voting }) => {
      return {
        account,
        delegating: voting.asDelegating,
      };
    });

  let newVotes = [];
  delegations.forEach(
    ({ account, delegating: { balance, conviction, target } }) => {
      const toDelegator = delegations.find(
        ({ account }) => account === target.toString()
      );
      const to = directVotes.find(
        ({ account }) =>
          account === (toDelegator ? toDelegator.account : target.toString())
      );

      if (to) {
        newVotes.push({
          account,
          balance: balance.toBigInt().toString(),
          isDelegating: true,
          aye: to.aye,
          conviction: conviction.toNumber(),
        });
      }
    }
  );

  return newVotes;
}

export async function getGov2ReferendumVotesFromVotingOf(
  blockApi,
  trackId,
  referendumIndex
) {
  const voting = await blockApi.query.convictionVoting.votingFor.entries();
  const mapped = voting.map((item) => normalizeVotingOfEntry(item, blockApi));

  const directVotes = extractVotes(mapped, referendumIndex, blockApi);
  const votesViaDelegating = extractDelegations(
    mapped,
    trackId,
    directVotes,
    blockApi
  );
  const sorted = sortVotesWithConviction([
    ...directVotes,
    ...votesViaDelegating,
  ]);

  const allAye = sorted.filter((v) => v.aye);
  const allNay = sorted.filter((v) => !v.aye);
  return { allAye, allNay };
}
