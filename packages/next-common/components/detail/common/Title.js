import React from "react";
import { isNil } from "lodash-es";
import { usePost, usePostTitle } from "../../../context/post";
import { useSelector } from "react-redux";
import { isEditingPostSelector } from "next-common/store/reducers/userSlice";
import { cn } from "next-common/utils";

export default function PostTitle() {
  const post = usePost();
  const title = usePostTitle();
  const index = post.index || post.motionIndex;
  const isEditing = useSelector(isEditingPostSelector);

  return (
    <h1 className="text-textPrimary text20Bold overflow-hidden">
      {!isNil(index) && (
        <>
          <span>{`#${index}`}</span>
          <span className="text-textTertiary mx-2">·</span>
        </>
      )}
      <span className={cn(isEditing && "!text-textDisabled select-none")}>
        {title}
      </span>
    </h1>
  );
}
