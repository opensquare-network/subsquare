import { Handle, Position } from "@xyflow/react";
import {
  DisplayUserAddress,
  DisplayUserAvatar,
} from "next-common/components/profile/bio";
import AddressUser from "next-common/components/user/addressUser";
import Tooltip from "next-common/components/tooltip";
import { cn } from "next-common/utils";
import Link from "next/link";
import styled from "styled-components";

const NodeWrap = styled.div`
  box-shadow: var(--shadow100);
`;

function UserAvatar({ address, showSignatories = false }) {
  if (!address) {
    return null;
  }

  const avatar = <DisplayUserAvatar address={address} user={{}} size={40} />;

  if (!showSignatories) {
    return avatar;
  }

  return (
    <div className="relative flex">
      {avatar}
      <span className="text-textPrimaryContrast text12Medium inline-block rounded-xl bg-theme500 absolute bottom-0 left-1/2 -translate-x-1/2 px-[0.375rem] box-border">
        3/4
      </span>
    </div>
  );
}

export default function UserNode({ data }) {
  if (!data?.address) {
    return null;
  }
  return (
    <NodeWrap className="bg-neutral100 p-3 rounded-xl border border-neutral300 flex gap-x-3 w-60 items-center">
      <UserAvatar address={data?.address} showSignatories />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <AddressUser
            add={data?.address || ""}
            className={cn("flex text14Medium")}
            maxWidth={200}
            showAvatar={false}
            noTooltip
          />
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
