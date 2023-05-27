import React from "react";
import { usePost } from "../../../context/post";
import PostLabels from "../../postLabels";

export default function DetailLabels() {
  const post = usePost();
  return <PostLabels labels={ post.labels } />;
}
