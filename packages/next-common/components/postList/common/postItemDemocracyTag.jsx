import React from "react";
import { DemocracyTag } from "next-common/components/tags/business";

export default function PostItemDemocracyTag({ isDemocracy }) {
  if (!isDemocracy) {
    return null;
  }
  return (
    <div>
      <DemocracyTag />
    </div>
  );
}
