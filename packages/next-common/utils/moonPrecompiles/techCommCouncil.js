import { ethers } from "ethers";

const TECH_COMM_COUNCIL_ADDRESS = "0x000000000000000000000000000000000000080F";

const techCommCouncilAbi = ["function vote(bytes32 proposalHash,uint32 proposalIndex,bool approve)"];

export function encodeVoteData({ proposalHash, proposalIndex, approve }) {
  const contractInterface = new ethers.Interface(techCommCouncilAbi);
  return {
    callTo: TECH_COMM_COUNCIL_ADDRESS,
    callData: contractInterface.encodeFunctionData("vote", [
      proposalHash,
      proposalIndex,
      approve,
    ]),
  };
}
