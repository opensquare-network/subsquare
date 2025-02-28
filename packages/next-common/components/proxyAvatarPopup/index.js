import React, { useCallback, useEffect, useState } from "react";
import Popup from "next-common/components/popup/wrapper/Popup";
import Avatar from "next-common/components/avatar";
import PrimaryButton from "next-common/lib/button/primary";
import { addressEllipsis, cn } from "next-common/utils";
import getIpfsLink from "next-common/utils/env/ipfsEndpoint";
import { useMyProxied } from "next-common/context/proxy";
import AddressAvatar from "../user/addressAvatar";
import useIdentityInfo from "next-common/hooks/useIdentityInfo";
import Identity from "../Identity";
import { tryConvertToEvmAddress } from "next-common/utils/mixedChainUtil";
import { EditAvatar } from "../setting/profile";
import SignerPopupWrapper from "../popupWithSigner/signerPopupWrapper";
import { useAvatarSubmission } from "../setting/publishAvatarPopup";
import { useAvatarUnset } from "next-common/components/setting/unsetAvatarPopup";
import { useAsync } from "react-use";
import nextApi from "next-common/services/nextApi";
import { noop } from "lodash-es";

function SaveButton({ proxyAddress, imageFile, refresh }) {
  const { isLoading, submitAvatar } = useAvatarSubmission(
    imageFile,
    proxyAddress,
  );

  const onSave = useCallback(() => {
    submitAvatar().then(refresh).catch(noop);
  }, [submitAvatar, refresh]);

  return (
    <PrimaryButton
      size="small"
      disabled={!imageFile}
      loading={isLoading}
      onClick={onSave}
    >
      Save
    </PrimaryButton>
  );
}

function UnsetButton({ proxyAddress, avatarCid, refresh }) {
  const { isLoading, unsetAvatar } = useAvatarUnset(proxyAddress);

  const onUnset = useCallback(() => {
    unsetAvatar().then(refresh).catch(noop);
  }, [unsetAvatar, refresh]);

  return (
    <PrimaryButton
      size="small"
      disabled={!avatarCid}
      loading={isLoading}
      onClick={onUnset}
    >
      Unset
    </PrimaryButton>
  );
}

function ProfileAvatar({ address }) {
  const [trigger, setTrigger] = useState(0);
  const refresh = useCallback(() => setTrigger((prev) => prev + 1), []);
  const { value } = useAsync(
    () => nextApi.fetch(`users/${address}`),
    [address, trigger],
  );
  const proxyUser = value?.result;

  const [imageFile, setImageFile] = useState(null);
  const [imageDataUrl, setImageDataUrl] = useState(null);

  useEffect(() => {
    setImageFile(null);
    setImageDataUrl(null);
  }, [proxyUser?.avatarCid]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        <span className="text14Bold">Avatar</span>
        <div className="flex justify-center">
          <div className="inline-flex relative">
            {imageDataUrl || proxyUser?.avatarCid ? (
              <img
                className="rounded-full w-[80px] h-[80px] border border-neutral400"
                src={imageDataUrl || getIpfsLink(proxyUser.avatarCid)}
                alt=""
              />
            ) : (
              <Avatar address={address} size={80} />
            )}
            <EditAvatar
              setImageFile={setImageFile}
              setImageDataUrl={setImageDataUrl}
            />
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="flex gap-[10px]">
          <SaveButton
            proxyAddress={address}
            imageFile={imageFile}
            refresh={refresh}
          />
          <UnsetButton
            proxyAddress={address}
            avatarCid={proxyUser?.avatarCid}
            refresh={refresh}
          />
        </div>
      </div>
    </div>
  );
}

function IdentityInfo({ address }) {
  const { identity, hasIdentity } = useIdentityInfo(address);

  const maybeEvmAddress = tryConvertToEvmAddress(address);
  const addressHint = addressEllipsis(maybeEvmAddress);

  return (
    <div className="flex flex-col h-[40px] justify-center truncate">
      {hasIdentity ? (
        <>
          <Identity identity={identity} />
          <div className="text12Medium text-textTertiary truncate">
            {address}
          </div>
        </>
      ) : (
        <>
          <div className="text14Medium text-textPrimary">{addressHint}</div>
          <div className="text12Medium text-textTertiary truncate">
            {address}
          </div>
        </>
      )}
    </div>
  );
}

function ProxyType({ address }) {
  const { proxies } = useMyProxied();
  const proxyInfo = (proxies || []).find(
    (proxy) => proxy.delegator === address,
  );

  return (
    <div className="ml-[64px]">
      <div
        className={cn(
          "border-neutral300 border-t py-[12px]",
          "text12Medium text-textSecondary",
        )}
      >
        Proxy type: {proxyInfo?.proxyType}
      </div>
    </div>
  );
}

function ProxyAccount({ address }) {
  return (
    <div className="flex flex-col gap-[12px]">
      <span className="text14Bold text-textPrimary">Proxied Account</span>
      <div className="flex flex-col rounded-[8px] bg-neutral200">
        <div className="flex gap-[12px] m-[12px]">
          <AddressAvatar address={address} size={40} />
          <IdentityInfo address={address} />
        </div>
        <ProxyType address={address} />
      </div>
    </div>
  );
}

export default function ProxyAvatarPopup({ proxyAddress, ...props }) {
  return (
    <SignerPopupWrapper>
      <Popup title="Set Avatar As Proxy" {...props}>
        <div className="flex flex-col gap-[24px] text-textPrimary">
          <ProfileAvatar address={proxyAddress} />
          <ProxyAccount address={proxyAddress} />
        </div>
      </Popup>
    </SignerPopupWrapper>
  );
}
