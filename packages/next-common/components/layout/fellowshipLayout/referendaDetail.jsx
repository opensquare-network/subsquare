import PostTitle from "next-common/components/detail/common/Title";
import DetailLayout from "../DetailLayoutV2";
import Divider from "next-common/components/styled/layout/divider";
import ReferendaPostMeta from "next-common/components/detail/common/openGov/meta";
import { useSelector } from "react-redux";
import { isEditingPostSelector } from "next-common/store/reducers/userSlice";
import FellowshipWhitelistNavigation from "next-common/components/detail/fellowship/whitelistNavigation";

/**
 * @param {import("../DetailLayoutV2").DetailLayoutProps} props
 */
export default function FellowshipReferendaDetailLayout(props) {
  const isEditing = useSelector(isEditingPostSelector);

  return (
    <DetailLayout
      header={
        props.detail && (
          <>
            {!isEditing && (
              <>
                <FellowshipWhitelistNavigation />
              </>
            )}
            <PostTitle />
            <Divider className="my-4" />
            <ReferendaPostMeta isFellowship />
          </>
        )
      }
      {...props}
    >
      {props.children}
    </DetailLayout>
  );
}
