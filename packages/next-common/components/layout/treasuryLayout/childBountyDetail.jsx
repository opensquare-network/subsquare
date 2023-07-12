import DetailLayout from "../DetailLayoutV2";
import PostTitle from "next-common/components/detail/common/Title";
import { useSelector } from "react-redux";
import { isEditingPostSelector } from "next-common/store/reducers/userSlice";
import Divider from "next-common/components/styled/layout/divider";
import { usePost } from "next-common/context/post";
import BountyPostMeta from "next-common/components/detail/treasury/common/bountyMeta";
import ChildBountyCountDown from "next-common/components/detail/treasury/childBounty/countDown";

/**
 * @param {import("../DetailLayoutV2").DetailLayoutProps} props
 */
export default function TreasuryProposalDetailLayout(props) {
  const isEditing = useSelector(isEditingPostSelector);
  const post = usePost();

  return (
    <DetailLayout
      header={
        props.detail && (
          <>
            {!isEditing && (
              <>
                <ChildBountyCountDown data={post.onchainData} />
              </>
            )}
            <PostTitle />
            <Divider className="my-4" />
            <BountyPostMeta />
          </>
        )
      }
      {...props}
    >
      {props.children}
    </DetailLayout>
  );
}
