import Item from "./item";
import Pagination from "next-common/components/pagination/index.js";
import NoComment from "./noComment";
import { TitleContainer } from "../styled/containers/titleContainer";
import { useIsLogin } from "../../context/user";
import clsx from "clsx";
import { useLoginPopup } from "next-common/hooks/useLoginPopup";
import PrimaryButton from "../buttons/primaryButton";

export default function Comments({
  data: { items, page, pageSize, total } = {},
  tabs = null,
}) {
  const isLogin = useIsLogin();
  const { openLoginPopup } = useLoginPopup();

  return (
    <div>
      <div className="mb-4">
        <TitleContainer className={clsx("w-full !px-0 mb-4", "!block")}>
          <div className="text14Bold">Comments</div>
          {tabs && <div className="mt-4">{tabs}</div>}
        </TitleContainer>
      </div>
      {items?.length > 0 && (
        <>
          <div>
            {(items || []).map((item) => (
              <Item key={item._id} data={item} replyToCommentId={item._id} />
            ))}
          </div>
          <Pagination page={page} pageSize={pageSize} total={total} />
        </>
      )}
      {!items?.length > 0 && <NoComment />}
      {!isLogin && (
        <div className="flex justify-end">
          <PrimaryButton onClick={openLoginPopup}>Login</PrimaryButton>
        </div>
      )}
    </div>
  );
}
