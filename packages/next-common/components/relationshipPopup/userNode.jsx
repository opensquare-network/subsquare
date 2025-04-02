import { Handle, Position, useNodeConnections } from "@xyflow/react";
import {
  DisplayUserAddress,
  DisplayUserAvatar,
} from "next-common/components/profile/bio";
import AddressUser from "next-common/components/user/addressUser";
import Tooltip from "next-common/components/tooltip";
import { cn } from "next-common/utils";
import Link from "next/link";
import styled from "styled-components";
import tw from "tailwind-styled-components";

const NodeWrap = styled.div`
  box-shadow: var(--shadow100);
`;

function UserAvatar({ address, badge }) {
  if (!address) {
    return null;
  }

  const avatar = <DisplayUserAvatar address={address} user={{}} size={40} />;

  if (!badge) {
    return avatar;
  }

  return (
    <div className="relative flex">
      {avatar}
      <span className="text-textPrimaryContrast text12Medium inline-block rounded-xl bg-theme500 absolute bottom-0 left-1/2 -translate-x-1/2 px-[0.375rem] box-border whitespace-nowrap">
        {badge}
      </span>
    </div>
  );
}

const HandleWraper = tw(Handle)`
!min-w-0 !w-0 !border-0
${(p) => {
  let topClass = p.location === "top" ? "!top-1/3" : "!top-2/3";
  let isOnlyHandle = p.size <= 1;
  return isOnlyHandle ? "!top-1/2" : topClass;
}}
`;

export default function UserNode({ data }) {
  const sourceConnections = useNodeConnections({ handleType: "source" });
  const targetConnections = useNodeConnections({ handleType: "target" });
  const sourceHandleTypeSize = new Set(
    sourceConnections.map((item) => item.sourceHandle),
  ).size;
  const targetHandleTypeSize = new Set(
    targetConnections.map((item) => item.targetHandle),
  ).size;
  if (!data?.address) {
    return null;
  }

  return (
    <NodeWrap className="bg-neutral100 p-3 rounded-xl border border-neutral300 flex gap-x-3 w-60 items-center">
      <UserAvatar address={data?.address} badge={data.badge} />
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
      <HandleWraper
        type="target"
        id="targetProxy"
        size={targetHandleTypeSize}
        position={Position.Left}
        location="top"
      />
      <HandleWraper
        type="target"
        id="targetMultisig"
        size={targetHandleTypeSize}
        position={Position.Left}
      />
      <HandleWraper
        type="source"
        size={sourceHandleTypeSize}
        id="sourceProxy"
        position={Position.Right}
        location="top"
      />
      <HandleWraper
        type="source"
        size={sourceHandleTypeSize}
        id="sourceMultisig"
        position={Position.Right}
      />
    </NodeWrap>
  );
}
