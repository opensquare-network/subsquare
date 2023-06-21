import { ethers } from "ethers";

const TREASURY_COUNCIL_ADDRESS = "0x0000000000000000000000000000000000000810";

const treasuryCouncilAbi = ["function vote(bytes32 proposalHash,uint32 proposalIndex,bool approve)"];

export function encodeVoteData({ proposalHash, proposalIndex, approve }) {
  const contractInterface = new ethers.Interface(treasuryCouncilAbi);
  return {
    callTo: TREASURY_COUNCIL_ADDRESS,
    callData: contractInterface.encodeFunctionData("vote", [
      proposalHash,
      proposalIndex,
      approve,
    ]),
  };
}
