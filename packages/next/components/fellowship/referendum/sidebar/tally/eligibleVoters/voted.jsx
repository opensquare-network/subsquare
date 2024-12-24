import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import Divider from "next-common/components/styled/layout/divider";

export function NoData({ content }) {
  return (
    <div className="text-textTertiary text14Medium text-center px-4 py-2.5">
      {content}
    </div>
  );
}

export default function Voted() {
  const loading = false;
  const total = 0;

  return (
    <div>
      <TitleContainer className="text14Bold px-0 pb-3">
        <span>
          Voted
          <span className="text-textTertiary text14Medium ml-1">
            {!loading && total}
          </span>
        </span>
      </TitleContainer>

      {total === 0 && !loading && <NoData content={"No voter vote yet"} />}

      <Divider className="my-4" />
    </div>
  );
}
