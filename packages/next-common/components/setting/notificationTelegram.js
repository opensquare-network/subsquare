import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { LinkTelegram } from "@osn/icons/subsquare";
import Switch from "./switch";
import nextApi from "next-common/services/nextApi";
import {
  newErrorToast,
  newSuccessToast,
} from "next-common/store/reducers/toastSlice";
import { useDispatch } from "react-redux";
import {
  fetchAndUpdateUser,
  useUser,
  useUserDispatch,
} from "next-common/context/user";
import Copyable from "../copyable";
import Loading from "../loading";
import useNow from "next-common/hooks/useNow";

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

function TelegramLinkHint() {
  const dispatch = useDispatch();
  const userDispatch = useUserDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const user = useUser();
  const [linkToken, setLinkToken] = useState(user?.telegram?.linkToken);
  const [linkTokenExpires, setLinkTokenExpires] = useState(
    user?.telegram?.linkTokenExpires,
  );
  const now = useNow();
  const isExpired = linkTokenExpires < now;
  const expMin = Math.min(5, Math.ceil((linkTokenExpires - now) / 1000 / 60));
  const expSec = Math.ceil((linkTokenExpires - now) / 1000);
  let countdown = `${expMin}mins`;
  if (expMin === 1) {
    countdown = `${expSec}secs`;
  }

  useEffect(() => {
    if (!linkToken || isExpired) return;

    const interval = setInterval(async () => {
      fetchAndUpdateUser(userDispatch);
    }, 30 * 1000);

    return () => {
      clearInterval(interval);
      fetchAndUpdateUser(userDispatch);
    };
  }, [linkToken, isExpired, userDispatch]);

  const generateToken = useCallback(() => {
    setIsLoading(true);
    nextApi
      .fetch("user/telegram/link-token")
      .then(({ result, error }) => {
        if (error) {
          dispatch(newErrorToast(error.message));
          return;
        }
        setLinkToken(result?.linkToken);
        setLinkTokenExpires(result?.linkTokenExpires);
        dispatch(newSuccessToast("Token generated"));
        fetchAndUpdateUser(userDispatch);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  let tokenDisplay = null;
  if (isLoading) {
    tokenDisplay = (
      <div className="flex justify-center">
        <Loading size={20} />
      </div>
    );
  } else if (linkToken && isExpired) {
    tokenDisplay = (
      <span className="text-textSecondary">
        You token has expired, please try again
      </span>
    );
  } else if (linkToken) {
    tokenDisplay = (
      <Copyable className="text-textSecondary">{`/link ${linkToken}`}</Copyable>
    );
  }

  return (
    <div className="flex flex-col rounded-[8px] bg-neutral200 py-[10px] px-[16px] grow text-textPrimary">
      <span>
        1. Start with{" "}
        <a
          className="text-sapphire500"
          href="https://t.me/subsqauretestbot"
          target="_blank"
          rel="noreferrer"
        >
          @subsquare_bot
        </a>{" "}
        and add your Telegram Chat as a member.
      </span>
      <span>
        2. Send verification token to the bot.
        {linkToken && !isExpired
          ? ` The token expires in ${countdown}.`
          : ""}{" "}
        <span className="cursor-pointer text-theme500" onClick={generateToken}>
          Generate Token
        </span>
      </span>
      {(linkToken || isLoading) && (
        <div className="rounded-[4px] px-[12px] py-[8px] bg-neutral300 mt-[7px]">
          {tokenDisplay}
        </div>
      )}
    </div>
  );
}

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
      <div style={{ padding: "8px 0" }}>
        <Switch isUnset={isUnset} isOn={isOn} onToggle={() => setIsOn(!isOn)} />
      </div>
    </Wrapper>
  );
}
