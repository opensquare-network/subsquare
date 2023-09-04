import { useState } from "react";
import tw from "tailwind-styled-components";

export const Button = tw.div`
  cursor-pointer
  text14Medium
  text-theme500
`;

export default function RemoveButton() {
  const [showRemoveVotePopup, setShowRemoveVotePopup] = useState(false);

  return (
    <>
      <Button onClick={() => setShowRemoveVotePopup(true)}>Remove</Button>
      {showRemoveVotePopup && <div></div>}
    </>
  );
}
