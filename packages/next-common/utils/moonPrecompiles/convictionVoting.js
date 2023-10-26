import { ethers } from "ethers";

const CONVICTION_VOTING_ADDRESS = "0x0000000000000000000000000000000000000812";

const convictionVotingAbi = [
  "function delegate(uint16 trackId,address representative,uint8 conviction,uint256 amount)",
  "function undelegate(uint16 trackId)",
  "function voteYes(uint32 pollIndex,uint256 voteAmount,uint8 conviction)",
  "function voteNo(uint32 pollIndex,uint256 voteAmount,uint8 conviction)",
  "function voteSplit(uint32 pollIndex, uint256 aye, uint256 nay)",
  "function voteSplitAbstain(uint32 pollIndex,uint256 aye,uint256 nay,uint256 abstain)",
  "function removeVote(uint32 pollIndex)",
  "function removeVoteForTrack(uint32 pollIndex, uint16 trackId)",
  "function unlock(uint16 trackId, address target)",
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

export function encodeVoteYesData({ pollIndex, voteAmount, conviction }) {
  const contractInterface = new ethers.Interface(convictionVotingAbi);
  const callData = contractInterface.encodeFunctionData("voteYes", [
    pollIndex,
    voteAmount,
    conviction,
  ]);
  return {
    callTo: CONVICTION_VOTING_ADDRESS,
    callData,
  };
}

export function encodeVoteNoData({ pollIndex, voteAmount, conviction }) {
  const contractInterface = new ethers.Interface(convictionVotingAbi);
  const callData = contractInterface.encodeFunctionData("voteNo", [
    pollIndex,
    voteAmount,
    conviction,
  ]);
  return {
    callTo: CONVICTION_VOTING_ADDRESS,
    callData,
  };
}

export function encodeVoteSplitData({ pollIndex, aye, nay }) {
  const contractInterface = new ethers.Interface(convictionVotingAbi);
  const callData = contractInterface.encodeFunctionData("voteSplit", [
    pollIndex,
    aye,
    nay,
  ]);
  return {
    callTo: CONVICTION_VOTING_ADDRESS,
    callData,
  };
}

export function encodeVoteSplitAbstainData({ pollIndex, aye, nay, abstain }) {
  const contractInterface = new ethers.Interface(convictionVotingAbi);
  const callData = contractInterface.encodeFunctionData("voteSplitAbstain", [
    pollIndex,
    aye,
    nay,
    abstain,
  ]);
  return {
    callTo: CONVICTION_VOTING_ADDRESS,
    callData,
  };
}

export function encodeRemoveVoteData({ pollIndex }) {
  const contractInterface = new ethers.Interface(convictionVotingAbi);
  const callData = contractInterface.encodeFunctionData("removeVote", [
    pollIndex,
  ]);
  return {
    callTo: CONVICTION_VOTING_ADDRESS,
    callData,
  };
}

export function encodeRemoveVoteForTrackData({ pollIndex, trackId }) {
  const contractInterface = new ethers.Interface(convictionVotingAbi);
  const callData = contractInterface.encodeFunctionData("removeVoteForTrack", [
    pollIndex,
    trackId,
  ]);
  return {
    callTo: CONVICTION_VOTING_ADDRESS,
    callData,
  };
}

export function encodeUnlockData({ trackId, targetAddress }) {
  const contractInterface = new ethers.Interface(convictionVotingAbi);
  const callData = contractInterface.encodeFunctionData("unlock", [
    trackId,
    targetAddress,
  ]);
  return {
    callTo: CONVICTION_VOTING_ADDRESS,
    callData,
  };
}
