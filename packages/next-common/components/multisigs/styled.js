import tw from "tailwind-styled-components";
import { UserAvatar } from "../relationshipPopup/userNode";
import { CopyableAddress } from "../profile/bio";
import { useIsMobile } from "../overview/accountInfo/components/accountBalances";
import IconButton from "../iconButton";
import { AddressUser } from "../user";
import { useDispatch } from "react-redux";
import { useChain } from "next-common/context/chain";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useSelector } from "react-redux";
import {
  fetchMyMultisigsCount,
  myMultisigsCountSelector,
} from "next-common/store/reducers/multisigSlice";
import { useEffect } from "react";
import { useMultisigAccounts } from "./context/accountsContext";

export function MultisigAccount({ multisig }) {
  const badge = `${multisig.threshold}/${multisig.signatories.length}`;
  const isMobile = useIsMobile();
  return (
    <div className="flex items-center gap-x-2">
      <UserAvatar address={multisig.multisigAddress} badge={badge} />
      <div className="flex flex-col justify-between">
        <div className="text14Medium text-textPrimary">{multisig.name}</div>
        <CopyableAddress
          address={multisig.multisigAddress}
          ellipsisAddress={isMobile}
        />
      </div>
    </div>
  );
}

export function SignatorieAccount({ address }) {
  const isMobile = useIsMobile();
  return (
    <div className="flex items-center gap-x-2">
      <UserAvatar address={address} />
      <div className="flex flex-col justify-between">
        <AddressUser add={address} showAvatar={false} />
        <CopyableAddress address={address} ellipsisAddress={isMobile} />
      </div>
    </div>
  );
}

export const ActionIconButton = tw(IconButton)`
text-textPrimary
[&_svg_path]:!stroke-transparent
border border-neutral400 rounded
w-7 h-7
flex items-center justify-center
`;

export function MultisigsCount() {
  const dispatch = useDispatch();
  const chain = useChain();
  const realAddress = useRealAddress();
  const myMultisigsCount = useSelector(myMultisigsCountSelector);

  useEffect(() => {
    dispatch(fetchMyMultisigsCount(chain, realAddress));
  }, [dispatch, chain, realAddress]);

  return (
    myMultisigsCount !== null && (
      <span className="text-textTertiary mx-1 text16Medium">
        {myMultisigsCount || 0}
      </span>
    )
  );
}

export function MultisigAccountsCount() {
  const { total = 0, isLoading } = useMultisigAccounts() || {};

  if (isLoading) {
    return null;
  }

  return <span className="text-textTertiary mx-1 text16Medium">{total}</span>;
}

const TitleLabel = tw.span`
flex items-center cursor-pointer pb-3 text14Bold border-b-4 whitespace-nowrap hover:text-theme500
${({ $active }) =>
  $active
    ? "text-theme500 border-theme500"
    : "text-textTertiary border-transparent"}
`;

export function HistoryTitle({ active }) {
  return (
    <TitleLabel $active={active}>
      <span className="inline-block h-6 mr-1">History</span>
      <MultisigsCount />
    </TitleLabel>
  );
}

export function AccountsTitle({ active }) {
  return (
    <TitleLabel $active={active}>
      <span className="inline-block h-6 mr-1">Multisig Accounts</span>
      <MultisigAccountsCount />
    </TitleLabel>
  );
}
