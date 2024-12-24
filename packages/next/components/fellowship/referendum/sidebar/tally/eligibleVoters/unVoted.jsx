import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import { NoData } from "./voted";

export default function UnVoted() {
  const loading = false;
  const total = 0;

  return (
    <div>
      <TitleContainer className="text14Bold px-0 pb-3">
        <span>
          Un-voted
          <span className="text-textTertiary text14Medium ml-1">
            {!loading && total}
          </span>
        </span>
      </TitleContainer>

      {total === 0 && !loading && (
        <NoData content={"All the voters have voted"} />
      )}
    </div>
  );
}
