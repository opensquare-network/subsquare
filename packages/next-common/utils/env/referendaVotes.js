import getChainSettings from "../consts/settings";

export function hasReferendaVotesGraphQL() {
  const { subsquareGraphql } = getChainSettings(process.env.NEXT_PUBLIC_CHAIN);
  return subsquareGraphql?.intime?.referendaVotes;
}
