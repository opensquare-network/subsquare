import WalletTypes from "./consts/walletTypes";

export const WATCH_ONLY_TOOLTIP_TEXT =
  "Watch-only accounts cannot sign transactions.";

export const WATCH_ONLY_LOGIN_REJECTED_TEXT =
  "Watch-only account cannot sign in.";

export const WATCH_ONLY_MESSAGE_SIGN_REJECTED_TEXT =
  "Watch-only account cannot sign messages.";

export const WATCH_ONLY_CREATE_POST_LOGIN_TOOLTIP_TEXT =
  "Watch-only account cannot sign in to create a post.";

export const WATCH_ONLY_CREATE_POST_MESSAGE_SIGN_TOOLTIP_TEXT =
  "Watch-only account cannot sign messages to create a post.";

export const WATCH_ONLY_CREATE_APPLICATION_LOGIN_TOOLTIP_TEXT =
  "Watch-only account cannot sign in to create an application.";

export function isWatchOnlyAccount(account) {
  return account?.wallet === WalletTypes.WATCH_ONLY;
}
