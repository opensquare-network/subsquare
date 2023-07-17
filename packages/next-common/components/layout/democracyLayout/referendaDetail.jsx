import DetailLayout from "../DetailLayoutV2";

/**
 * @param {import("../DetailLayoutV2").DetailLayoutProps} props
 */
export default function DemocracyReferendaDetailLayout(props) {
  return <DetailLayout {...props}>{props.children}</DetailLayout>;
}
