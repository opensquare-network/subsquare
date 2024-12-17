import React from "react";
import Link from "next/link";

export default function DemocracyReferendumLink({ referendumIndex }) {
  return (
    <Link href={`/democracy/referenda/${referendumIndex}`} legacyBehavior>
      {`Referendum #${referendumIndex}`}
    </Link>
  );
}
