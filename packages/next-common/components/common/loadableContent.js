import FieldLoading from "next-common/components/icons/fieldLoading";
import React from "react";

export default function LoadableContent({ isLoading = false, children }) {
  if (isLoading) {
    return <FieldLoading />;
  }

  return <>{children}</>;
}
