import React from "react";
import styled from "styled-components";
import { LinkTelegram } from "@osn/icons/subsquare";
import Switch from "./switch";
import { useUser } from "next-common/context/user";
import DeleteChannel from "./deleteChannel";
import TelegramLinkHint from "./telegramLinkHint";

const Wrapper = styled.div`
  display: flex;
`;

const IconWrapper = styled.div`
  display: flex;
  padding: 8px 0;

  svg {
    width: 24px;
    height: 24px;
    path {
      fill: var(--textTertiary);
    }
  }
`;

function TelegramLinkInfo() {
  const user = useUser();
  return (
    <div className="flex justify-between rounded-[8px] grow border border-neutral400 bg-neutral200">
      <div className="px-[16px] py-[8px]">
        <span className="text-textPrimary">
          @{user?.telegram?.user?.username}
        </span>
      </div>
    </div>
  );
}

export default function NotificationTelegram({ isOn, setIsOn }) {
  const user = useUser();
  const telegram = user?.telegram;
  const isUnset = !telegram?.chat;

  return (
    <Wrapper>
      <div style={{ display: "flex", gap: 24, flexGrow: 1 }}>
        <IconWrapper>
          <LinkTelegram />
        </IconWrapper>
        {isUnset ? <TelegramLinkHint /> : <TelegramLinkInfo />}
      </div>
      <div className="flex justify-between w-[148px]">
        <div className="flex">{!isUnset && <DeleteChannel />}</div>
        <Switch isUnset={isUnset} isOn={isOn} onToggle={() => setIsOn(!isOn)} />
      </div>
    </Wrapper>
  );
}
