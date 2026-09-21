import WalletTypes from "./consts/walletTypes";

export const WATCH_ONLY_TOOLTIP_TEXT =
  "Watch-only accounts cannot sign transactions.";

export const WATCH_ONLY_LOGIN_REJECTED_TEXT =
  "Watch-only account cannot sign in.";

export const WATCH_ONLY_MESSAGE_SIGN_REJECTED_TEXT =
  "Watch-only account cannot sign messages.";

export function isWatchOnlyAccount(account) {
  return account?.wallet === WalletTypes.WATCH_ONLY;
}
