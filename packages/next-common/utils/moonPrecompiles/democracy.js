import { ethers } from "ethers";

const DEMOCRACY_ADDRESS = "0x0000000000000000000000000000000000000803";

const democracyAbi = [
  "function delegate(address,uint256,uint256)",
  "function unDelegate()",
];

export async function encodeDelegateData({
  targetAddress,
  conviction,
  amount,
}) {
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

export async function encodeUnDelegateData() {
  const contractInterface = new ethers.Interface(democracyAbi);
  const callData = contractInterface.encodeFunctionData("unDelegate");
  return {
    callTo: DEMOCRACY_ADDRESS,
    callData,
  };
}
