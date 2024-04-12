import Popup from "../../popup/wrapper/Popup";
import styled from "styled-components";
import { InfoUsers, SystemVoteAye, SystemVoteNay } from "@osn/icons/subsquare";
import Divider from "next-common/components/styled/layout/divider";
import { AddressUser } from "next-common/components/user";
import tw from "tailwind-styled-components";
import SymbolValue from "@subsquare/next/components/gov2/sidebar/tally/values/symbolValue";
import { cn } from "next-common/utils";
const FlexAcDiv = tw.div`
  flex
  items-center
`;
const voteTypeConfig = {
  Aye: {
    color: "text-green500",
    bg: "bg-green100",
  },
  Nay: {
    color: "text-red500",
    bg: "bg-red100",
  },
  Abstain: {
    color: "text-textSecondary",
    bg: "bg-neutral200",
  },
  Unvote: {
    color: "text-textDisabled",
    bg: "bg-neutral200",
  },
};
const CardDiv = tw.div`
  flex
  max-md:flex-col
  md:flex-row
  w-full
  py-2.5
  px-4
  rounded-[8px]
  max-md:gap-2
  ${(p) => voteTypeConfig[p.voteType]?.bg};
`;
const ColorSpan = tw.span`
   ${(p) => voteTypeConfig[p.voteType]?.color};
`;
const ScrollY = styled.div`
  max-height: 400px;
  overflow-y: auto;
  ::-webkit-scrollbar {
    width: 4px;
    height: 6px;
  }
  ::-webkit-scrollbar-track {
    background: transparent;
  }
  ::-webkit-scrollbar-thumb {
    background: var(--neutral500);
    border-radius: 10px;
  }
`;
// const ScrollY = tw.div`
//   max-h-100
//   overflow-y-auto
//   &::-webkit-scrollbar {
//     w-1
//     h-1.5
//   }
//   &::-webkit-scrollbar-track {
//     bg-transparent
//   }
//   &::-webkit-scrollbar-thumb {
//     bg-neutral500
//     rounded-[10px]
//   }
// `;
export const ColorFontSpan = tw(ColorSpan)`
  text14Medium
`;

function RowItem({ icon, msg, percentage, M }) {
  return (
    <div className="w-full flex justify-between items-center">
      <FlexAcDiv className="gap-2">
        {icon}
        <FlexAcDiv>
          <span className="text14Medium text-textPrimary">{msg}</span>
          <span className="text14Medium text-textTertiary">({percentage})</span>
        </FlexAcDiv>
      </FlexAcDiv>
      <FlexAcDiv className="gap-1">
        <SymbolValue value={M} className="text14Medium" />
      </FlexAcDiv>
    </div>
  );
}

function Card({ voteType, address, percentage, M }) {
  return (
    <CardDiv
      voteType={voteType}
      className={cn(voteType === "Unvote" && "justify-between")}
    >
      <div className="md:flex-1">
        <AddressUser add={address} fontSize={14} />
      </div>
      {voteType === "Unvote" ? (
        <span className={cn("text14Medium", voteTypeConfig[voteType]?.color)}>
          {voteType}
        </span>
      ) : (
        <div className="flex justify-between max-md:w-full md:flex-1">
          <FlexAcDiv className="gap-1">
            <ColorFontSpan voteType={voteType}>{voteType}</ColorFontSpan>
            <ColorFontSpan voteType={voteType}>({percentage})</ColorFontSpan>
          </FlexAcDiv>
          <FlexAcDiv className="gap-1">
            <SymbolValue
              value={M}
              className={cn("text14Medium", voteTypeConfig[voteType]?.color)}
            />
          </FlexAcDiv>
        </div>
      )}
    </CardDiv>
  );
}

export default function DVDetailPopup({ closeFunc }) {
  return (
    <Popup
      title="Decentralized Voices Detail"
      className="w-[640px]"
      onClose={closeFunc}
    >
      <div className="flex flex-col gap-3 !mt-9">
        <RowItem
          icon={<InfoUsers className="w-5 h-5 text-textPrimary" />}
          msg={"Decentralized Voices"}
          percentage={"24.72%"}
          M={2}
        />
        <Divider />
        <RowItem
          icon={<SystemVoteAye className="w-5 h-5" />}
          msg={"Aye"}
          percentage={"18.36%"}
          M={3}
        />
        <Divider />
        <RowItem
          icon={<SystemVoteNay className="w-5 h-5" />}
          msg={"Nay"}
          percentage={"6.36%"}
          M={2.3}
        />
        <Divider />
      </div>
      <FlexAcDiv className="gap-1 !mt-6 mb-4">
        <span className="text14Bold text-textPrimary">Delegates</span>
        <span className="text14Medium text-textTertiary">7</span>
      </FlexAcDiv>
      <ScrollY className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Card voteType="Aye" percentage={"6.36%"} M={2343423} />
          <Card voteType="Nay" percentage={"6.36%"} M={2343423} />
          <Card voteType="Abstain" percentage={"6.36%"} M={2343423} />
          <Card voteType="Aye" percentage={"6.36%"} M={2343423} />
        </div>
        <Divider />
        <div className="flex flex-col gap-2">
          <Card voteType="Unvote" />
          <Card voteType="Unvote" />
        </div>
      </ScrollY>
    </Popup>
  );
}
