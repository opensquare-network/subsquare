import React from "react";
import LoadingV2 from "../loadingV2";

export function LightLoading() {
  return <LoadingV2 size={24} color={"#ffffff"} />;
}

export function DarkLoading() {
  return <LoadingV2 size={24} color={"var(--theme300)"} />;
}
