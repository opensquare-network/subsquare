import {
  SystemSignalActiveLight,
  SystemSignalActiveDark,
  SystemSignalInactiveLight,
  SystemSignalInactiveDark,
} from "@osn/icons/subsquare";
import useTxSubmission from "next-common/components/common/tx/useTxSubmission";
import SignerPopupWrapper from "next-common/components/popupWithSigner/signerPopupWrapper";
import { useContextApi } from "next-common/context/api";
import { useCoreFellowshipPallet } from "next-common/context/collectives/collectives";
import useSubCoreCollectivesMember from "next-common/hooks/collectives/useSubCoreCollectivesMember";
import { cn } from "next-common/utils";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useCallback } from "react";
import tw from "tailwind-styled-components";

function SystemSignalActive({ className }) {
  return (
    <>
      <SystemSignalActiveLight className={cn(className, "dark:hidden")} />
      <SystemSignalActiveDark className={cn(className, "hidden dark:block")} />
    </>
  );
}

function SystemSignalInactive({ className }) {
  return (
    <>
      <SystemSignalInactiveLight className={cn(className, "dark:hidden")} />
      <SystemSignalInactiveDark
        className={cn(className, "hidden dark:block")}
      />
    </>
  );
}

const ActiveButtonWrapper = tw.div`
  flex rounded-[6px] bg-neutral200 p-[2px] w-full
`;

function ActiveButton({ children, highlight, onClick }) {
  return (
    <div
      role="button"
      className={cn(
        "flex flex-1 items-center justify-center gap-[4px] rounded-[4px] p-[4px] grow",
        highlight && "bg-neutral100",
        onClick && "cursor-pointer",
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

function SetActiveButton({ highlight }) {
  const api = useContextApi();
  const corePallet = useCoreFellowshipPallet();

  const setActive = useCallback(() => {
    if (!api) {
      return;
    }
    return api.tx[corePallet].setActive(true);
  }, [api, corePallet]);

  const { doSubmit } = useTxSubmission({
    getTxFunc: setActive,
  });

  return (
    <ActiveButton highlight={highlight} onClick={highlight ? null : doSubmit}>
      {highlight && <SystemSignalActive className="w-[16px]" />}
      <span
        className={cn(
          "text12Medium",
          highlight ? "text-textPrimary" : "text-textTertiary",
        )}
      >
        Active
      </span>
    </ActiveButton>
  );
}

function SetInactiveButton({ highlight }) {
  const api = useContextApi();
  const corePallet = useCoreFellowshipPallet();

  const setInactive = useCallback(() => {
    if (!api) {
      return;
    }
    return api.tx[corePallet].setActive(false);
  }, [api, corePallet]);

  const { doSubmit } = useTxSubmission({
    getTxFunc: setInactive,
  });

  return (
    <ActiveButton highlight={highlight} onClick={highlight ? null : doSubmit}>
      {highlight && <SystemSignalInactive className="w-[16px]" />}
      <span
        className={cn(
          "text12Medium",
          highlight ? "text-textPrimary" : "text-textTertiary",
        )}
      >
        Inactive
      </span>
    </ActiveButton>
  );
}

function MyActiveStatus({ member }) {
  const { isActive } = member || {};
  return (
    <ActiveButtonWrapper>
      <SetActiveButton highlight={isActive} />
      <SetInactiveButton highlight={!isActive} />
    </ActiveButtonWrapper>
  );
}

function OthersActiveStatus({ member }) {
  const { isActive } = member || {};
  if (isActive) {
    return (
      <ActiveButtonWrapper>
        <ActiveButton highlight={true}>
          <SystemSignalActive className="w-[16px]" />
          <span className="text12Medium text-textPrimary">Active</span>
        </ActiveButton>
      </ActiveButtonWrapper>
    );
  }

  return (
    <ActiveButtonWrapper>
      <ActiveButton>
        <SystemSignalInactive className="w-[16px]" />
        <span className="text12Medium text-textPrimary">Inactive</span>
      </ActiveButton>
    </ActiveButtonWrapper>
  );
}

export default function MemberActiveStatus({ address }) {
  const myAddress = useRealAddress();
  const { member, isLoading } = useSubCoreCollectivesMember(address);
  if (isLoading && !member) {
    return null;
  }

  const isMine = myAddress === address;
  return isMine ? (
    <SignerPopupWrapper>
      <MyActiveStatus address={address} member={member} />
    </SignerPopupWrapper>
  ) : (
    <OthersActiveStatus member={member} />
  );
}
