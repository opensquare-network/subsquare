import ListLayout from "../ListLayout";
import Gov2TrackSummary from "next-common/components/summary/gov2TrackSummary";
import Gov2TrackSummaryFooter from "next-common/components/summary/gov2TrackSummaryFooter";

/**
 * @param {import("../ListLayout").ListLayoutProps & { periodData, summaryData }} props
 * @description layout for page referenda track
 */
export default function ReferendaTrackLayout({
  periodData,
  summaryData,
  ...props
}) {
  return (
    <ListLayout
      description={periodData.description}
      tabs={[
        { label: "Referenda", url: `/referenda/track/${periodData.id}` },
        {
          label: "Statistics",
          url: `/referenda/track/${periodData.id}/statistics`,
        },
      ]}
      summary={
        <Gov2TrackSummary
          summary={summaryData}
          period={periodData}
          titleExtra={`[${periodData.id}]`}
        />
      }
      summaryFooter={<Gov2TrackSummaryFooter period={periodData} />}
      {...props}
    >
      {props.children}
    </ListLayout>
  );
}
