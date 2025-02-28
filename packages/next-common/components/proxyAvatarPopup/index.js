import React, { useEffect, useState } from "react";
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

function SaveButton({ proxyAddress, imageFile }) {
  const { isLoading, submitAvatar } = useAvatarSubmission(
    imageFile,
    proxyAddress,
  );

  return (
    <PrimaryButton
      size="small"
      disabled={!imageFile}
      loading={isLoading}
      onClick={submitAvatar}
    >
      Save
    </PrimaryButton>
  );
}

function UnsetButton({ proxyAddress, avatarCid }) {
  const { isLoading, unsetAvatar } = useAvatarUnset(proxyAddress);

  return (
    <PrimaryButton
      size="small"
      disabled={!avatarCid}
      loading={isLoading}
      onClick={unsetAvatar}
    >
      Unset
    </PrimaryButton>
  );
}

function ProfileAvatar({ address, proxyUser }) {
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
          <SaveButton proxyAddress={address} imageFile={imageFile} />
          <UnsetButton
            proxyAddress={address}
            avatarCid={proxyUser?.avatarCid}
          />
        </div>
      </div>
    </div>
  );
}

function ProxyAccount({ address }) {
  const { proxies } = useMyProxied();
  const { identity, hasIdentity } = useIdentityInfo(address);

  const maybeEvmAddress = tryConvertToEvmAddress(address);
  const addressHint = addressEllipsis(maybeEvmAddress);
  const proxyInfo = (proxies || []).find(
    (proxy) => proxy.delegator === address,
  );

  return (
    <div className="flex flex-col gap-[12px]">
      <span className="text14Bold text-textPrimary">Proxied Account</span>
      <div className="flex flex-col rounded-[8px] bg-neutral200">
        <div className="flex gap-[12px] m-[12px]">
          <AddressAvatar address={address} size={40} />
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
                <div className="text14Medium text-textPrimary">
                  {addressHint}
                </div>
                <div className="text12Medium text-textTertiary truncate">
                  {address}
                </div>
              </>
            )}
          </div>
        </div>
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
      </div>
    </div>
  );
}

export default function ProxyAvatarPopup({ proxyAddress, ...props }) {
  const { value } = useAsync(
    () => nextApi.fetch(`users/${proxyAddress}`),
    [proxyAddress],
  );

  const proxyUser = value?.result;
  if (!proxyUser) {
    return null;
  }

  return (
    <SignerPopupWrapper>
      <Popup title="Set Avatar As Proxy" {...props}>
        <div className="flex flex-col gap-[24px] text-textPrimary">
          <ProfileAvatar address={proxyAddress} proxyUser={proxyUser} />
          <ProxyAccount address={proxyAddress} />
        </div>
      </Popup>
    </SignerPopupWrapper>
  );
}
