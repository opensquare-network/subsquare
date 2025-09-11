import React, { useEffect, useRef, useState } from "react";
import Avatar from "../avatar";
import useIdentityInfo from "next-common/hooks/useIdentityInfo";
import Identity from "../Identity";
import { tryConvertToEvmAddress } from "next-common/utils/mixedChainUtil";
import PrimaryButton from "next-common/lib/button/primary";
import Copyable from "../copyable";
import { SystemEdit2 } from "@osn/icons/subsquare";
import { cn } from "next-common/utils";
import { useUser } from "next-common/context/user";
import getIpfsLink from "next-common/utils/env/ipfsEndpoint";
import SecondaryButton from "next-common/lib/button/secondary";
import dynamicPopup from "next-common/lib/dynamic/popup";

const PublishAvatarPopup = dynamicPopup(() => import("./publishAvatarPopup"));

const UnsetAvatarPopup = dynamicPopup(() => import("./unsetAvatarPopup"));

export function EditAvatar({ setImageFile, setImageDataUrl, children = null }) {
  const inputEl = useRef();

  const handleSelectFile = () => {
    inputEl.current.value = "";
    inputEl.current?.click();
  };

  const onSelectFile = (e) => {
    e.preventDefault();
    const { files } = e.target;
    uploadImage(files);
  };

  const uploadImage = (files) => {
    if (files && files.length) {
      const image = files[0];
      if (!/image\/\w+/.exec(image.type)) {
        return;
      }

      if (FileReader && files && files.length) {
        const image = files[0];
        if (!/image\/\w+/.exec(image.type)) {
          return;
        }

        setImageFile(image);

        var fr = new FileReader();
        fr.onload = function () {
          setImageDataUrl(fr.result);
        };
        fr.readAsDataURL(image);
      }
    }
  };

  let child = (
    <div
      className={cn(
        "absolute bottom-0 right-0",
        "flex justify-center items-center",
        "bg-neutral100 border border-neutral400 rounded-full w-[32px] h-[32px]",
        "cursor-pointer",
      )}
      onClick={handleSelectFile}
    >
      <SystemEdit2 className="w-[16px] h-[16px]" />
    </div>
  );

  if (children) {
    child = <div onClick={handleSelectFile}>{children}</div>;
  }

  return (
    <>
      {child}
      <input
        className="hidden"
        type="file"
        ref={inputEl}
        accept="image/*"
        onChange={onSelectFile}
      />
    </>
  );
}

function ProfileAvatar({ address }) {
  const user = useUser();
  const [showSavePopup, setShowSavePopup] = useState(false);
  const [showUnsetPopup, setShowUnsetPopup] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imageDataUrl, setImageDataUrl] = useState(null);

  useEffect(() => {
    setImageFile(null);
    setImageDataUrl(null);
  }, [user?.avatarCid]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        <span className="text14Bold">Avatar</span>
        <div className="flex justify-center">
          <div className="inline-flex relative">
            {imageDataUrl || user?.avatarCid ? (
              <img
                className="rounded-full w-[80px] h-[80px] border border-neutral400"
                src={imageDataUrl || getIpfsLink(user.avatarCid)}
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
      <div className="flex gap-[10px]">
        <PrimaryButton
          size="small"
          disabled={!imageFile}
          onClick={() => setShowSavePopup(true)}
        >
          Save
        </PrimaryButton>
        <SecondaryButton
          size="small"
          disabled={!user?.avatarCid}
          onClick={() => setShowUnsetPopup(true)}
        >
          Unset
        </SecondaryButton>
      </div>
      {showSavePopup && (
        <PublishAvatarPopup
          imageFile={imageFile}
          onClose={() => setShowSavePopup(false)}
        />
      )}
      {showUnsetPopup && (
        <UnsetAvatarPopup onClose={() => setShowUnsetPopup(false)} />
      )}
    </div>
  );
}

export default function Profile({ address }) {
  const { identity, hasIdentity } = useIdentityInfo(address);
  const maybeEvmAddress = tryConvertToEvmAddress(address);

  return (
    <div className="flex gap-[24px] text-textPrimary">
      <ProfileAvatar address={address} />
      <div className="w-[1px] bg-neutral300" />
      <div className="flex flex-col gap-3 grow">
        <div className="flex flex-col gap-2">
          <span className="text14Bold">Identity</span>
          <div className="bg-neutral200 py-[10px] px-[16px] text14Medium rounded-[8px]">
            {hasIdentity ? <Identity identity={identity} /> : "-"}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text14Bold">Address</span>
          <div className="bg-neutral200 py-[10px] px-[16px] text14Medium rounded-[8px]">
            <Copyable copyText={maybeEvmAddress}>{maybeEvmAddress}</Copyable>
          </div>
        </div>
      </div>
    </div>
  );
}
