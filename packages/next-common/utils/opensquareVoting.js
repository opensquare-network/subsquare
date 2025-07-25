import { CHAIN } from "./constants";
import getChainSettings from "./consts/settings";

export const votingSpace = getChainSettings(CHAIN)?.openSquare?.voting;
export const votingHost = "https://voting.opensquare.io";
