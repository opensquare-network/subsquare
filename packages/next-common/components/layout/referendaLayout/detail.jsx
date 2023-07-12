import PostTitle from "next-common/components/detail/common/Title";
import DetailLayout from "../DetailLayoutV2";
import Divider from "next-common/components/styled/layout/divider";
import ReferendaPostMeta from "next-common/components/detail/common/openGov/meta";
import ReferendaWhiteListNavigation from "next-common/components/detail/referenda/whitelistNavigation";
import ReferendaReferendumNavigation from "next-common/components/detail/navigation/referendaReferendumNavigation";
import { useSelector } from "react-redux";
import { isEditingPostSelector } from "next-common/store/reducers/userSlice";

/**
 * @param {import("../DetailLayoutV2").DetailLayoutProps} props
 */
export default function ReferendaDetailLayout(props) {
  const isEditing = useSelector(isEditingPostSelector);

  return (
    <DetailLayout
      header={
        props.detail && (
          <>
            {!isEditing && (
              <>
                <ReferendaWhiteListNavigation />
                <ReferendaReferendumNavigation />
              </>
            )}
            <PostTitle />
            <Divider className="my-4" />
            <ReferendaPostMeta />
          </>
        )
      }
      {...props}
    >
      {props.children}
    </DetailLayout>
  );
}
