import React, { useMemo } from "react";
import { MobileHiddenInfo } from "../styled";
import Tooltip from "next-common/components/tooltip";
import { SystemComment } from "@osn/icons/subsquare";
import Chains from "next-common/utils/consts/chains";
import { useChain } from "next-common/context/chain";
/**
 *
 * @param {data} param0
 * @returns kusama, kusamaPeople china get polkassemblyCommentsCount, other get commentsCount
 */
export default function PostItemCommentCount({ data }) {
  const currentChain = useChain();

  const commentsCount = useMemo(() => {
    if (
      [Chains.kusama, Chains.kusamaPeople].includes(currentChain) &&
      data.polkassemblyCommentsCount
    ) {
      return data.polkassemblyCommentsCount || 0;
    }
    return data.commentsCount || 0;
  }, [currentChain, data.commentsCount, data.polkassemblyCommentsCount]);

  return (
    <MobileHiddenInfo>
      <Tooltip
        content={`${commentsCount} comments`}
        className="flex cursor-pointer"
      >
        <SystemComment className="w-4 h-4 stroke-textTertiary [&_path]:stroke-2" />
        {commentsCount}
      </Tooltip>
    </MobileHiddenInfo>
  );
}
