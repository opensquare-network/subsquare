import { ethers } from "ethers";

const BATCH_ADDRESS = "0x0000000000000000000000000000000000000808";

const batchAbi = [
  "function batchAll(address[] to,uint256[] value,bytes[] callData,uint64[] gasLimit)",
];

export function encodeBatchAllData({ to, value, callData, gasLimit }) {
  const contractInterface = new ethers.Interface(batchAbi);
  return {
    callTo: BATCH_ADDRESS,
    callData: contractInterface.encodeFunctionData("batchAll", [
      to,
      value,
      callData,
      gasLimit,
    ]),
  };
}
