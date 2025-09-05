import dynamicPopup from "next-common/lib/dynamic/popup";
import { useState } from "react";
import { LinkMenuItem } from "./menuItems";

const PostLinkPopup = dynamicPopup(() =>
  import("next-common/components/linkPost/postLinkPopup"),
);

export default function LinkMenu({ setShow }) {
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
