import { ethers } from "ethers";

const COUNCIL_ADDRESS = "0x000000000000000000000000000000000000080e";

const councilAbi = ["function vote(bytes32 proposalHash,uint32 proposalIndex,bool approve)"];

export function encodeVoteData({ proposalHash, proposalIndex, approve }) {
  const contractInterface = new ethers.Interface(councilAbi);
  return {
    callTo: COUNCIL_ADDRESS,
    callData: contractInterface.encodeFunctionData("vote", [
      proposalHash,
      proposalIndex,
      approve,
    ]),
  };
}
