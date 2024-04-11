import Popup from "../../popup/wrapper/Popup";
import styled from "styled-components";
import { InfoUsers, SystemVoteAye, SystemVoteNay } from "@osn/icons/subsquare";
import Divider from "next-common/components/styled/layout/divider";
import { AddressUser } from "next-common/components/user";
import tw from "tailwind-styled-components";
import SymbolValue from "@subsquare/next/components/gov2/sidebar/tally/values/symbolValue";
import { cn } from "next-common/utils";
const FlexAcDiv = styled.div`
  display: flex;
  align-items: center;
`;
const CardDiv = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px 16px;
  height: 68px;
  box-sizing: border-box;
  gap: 8px;
  align-self: stretch;
  border-radius: 8px;
  background: ${(p) =>
    p.AyeOrNay === "Aye"
      ? "var(--color-green100, rgba(76, 175, 80, 0.1))"
      : "var(--color-red100, rgba(244, 67, 54, 0.10))"};
`;

const ColorSpan = styled.span`
  color: ${(p) =>
    p.AyeOrNay === "Aye"
      ? "var(--color-green500, #4CAF50)"
      : "var(--color-red500, #F44336)"};
`;
const ScrollY = styled.div`
  max-height: 400px;
  overflow-y: auto;
  ::-webkit-scrollbar {
    width: 4px;
    height: 6px;
  }
  ::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  ::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 10px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;
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

function Card({ AyeOrNay, address, percentage, M }) {
  return (
    <CardDiv AyeOrNay={AyeOrNay}>
      <AddressUser add={address} fontSize={14} />
      <div className="flex justify-between">
        <FlexAcDiv className="gap-1">
          <ColorFontSpan AyeOrNay={AyeOrNay}>Votes</ColorFontSpan>
          <ColorFontSpan AyeOrNay={AyeOrNay}>({percentage})</ColorFontSpan>
        </FlexAcDiv>
        <FlexAcDiv className="gap-1">
          <SymbolValue
            value={M}
            className={cn(
              "text14Medium",
              AyeOrNay === "Aye" ? "text-green500" : "text-red500",
            )}
          />
        </FlexAcDiv>
      </div>
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
          icon={<InfoUsers className="w-5 h-5" />}
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
      <ScrollY className="flex gap-2 max-md:flex-col md:flex-row md:gap-4">
        <div className="flex flex-col flex-1 gap-2">
          <Card AyeOrNay="Aye" percentage={"6.36%"} M={2343423} />
          <Card AyeOrNay="Aye" percentage={"6.36%"} M={2343423} />
          <Card AyeOrNay="Aye" percentage={"6.36%"} M={2343423} />
          <Card AyeOrNay="Aye" percentage={"6.36%"} M={2343423} />
        </div>
        <div className="flex flex-col flex-1 gap-2">
          <Card AyeOrNay="Nay" percentage={"6.36%"} M={345345} />
          <Card AyeOrNay="Nay" percentage={"6.36%"} M={345345} />
        </div>
      </ScrollY>
    </Popup>
  );
}
