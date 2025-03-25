import { decodeInput } from "next-common/utils/evm/decodeInput";
import { useAsync } from "react-use";

export function useDecodeEvmInput(input, contractAddress) {
  return useAsync(async () => {
    return decodeInput(input, contractAddress);
  });
}
