import useMyRelatedSwitch from "next-common/components/data/common/useMyRelatedSwitch";
import useSearchComponent from "next-common/components/data/common/useSearchComponent";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";

export default function TableHeader({
  title = "List",
  total,
  loading,
  showMyRelated = true,
  showSearch = true,
}) {
  const { component: MyRelatedSwitchComponent } = useMyRelatedSwitch();
  const { component: SearchBoxComponent } = useSearchComponent();

  return (
    <div>
      <TitleContainer>
        <span>
          {title}
          <span className="text-textTertiary text16Medium ml-1">
            {!loading && total}
          </span>
        </span>
        {showMyRelated && MyRelatedSwitchComponent}
      </TitleContainer>
      {showSearch && SearchBoxComponent}
    </div>
  );
}
