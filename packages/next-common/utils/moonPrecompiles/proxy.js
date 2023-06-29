import { ethers } from "ethers";

const PROXY_ADDRESS = "0x000000000000000000000000000000000000080b";

const proxyAbi = ["function proxy(address real,address callTo,bytes callData)"];

export function encodeProxyData({ real, callTo, callData }) {
  const contractInterface = new ethers.Interface(proxyAbi);
  return {
    callTo: PROXY_ADDRESS,
    callData: contractInterface.encodeFunctionData("proxy", [
      real,
      callTo,
      callData,
    ]),
  };
}
