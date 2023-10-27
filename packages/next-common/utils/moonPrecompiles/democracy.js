import { ethers } from "ethers";

const DEMOCRACY_ADDRESS = "0x0000000000000000000000000000000000000803";

const democracyAbi = [
  "function delegate(address,uint256,uint256)",
  "function unDelegate()",
  "function second(uint256 propIndex, uint256 secondsUpperBound)",
  "function standardVote(uint256 refIndex,bool aye,uint256 voteAmount,uint256 conviction)",
  "function removeVote(uint256 refIndex)",
  "function unlock(address target)",
];

export function encodeDelegateData({ targetAddress, conviction, amount }) {
  const contractInterface = new ethers.Interface(democracyAbi);
  const callData = contractInterface.encodeFunctionData("delegate", [
    targetAddress,
    conviction,
    amount,
  ]);
  return {
    callTo: DEMOCRACY_ADDRESS,
    callData,
  };
}

export function encodeUnDelegateData() {
  const contractInterface = new ethers.Interface(democracyAbi);
  const callData = contractInterface.encodeFunctionData("unDelegate");
  return {
    callTo: DEMOCRACY_ADDRESS,
    callData,
  };
}

export function encodeSecondData({ propIndex, secondsUpperBound }) {
  const contractInterface = new ethers.Interface(democracyAbi);
  const callData = contractInterface.encodeFunctionData("second", [
    propIndex,
    secondsUpperBound,
  ]);
  return {
    callTo: DEMOCRACY_ADDRESS,
    callData,
  };
}

export function encodeStandardVoteData({
  refIndex,
  aye,
  voteAmount,
  conviction,
}) {
  const contractInterface = new ethers.Interface(democracyAbi);
  const callData = contractInterface.encodeFunctionData("standardVote", [
    refIndex,
    aye,
    voteAmount,
    conviction,
  ]);
  return {
    callTo: DEMOCRACY_ADDRESS,
    callData,
  };
}

export function encodeRemoveVoteData({ refIndex }) {
  const contractInterface = new ethers.Interface(democracyAbi);
  const callData = contractInterface.encodeFunctionData("removeVote", [
    refIndex,
  ]);
  return {
    callTo: DEMOCRACY_ADDRESS,
    callData,
  };
}

export function encodeUnlockData({ targetAddress }) {
  const contractInterface = new ethers.Interface(democracyAbi);
  const callData = contractInterface.encodeFunctionData("unlock", [
    targetAddress,
  ]);
  return {
    callTo: DEMOCRACY_ADDRESS,
    callData,
  };
}
