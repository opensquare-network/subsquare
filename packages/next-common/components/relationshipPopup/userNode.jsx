import { Handle, Position, useNodeConnections } from "@xyflow/react";
import {
  DisplayUserAddress,
  DisplayUserAvatar,
} from "next-common/components/profile/bio";
import AddressUser from "next-common/components/user/addressUser";
import styled from "styled-components";
import tw from "tailwind-styled-components";
import useProfileAddress from "next-common/components/profile/useProfileAddress";
import { useProfileBannerUrl } from "next-common/components/profile/header";
import { cn } from "next-common/utils";

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

function AddressLabel({ data }) {
  return (
    <AddressUser
      add={data?.address || ""}
      className="flex text14Medium text-textPrimary"
      maxWidth={200}
      showAvatar={false}
      noTooltip
    />
  );
}

function SelfNode({ data }) {
  const bannerUrl = useProfileBannerUrl();

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div
        className="bg-no-repeat bg-cover w-full h-[40px] rounded-t-[12px]"
        style={{ backgroundImage: `url(${bannerUrl})` }}
      >
        {data?.pure}
        <div className="w-full relative top-[20px] flex justify-center">
          <UserAvatar address={data?.address} badge={data.badge} />
        </div>
      </div>
      <div className="px-4 py-2 mt-5">
        <div className="flex items-center justify-between h-5">
          <AddressLabel data={data} />
        </div>
        <DisplayUserAddress
          showLinks={false}
          address={data?.address}
          className="flex-1 items-center [&>*]:flex [&>*]:items-center"
          ellipsisAddress
        />
      </div>
    </div>
  );
}

function RelativeUserNode({ data }) {
  return (
    <>
      <UserAvatar address={data?.address} badge={data.badge} />
      <div className="flex-1">
        <div className="flex items-center justify-between h-6">
          <AddressLabel data={data} />
          {data?.pure}
        </div>
        <DisplayUserAddress
          showLinks={false}
          address={data?.address}
          className="flex-1 !items-start [&>*]:flex [&>*]:items-center"
          ellipsisAddress
        />
      </div>
    </>
  );
}

export default function UserNode({ data }) {
  const profileAddress = useProfileAddress();
  const isSelf = profileAddress === data?.address;

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
    <NodeWrap
      className={cn(
        "bg-neutral100 p-3 rounded-xl border border-neutral300 flex gap-x-3 w-70 items-center",
        isSelf && "p-0",
      )}
    >
      {isSelf ? <SelfNode data={data} /> : <RelativeUserNode data={data} />}

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
        type="target"
        id="targetParent"
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
      <HandleWraper
        type="source"
        size={sourceHandleTypeSize}
        id="sourceSub"
        position={Position.Right}
      />
    </NodeWrap>
  );
}
