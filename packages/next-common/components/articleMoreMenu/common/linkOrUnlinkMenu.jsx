import dynamicPopup from "next-common/lib/dynamic/popup";
import { useState } from "react";
import { LinkMenuItem, UnlinkMenuItem } from "./menuItems";
import { usePost } from "next-common/context/post";

const PostLinkPopup = dynamicPopup(() =>
  import("next-common/components/linkPost/postLinkPopup"),
);

const PostUnlinkPopup = dynamicPopup(() =>
  import("next-common/components/linkPost/postUnlinkPopup"),
);

function LinkMenu({ setShow }) {
  const [showLinkPopup, setShowLinkPopup] = useState(false);

  return (
    <div>
      <LinkMenuItem
        onClick={() => {
          setShowLinkPopup(true);
          setShow(false);
        }}
      />
      {showLinkPopup && <PostLinkPopup setShow={setShowLinkPopup} />}
    </div>
  );
}

function UnlinkMenu({ setShow }) {
  const [showUnlinkPopup, setShowUnlinkPopup] = useState(false);

  return (
    <div>
      <UnlinkMenuItem
        onClick={() => {
          setShowUnlinkPopup(true);
          setShow(false);
        }}
      />
      {showUnlinkPopup && <PostUnlinkPopup setShow={setShowUnlinkPopup} />}
    </div>
  );
}

export default function LinkOrUnlinkMenu({ setShow }) {
  const post = usePost();
  if (post?.isBoundDiscussion) {
    return <UnlinkMenu setShow={setShow} />;
  }
  return <LinkMenu setShow={setShow} />;
}
