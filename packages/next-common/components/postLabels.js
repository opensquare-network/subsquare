import React from "react";
import LinkLabels from "./linkLabels";

export default function PostLabels({ labels = [] }) {
  if (!labels || labels.length <= 0) {
    return null;
  }

  return (
    <LinkLabels
      labels={labels.map((label) => ({
        label,
        link: `/discussions?label=${encodeURIComponent(label)}`,
      }))}
    />
  );
}
