import * as React from "react";
import Identicon from "@polkadot/react-identicon";

export default function Avatar({ address, size = 24 }) {
  const theme = "kusama";
  return <Identicon value={address} size={size} theme={theme} />;
}
