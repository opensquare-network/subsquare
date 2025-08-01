import ListLayout from "../ListLayout";
import NotFound from "next-common/components/notFound";

export default function ReferendaTrackNotFoundLayout({ id, children, tabs }) {
  return (
    <ListLayout
      tabs={tabs}
      title={`[${id}]`}
      summary={<NotFound className="py-10" />}
    >
      {children}
    </ListLayout>
  );
}
