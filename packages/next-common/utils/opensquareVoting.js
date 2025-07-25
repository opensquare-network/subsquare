import { CHAIN } from "./constants";
import getChainSettings from "./consts/settings";

// voting config
export const votingSpace = getChainSettings(CHAIN)?.openSquare?.voting;
export const votingHost = "https://voting.opensquare.io";

// bounties config
export const bountiesApi = "https://bounties-api.opensquare.io/";
