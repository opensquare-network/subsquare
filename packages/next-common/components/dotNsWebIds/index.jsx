import ListLayout from "next-common/components/layout/ListLayout";
import useDotNsWebIds from "next-common/hooks/dotns/useDotNsWebIds";
import DotNsWebIdsTable from "./table";

export default function DotNsWebIdsPageContent() {
  const { dotNsWebIds, isLoading, error } = useDotNsWebIds();

  return (
    <ListLayout
      title="DotNS Web IDs"
      description="Browse dotNS .dot names with their owner and stores"
    >
      <DotNsWebIdsTable
        dotNsWebIds={dotNsWebIds}
        loading={isLoading}
        error={error}
      />
    </ListLayout>
  );
}
