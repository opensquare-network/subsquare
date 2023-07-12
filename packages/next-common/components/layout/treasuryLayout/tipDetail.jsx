import DetailLayout from "../DetailLayoutV2";
import PostTitle from "next-common/components/detail/common/Title";
import { useSelector } from "react-redux";
import { isEditingPostSelector } from "next-common/store/reducers/userSlice";
import Divider from "next-common/components/styled/layout/divider";
import CloseCountDown from "next-common/components/detail/treasury/tip/closeCountDown";
import TipPostMeta from "next-common/components/detail/treasury/tip/meta";

/**
 * @param {import("../DetailLayoutV2").DetailLayoutProps} props
 */
export default function TreasuryProposalDetailLayout(props) {
  const isEditing = useSelector(isEditingPostSelector);

  return (
    <DetailLayout
      header={
        props.detail && (
          <>
            {!isEditing && (
              <>
                <CloseCountDown />
              </>
            )}
            <PostTitle />
            <Divider className="my-4" />
            <TipPostMeta />
          </>
        )
      }
      {...props}
    >
      {props.children}
    </DetailLayout>
  );
}
