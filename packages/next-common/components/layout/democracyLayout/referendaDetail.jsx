import { usePost } from "next-common/context/post";
import DetailLayout from "../DetailLayoutV2";
import ReferendumNavigation from "next-common/components/detail/navigation/ReferendumNavigation";
import ReferendumVoteEndCountDown from "next-common/components/democracy/referendum/voteEndCountDown";
import PostTitle from "next-common/components/detail/common/Title";
import DemocracyReferendumMeta from "next-common/components/detail/Democracy/referendum/meta";
import ExecutionCountdown from "next-common/components/detail/Democracy/referendum/executionCountdown";
import { useSelector } from "react-redux";
import { isEditingPostSelector } from "next-common/store/reducers/userSlice";
import Divider from "next-common/components/styled/layout/divider";

/**
 * @param {import("../DetailLayoutV2").DetailLayoutProps} props
 */
export default function DemocracyReferendaDetailLayout({ seoInfo, ...props }) {
  const post = usePost();
  const isEditing = useSelector(isEditingPostSelector);

  return (
    <DetailLayout
      seoInfo={seoInfo}
      header={
        <>
          {!isEditing && (
            <>
              <ExecutionCountdown />
              <ReferendumVoteEndCountDown />
              <ReferendumNavigation post={post} />
            </>
          )}
          <PostTitle />
          <Divider className="my-4" />
          <DemocracyReferendumMeta />
        </>
      }
      {...props}
    >
      {props.children}
    </DetailLayout>
  );
}
