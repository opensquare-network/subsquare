import React, { useCallback, useState } from "react";
import nextApi from "next-common/services/nextApi";
import {
  newErrorToast,
  newSuccessToast,
} from "next-common/store/reducers/toastSlice";
import { useDispatch } from "react-redux";
import {
  fetchAndUpdateUser,
  useUser,
  useUserContext,
} from "next-common/context/user";
import Copyable from "../copyable";
import Loading from "../loading";
import useNow from "next-common/hooks/useNow";
import useRepeat from "next-common/hooks/useRepeat";

export default function TelegramLinkHint() {
  const dispatch = useDispatch();
  const userContext = useUserContext();
  const [isLoading, setIsLoading] = useState(false);
  const user = useUser();
  const [linkToken, setLinkToken] = useState(user?.telegram?.linkToken);
  const [linkTokenExpires, setLinkTokenExpires] = useState(
    user?.telegram?.linkTokenExpires,
  );
  const now = useNow();
  const isExpired = linkTokenExpires < now;
  const expMin = Math.min(5, Math.floor((linkTokenExpires - now) / 1000 / 60));
  const expSec = Math.floor((linkTokenExpires - now) / 1000);
  let countdown = `${expMin}mins`;
  if (expMin === 0) {
    countdown = `${expSec}secs`;
  } else if (expSec % 60) {
    countdown += ` ${expSec % 60}secs`;
  }

  const refreshData = useCallback(async () => {
    await fetchAndUpdateUser(userContext);
  }, [userContext]);

  useRepeat(refreshData, {
    delay: 5 * 1000,
    isStop: !linkToken || isExpired,
  });

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
        fetchAndUpdateUser(userContext);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [dispatch, userContext]);

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
          href="https://t.me/subsquare_bot"
          target="_blank"
          rel="noreferrer"
        >
          @subsquare_bot
        </a>{" "}
        and add your Telegram Chat as a member.
      </span>
      <span>
        2. Copy and send following message to the bot.
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
