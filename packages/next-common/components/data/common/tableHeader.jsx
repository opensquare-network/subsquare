import useMyRelatedSwitch from "next-common/components/data/common/useMyRelatedSwitch";
import useSearchComponent from "next-common/components/data/common/useSearchComponent";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import { DropdownFilter } from "next-common/components/dropdownFilter";

export default function TableHeader({ total, loading }) {
  const { component: MyRelatedSwitchComponent } = useMyRelatedSwitch();
  const { component: SearchBoxComponent } = useSearchComponent();

  return (
    <div>
      <TitleContainer>
        <span>
          List
          <span className="text-textTertiary text16Medium ml-1">
            {!loading && total}
          </span>
        </span>
        <DropdownFilter className="w-[320px]">
          {MyRelatedSwitchComponent}
        </DropdownFilter>
      </TitleContainer>
      {SearchBoxComponent}
    </div>
  );
}
