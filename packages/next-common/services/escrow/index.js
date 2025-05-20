import { backendApi } from "../nextApi";
import BigNumber from "bignumber.js";

const apiUrl = "escrow/stats";

export async function fetchEscrow(decimals) {
  const { result: resp } = await backendApi.fetch(apiUrl);
  const totalSupply = resp.map((i) => ({
    time: i?.indexer?.blockTime,
    count: new BigNumber(i.totalSupply).div(Math.pow(10, decimals)),
  }));
  const totalStaked = resp.map((i) => ({
    time: i?.indexer?.blockTime,
    count: new BigNumber(i.totalStaked).div(Math.pow(10, decimals)),
  }));
  const totalAccount = resp.map((i) => ({
    time: i?.indexer?.blockTime,
    count: i.totalAccount,
  }));
  return {
    totalSupply,
    totalStaked,
    totalAccount,
  };
}
