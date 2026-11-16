import WalletTypes from "./consts/walletTypes";

export const WATCH_ONLY_TOOLTIP_TEXT =
  "Watch-only accounts cannot sign transactions.";

export const WATCH_ONLY_LOGIN_REJECTED_TEXT =
  "Watch-only account cannot sign in.";

export const WATCH_ONLY_MESSAGE_SIGN_REJECTED_TEXT =
  "Watch-only account cannot sign messages.";

export const WATCH_ONLY_CREATE_POST_TOOLTIP_TEXT =
  "Watch-only account cannot create a post.";

export const WATCH_ONLY_CREATE_APPLICATION_TOOLTIP_TEXT =
  "Watch-only account cannot create an application.";

export const WATCH_ONLY_COMMENT_TOOLTIP_TEXT =
  "Watch-only account cannot comment.";

export function isWatchOnlyAccount(account) {
  return account?.wallet === WalletTypes.WATCH_ONLY;
}
