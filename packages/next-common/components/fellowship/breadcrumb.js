import Breadcrumb from "../_Breadcrumb";
import BreadcrumbWrapper, {
  BreadcrumbHideOnMobileText,
} from "../detail/common/BreadcrumbWrapper";
import { parseGov2TrackName } from "../../utils/gov2";
import { useTrack } from "../../context/post/gov2/track";

function getBreadcrumbItems(trackName, referendumIndex) {
  return [
    {
      path: "/fellowship",
      content: "Fellowship",
    },
    {
      path: `/referenda/${trackName}`,
      content: parseGov2TrackName(trackName),
    },
    {
      content: (
        <>
          <BreadcrumbHideOnMobileText>Referendum</BreadcrumbHideOnMobileText> #
          {referendumIndex}
        </>
      ),
    },
  ];
}

export default function FellowshipBreadcrumb() {
  const { name } = useTrack();
  return (
    <BreadcrumbWrapper>
      <Breadcrumb items={getBreadcrumbItems(name, 3)} />
    </BreadcrumbWrapper>
  );
}
