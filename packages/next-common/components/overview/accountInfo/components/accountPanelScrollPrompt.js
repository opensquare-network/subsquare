import { DelegationPrompt } from "./useDelegationPrompt";
import { AvatarPrompt } from "./useSetAvatarPrompt";
import { IdentityPrompt } from "./useSetIdentityPrompt";
import { MultisigPrompt } from "./useMultisigPrompt";
import AssetsManagePrompt from "./useAssetsManagePrompt";
import ScrollPromptContainer from "./ScrollPromptContainer";
import AccountUnlockBalancePrompt from "./accountUnlockBalancePrompt";
import VestingUnlockablePrompt from "./vestingUnlockablePrompt";
import NominatorWithdrawUnbondedPrompt from "./nominatorWithdrawUnbondedPrompt";
import NominatorClaimRewardPrompt from "./nominatorClaimRewardPrompt";
import PoolWithdrawUnbondedPrompt from "./poolWithdrawUnbondedPrompt";
import PoolClaimRewardPrompt from "./poolClaimRewardPrompt";

const promptComponents = [
  DelegationPrompt,
  AvatarPrompt,
  IdentityPrompt,
  MultisigPrompt,
  AssetsManagePrompt,
  NominatorWithdrawUnbondedPrompt,
  NominatorClaimRewardPrompt,
  PoolWithdrawUnbondedPrompt,
  PoolClaimRewardPrompt,
  AccountUnlockBalancePrompt,
  VestingUnlockablePrompt,
];

export default function AccountPanelScrollPrompt() {
  return <ScrollPromptContainer components={promptComponents} />;
}
