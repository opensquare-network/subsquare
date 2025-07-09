import { AppendMenuItem } from "next-common/sima/components/contentMenu";
import useCanAppendReferendaPost from "next-common/hooks/useCanAppendReferendaPost";

export default function ReferendaAppendMenuItem({ setShow, setIsAppend }) {
  const canAppendReferendaPost = useCanAppendReferendaPost();
  if (!canAppendReferendaPost) {
    return null;
  }

  return <AppendMenuItem setIsAppend={setIsAppend} setShow={setShow} />;
}
