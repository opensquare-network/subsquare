import React from "react";
import { PrimaryCard } from "./containers/primaryCard";

export default function CommentsWrapper({ children }) {
  return <PrimaryCard>{children}</PrimaryCard>;
}
