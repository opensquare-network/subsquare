import useSubStorage from "next-common/hooks/common/useSubStorage";

export function usePoolMetadata(poolId) {
  const { result: metadata, loading } = useSubStorage(
    "nominationPools",
    "metadata",
    [poolId],
  );

  return { name: decodeText(metadata?.toHuman()), loading };
}

function decodeText(input) {
  if (input && input.startsWith("0x")) {
    return hexToText(input);
  }

  return input;
}

function hexToText(hex) {
  if (!hex) {
    return "";
  }

  const hexString = hex.slice(2);

  let bytes = [];
  for (let i = 0; i < hexString.length; i += 2) {
    bytes.push(parseInt(hexString.substr(i, 2), 16));
  }

  let decodedString = new TextDecoder("utf-8").decode(new Uint8Array(bytes));
  return decodedString;
}
