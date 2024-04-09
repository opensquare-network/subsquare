import React from "react";
import FieldLoading from "next-common/components/icons/fieldLoading";

export default function LoadableContent({ isLoading = false, size, children }) {
  if (isLoading) {
    return <FieldLoading size={size} />;
  }

  return <>{children}</>;
}
