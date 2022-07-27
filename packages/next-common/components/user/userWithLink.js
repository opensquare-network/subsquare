import React from "react";
import Flex from "../styled/flex";
import User from "./index";
import Links from "../links";

export default function UserWithLink({ address, chain }) {
  return (
    <Flex>
      <User chain={chain} add={address} fontSize={14} />
      <Links chain={chain} address={address} style={{ marginLeft: 8 }} />
    </Flex>
  );
}
