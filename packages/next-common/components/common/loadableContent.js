import React from "react";
import FieldLoading from "next-common/components/icons/fieldLoading";
import Loading from "next-common/components/loading";

export const LoadStyles = Object.freeze({
  FIELD: "FIELD",
  CIRCLE: "CIRCLE",
});

export default function LoadableContent({
  isLoading = false,
  size,
  children,
  style = LoadStyles.FIELD,
}) {
  if (!isLoading) {
    return <>{children}</>;
  }

  if (style === LoadStyles.CIRCLE) {
    return <Loading size={size} />;
  }

  return <FieldLoading size={size} />;
}
