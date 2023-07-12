import DetailLayout from "../DetailLayoutV2";
import PostTitle from "next-common/components/detail/common/Title";
import { useSelector } from "react-redux";
import { isEditingPostSelector } from "next-common/store/reducers/userSlice";
import Divider from "next-common/components/styled/layout/divider";
import TreasuryAwardCountDown from "next-common/components/detail/treasury/proposal/awardCountDown";
import TreasuryProposalNavigation from "next-common/components/detail/navigation/treasuryProposalNavigation";
import TreasuryProposalPostMeta from "next-common/components/detail/treasury/proposal/meta";

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
                <TreasuryAwardCountDown />
                <TreasuryProposalNavigation />
              </>
            )}
            <PostTitle />
            <Divider className="my-4" />
            <TreasuryProposalPostMeta />
          </>
        )
      }
      {...props}
    >
      {props.children}
    </DetailLayout>
  );
}
