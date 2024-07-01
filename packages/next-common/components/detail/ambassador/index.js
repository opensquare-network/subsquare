import DetailContentBase from "next-common/components/detail/common/detailBase";
import PreimageWarning from "next-common/components/detail/referenda/preimageWarning";
import { useSelector } from "react-redux";
import { isEditingPostSelector } from "next-common/store/reducers/userSlice";

function NonEditingHead() {
  return <PreimageWarning />;
}

export default function AmbassadorReferendaDetail() {
  const isEditing = useSelector(isEditingPostSelector);

  return (
    <DetailContentBase
      head={!isEditing && <NonEditingHead />}
    ></DetailContentBase>
  );
}
