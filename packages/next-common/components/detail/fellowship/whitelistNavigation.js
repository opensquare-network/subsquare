import React from "react";
import { useOnchainData } from "../../../context/post";
import { NavigationWrapper } from "../navigation/navigators";
import Link from "next/link";

export function ReferendumLink({ referendumIndex }) {
  return (
    <Link href={`/referenda/${referendumIndex}`}>
      {`Referenda #${referendumIndex}`}
    </Link>
  );
}

function OpenGovReferendum({ referendumIndex }) {
  return (
    <div>
      <ReferendumLink referendumIndex={referendumIndex} />
    </div>
  );
}

export default function FellowshipWhitelistNavigation() {
  const onchainData = useOnchainData();
  const { openGovReferenda = [] } = onchainData;

  if (openGovReferenda.length <= 0) {
    return null;
  }

  return (
    <NavigationWrapper>
      Executed by &nbsp;
      {openGovReferenda.map((openGovIndex) => (
        <OpenGovReferendum key={openGovIndex} referendumIndex={openGovIndex} />
      ))}
    </NavigationWrapper>
  );
}
