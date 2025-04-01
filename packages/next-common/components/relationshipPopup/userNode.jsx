import { Handle, Position } from "@xyflow/react";
import {
  DisplayUser,
  DisplayUserAddress,
  DisplayUserAvatar,
} from "next-common/components/profile/bio";
import Tooltip from "next-common/components/tooltip";
import { cn } from "next-common/utils";
import Link from "next/link";
import styled from "styled-components";

const NodeWrap = styled.div`
  box-shadow: var(--shadow100);
`;

export default function UserNode({ data }) {
  if (!data?.address) {
    return null;
  }
  return (
    <NodeWrap className="bg-neutral100 p-3 rounded-xl border border-neutral300 flex gap-x-3 w-60">
      <DisplayUserAvatar address={data?.address} user={{}} size={40} />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <DisplayUser id={data?.address} className={cn("flex text14Medium")} />
          {data.isPure && (
            <Tooltip
              content={
                <Link
                  className="underline relative z-20"
                  style={{ pointerEvents: "all" }}
                  href="https://wiki.polkadot.network/learn/learn-proxies-pure/"
                  target="_blank"
                >
                  Pure Proxy↗
                </Link>
              }
            >
              <span className="inline-block h-5 leading-5 bg-neutral200 text-textSecondary text12Medium px-2 rounded-[0.625rem]">
                Pure
              </span>
            </Tooltip>
          )}
        </div>
        <DisplayUserAddress
          showLinks={false}
          address={data?.address}
          className="flex-1 !items-start [&>*]:flex [&>*]:items-center"
          ellipsisAddress
        />
      </div>
      <Handle
        type="target"
        position={Position.Left}
        className="!min-w-0 !w-0 !border-0"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!min-w-0 !w-0 !border-0"
      />
    </NodeWrap>
  );
}
