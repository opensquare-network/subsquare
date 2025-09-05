import { AppendMenuItem } from "next-common/components/articleMoreMenu/common";
import useCanAppendBountyPost from "next-common/hooks/useCanAppendBountyPost";

export default function BountyAppendMenuItem({ setShow, setIsAppend }) {
  const canAppendBountyPost = useCanAppendBountyPost();
  if (!canAppendBountyPost) {
    return null;
  }

  return (
    <AppendMenuItem
      onClick={() => {
        setIsAppend(true);
        setShow(false);
      }}
    />
  );
}
