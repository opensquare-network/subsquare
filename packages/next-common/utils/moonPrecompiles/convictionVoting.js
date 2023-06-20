import { ethers } from "ethers";

const CONVICTION_VOTING_ADDRESS = "0x0000000000000000000000000000000000000812";

const convictionVotingAbi = [
  "function delegate(uint16 trackId,address representative,uint8 conviction,uint256 amount)",
  "function undelegate(uint16 trackId)",
];

export function encodeDelegateData({
  trackId,
  targetAddress,
  conviction,
  amount,
}) {
  const contractInterface = new ethers.Interface(convictionVotingAbi);
  const callData = contractInterface.encodeFunctionData("delegate", [
    trackId,
    targetAddress,
    conviction,
    amount,
  ]);
  return {
    callTo: CONVICTION_VOTING_ADDRESS,
    callData,
  };
}

export function encodeUnDelegateData({ trackId }) {
  const contractInterface = new ethers.Interface(convictionVotingAbi);
  const callData = contractInterface.encodeFunctionData("undelegate", [
    trackId,
  ]);
  return {
    callTo: CONVICTION_VOTING_ADDRESS,
    callData,
  };
}
