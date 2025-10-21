import { AppendMenuItem } from "next-common/components/articleMoreMenu/common";
import useCanAppendReferendaPost from "next-common/hooks/useCanAppendReferendaPost";

export default function ReferendaAppendMenuItem({ setShow, setIsAppend }) {
  const canAppendReferendaPost = useCanAppendReferendaPost();
  if (!canAppendReferendaPost) {
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
