import { AppendMenuItem } from "next-common/sima/components/contentMenu";
import useCanAppendBountyPost from "next-common/hooks/useCanAppendBountyPost";

export default function BountyAppendMenuItem({ setShow, setIsAppend }) {
  const canAppendBountyPost = useCanAppendBountyPost();
  if (!canAppendBountyPost) {
    return null;
  }

  return <AppendMenuItem setIsAppend={setIsAppend} setShow={setShow} />;
}
