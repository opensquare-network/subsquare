import React from "react";
import Link from "next-common/components/link";

export default function ReferendaReferendumLink({ referendumIndex }) {
  return (
    <Link href={`/referenda/${referendumIndex}`}>
      {`Referendum #${referendumIndex}`}
    </Link>
  );
}
