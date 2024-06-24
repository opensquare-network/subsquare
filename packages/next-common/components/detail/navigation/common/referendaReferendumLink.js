import React from "react";
import Link from "next/link";

export default function ReferendaReferendumLink({ referendumIndex }) {
  return (
    <Link href={`/referenda/${referendumIndex}`} legacyBehavior>
      {`Referendum #${referendumIndex}`}
    </Link>
  );
}
