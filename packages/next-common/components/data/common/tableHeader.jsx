import useMyRelatedSwitch from "next-common/components/data/common/useMyRelatedSwitch";
import useSearchComponent from "next-common/components/data/common/useSearchComponent";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";

export default function TableHeader({
  title = "List",
  total,
  loading,
  showMyRelated = true,
  extra = null,
}) {
  const { component: SearchBoxComponent } = useSearchComponent();

  const HeaderContent = showMyRelated ? TableNameSwitch : TableName;

  return (
    <div>
      <HeaderContent
        title={title}
        total={total}
        loading={loading}
        extra={extra}
      />
      {SearchBoxComponent}
    </div>
  );
}

export function TableName({ title, total, loading, extra = null }) {
  return (
    <TitleContainer>
      <span className="inline-flex items-center">
        {title}
        <span className="text-textTertiary text16Medium ml-1">
          {!loading && total}
        </span>
      </span>
      {extra}
    </TitleContainer>
  );
}

export function TableNameSwitch({ title, total, loading, extra = null }) {
  const { component: MyRelatedSwitchComponent } = useMyRelatedSwitch();
  return (
    <TitleContainer>
      <TableName title={title} total={total} loading={loading} />
      <div className="inline-flex">
        {MyRelatedSwitchComponent}
        {extra}
      </div>
    </TitleContainer>
  );
}
