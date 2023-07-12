import { usePost } from "next-common/context/post";
import DetailLayout from "./DetailLayoutV2";
import { useSelector } from "react-redux";
import { isEditingPostSelector } from "next-common/store/reducers/userSlice";
import { useDetailType } from "next-common/context/page";

// from packages/next/components/motion/head
import MotionHead from "components/motion/head";

/**
 * @param {import("./DetailLayoutV2").DetailLayoutProps} props
 */
export default function MotionDetailLayout(props) {
  const post = usePost();
  const isEditing = useSelector(isEditingPostSelector);
  const type = useDetailType();

  return (
    <DetailLayout
      header={
        props.detail && (
          <>{!isEditing && <MotionHead motion={post} type={type} />}</>
        )
      }
      {...props}
    >
      {props.children}
    </DetailLayout>
  );
}
