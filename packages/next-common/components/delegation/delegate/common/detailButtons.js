import SecondaryButton from "next-common/lib/button/secondary";
import { SystemSubtract } from "@osn/icons/subsquare";
// import { useState } from "react";
// import AnnouncementEditPopup from "../AnnouncementEditPopup";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useState } from "react";
import RevokePopup from "./revokePopup";

// export function EditButton({ address }) {
//   const [showEdit, setShowEdit] = useState(false);
//   return (
//     <>
//       <SecondaryButton
//         size="small"
//         iconLeft={<SystemEdit2 className="w-4 h-4" />}
//         onClick={() => setShowEdit(true)}
//       >
//         Edit
//       </SecondaryButton>
//       {showEdit && (
//         <AnnouncementEditPopup
//           title="Edit"
//           onClose={() => setShowEdit(false)}
//           address={address}
//         />
//       )}
//     </>
//   );
// }

export function RevokeButton({ address }) {
  const [showRevotePopup, setShowRevotePopup] = useState(false);

  return (
    <>
      <SecondaryButton
        size="small"
        iconLeft={<SystemSubtract className="w-4 h-4" />}
        onClick={() => setShowRevotePopup(true)}
      >
        Revoke
      </SecondaryButton>
      {showRevotePopup && (
        <RevokePopup
          address={address}
          onClose={() => setShowRevotePopup(false)}
        />
      )}
    </>
  );
}

export default function DetailButtons({ address }) {
  const realAddress = useRealAddress();
  const isMyDelegate = address === realAddress;

  return (
    isMyDelegate && (
      <div className="flex gap-[8px]">
        {/* <EditButton address={address} /> */}
        <RevokeButton address={address} />
      </div>
    )
  );
}
