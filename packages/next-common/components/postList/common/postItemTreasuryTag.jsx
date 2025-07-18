import React from "react";
import { TreasuryTag } from "next-common/components/tags/business";

export default function PostItemTreasuryTag({ isTreasury }) {
  if (!isTreasury) {
    return null;
  }
  return (
    <div>
      <TreasuryTag />
    </div>
  );
}
