import React from "react";
import Malicious from "next-common/components/detail/malicious";

export default function MaliciousHead() {
  return (
    <Malicious>
      Warning: Malicious proposal! Some of the external links below have been
      flagged as scams.
    </Malicious>
  );
}
