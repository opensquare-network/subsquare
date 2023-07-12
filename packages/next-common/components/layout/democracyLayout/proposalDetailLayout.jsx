import DetailLayout from "../DetailLayoutV2";
import DetailHeader from "next-common/components/detail/detailHeader";

/**
 * @param {{countDown: JSX.Element} & import("../DetailLayoutV2").DetailLayoutProps} props
 */
export default function DemocracyPublicProposalDetailLayout({
  countDown,
  ...props
}) {
  return (
    <DetailLayout
      header={props.detail && <DetailHeader countDown={countDown} />}
      {...props}
    >
      {props.children}
    </DetailLayout>
  );
}
