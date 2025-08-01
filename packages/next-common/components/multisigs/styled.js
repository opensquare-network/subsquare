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
import { useMultisigAccounts } from "./context/multisigAccountsContext";
import { encodeAddressToChain } from "next-common/services/address";
import MultisigAddress from "../user/multisigAddress";
import { cn } from "next-common/utils";
import TextTertiary from "../styled/paragraph/textTertiary";

export function MultisigAccount({
  multisig,
  showCopyableAddress = true,
  className = "",
}) {
  const chain = useChain();
  const isMobile = useIsMobile();
  const address = multisig?.multisigAddress || multisig?.address;
  if (!address) {
    return null;
  }
  const badge = `${multisig.threshold}/${multisig.signatories.length}`;
  const encodeAddress = encodeAddressToChain(address, chain);
  return (
    <div className={cn("flex items-center gap-x-3", className)}>
      <UserAvatar address={encodeAddress} badge={badge} />
      <div className="flex flex-col justify-between">
        <MultisigAddress
          address={encodeAddress}
          accountName={multisig.name}
          showAvatar={false}
          className="text14Medium text-textPrimary"
        />
        {showCopyableAddress ? (
          <CopyableAddress
            className="!text12Medium text-textTertiary break-all"
            address={encodeAddress}
            ellipsisAddress={isMobile}
          />
        ) : (
          <TextTertiary className="!text12Medium text-textTertiary break-all">
            {encodeAddress}
          </TextTertiary>
        )}
      </div>
    </div>
  );
}

export function SignatorieAccount({ address }) {
  const chain = useChain();
  const encodeAddress = encodeAddressToChain(address, chain);
  const isMobile = useIsMobile();
  return (
    <div className="flex items-center gap-x-2">
      <UserAvatar address={encodeAddress} size={36} className="!w-9 !h-9" />
      <div className="flex flex-col justify-between flex-1">
        <AddressUser
          className="!text12Medium"
          add={encodeAddress}
          showAvatar={false}
        />
        <CopyableAddress
          address={encodeAddress}
          ellipsisAddress={isMobile}
          className="!text12Medium"
        />
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
      <span className="text-textTertiary mx-1 text14Medium">
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

  return <span className="text-textTertiary mx-1 text14Medium">{total}</span>;
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
      <span className="inline-flex items-center h-6 mr-1" role="button">
        History
      </span>
      <MultisigsCount />
    </TitleLabel>
  );
}

export function AccountsTitle({ active }) {
  return (
    <TitleLabel $active={active}>
      <span className="inline-flex items-center h-6 mr-1" role="button">
        Accounts
      </span>
      <MultisigAccountsCount />
    </TitleLabel>
  );
}
