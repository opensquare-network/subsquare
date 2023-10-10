import CommentItem from "./item";
import NoComment from "./noComment";
import { TitleContainer } from "../styled/containers/titleContainer";
import { useIsLogin } from "../../context/user";
import clsx from "clsx";
import { useLoginPopup } from "next-common/hooks/useLoginPopup";
import PrimaryButton from "../buttons/primaryButton";
import PolkassemblyCommentItem from "./polkassemblyCommentItem";
import Loading from "../loading";

export default function Comments({ data: commentsData, loading }) {
  const { items } = commentsData;
  const isLogin = useIsLogin();
  const { openLoginPopup } = useLoginPopup();

  let content;
  if (loading) {
    content = (
      <div className="flex justify-center py-5">
        <Loading size={14} />
      </div>
    );
  } else {
    if (items?.length > 0) {
      content = (
        <div>
          {(items || []).map((item) =>
            item.comment_source === "polkassembly" ? (
              <PolkassemblyCommentItem key={item.id} data={item} />
            ) : (
              <CommentItem
                key={item._id}
                data={item}
                replyToCommentId={item._id}
              />
            ),
          )}
        </div>
      );
    } else {
      content = <NoComment />;
    }
  }

  return (
    <div>
      <div className="mb-4">
        <TitleContainer className={clsx("w-full !px-0 mb-4", "!block")}>
          <div className="text14Bold">Comments</div>
        </TitleContainer>
      </div>

      {content}

      {!isLogin && (
        <div className="flex justify-end mt-4">
          <PrimaryButton onClick={openLoginPopup}>Login</PrimaryButton>
        </div>
      )}
    </div>
  );
}
