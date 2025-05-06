import React from "react";
import Info from "../../styled/info";
import { usePost } from "../../../context/post";
import { SystemActivity } from "@osn/icons/subsquare";
import { formatTimeAgo } from "next-common/utils/viewfuncs/formatTimeAgo";
import Tooltip from "next-common/components/tooltip";
import { getPostLastActivityAt } from "next-common/utils/viewfuncs/postUpdatedTime";

export default function UpdatedTime() {
  const post = usePost();
  const postUpdatedTime = getPostLastActivityAt(post);

  if (!postUpdatedTime) {
    return null;
  }

  const timeAgo = formatTimeAgo(postUpdatedTime);
  const createAgo = formatTimeAgo(post.createdAt);

  return (
    <Info>
      <Tooltip
        className="flex cursor-pointer"
        content={
          <div className="text12Medium">
            <ul className=" list-disc list-inside ">
              <li>Created at {createAgo}</li>
              <li>Latest activity at {timeAgo}</li>
            </ul>
          </div>
        }
      >
        <SystemActivity className="w-4 h-4 stroke-textTertiary [&_path]:stroke-2" />
        <span>{timeAgo}</span>
      </Tooltip>
    </Info>
  );
}
