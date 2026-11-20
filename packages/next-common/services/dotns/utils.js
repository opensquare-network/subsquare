import { concat, keccak256, toHex } from "viem";

/**
 * dotNS names sit under the dotNS TLD, so a second level node is
 * keccak256(tldNode ++ keccak256(label)).
 */
export function getDotnsNameNode(tldNode, label) {
  return keccak256(concat([tldNode, keccak256(toHex(label))]));
}

export function stripTld(label, tld) {
  const lowerLabel = label.toLowerCase();
  const lowerTld = (tld || "").toLowerCase();
  return lowerTld && lowerLabel.endsWith(lowerTld)
    ? label.slice(0, -tld.length)
    : label;
}
