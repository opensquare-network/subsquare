import dynamicPopup from "next-common/lib/dynamic/popup";
import PeopleApiProvider from "next-common/context/people/api";
import CoretimeApiProvider from "next-common/context/coretime/api";
import useSystemChainsBlockHeight from "./useSystemChainsBlockHeight";
import { MapDataList } from "next-common/components/dataList";
import FieldLoading from "next-common/components/icons/fieldLoading";
import ChainIcon from "next-common/components/header/chainIcon";

const Popup = dynamicPopup(() =>
  import("next-common/components/popup/wrapper/Popup"),
);

function NetworkWithIcon({ data }) {
  return (
    <div className="flex justify-start space-x-2 items-center text-textPrimary">
      <ChainIcon chain={data?.chain} />
      <span>{data?.network}</span>
    </div>
  );
}

function ChainBlockHeight({ height }) {
  if (!height) {
    return <FieldLoading size={16} />;
  }

  return (
    <span className="text-textSecondary">{`#${height?.toLocaleString()}`}</span>
  );
}

const colNetwork = {
  name: "Network",
  style: { textAlign: "left", width: "120px" },
  render: (item) => <NetworkWithIcon data={item} />,
};

const colBlockHeight = {
  name: "Block Height",
  style: { textAlign: "right" },
  render: (item) => <ChainBlockHeight height={item?.height} />,
};

function PopupContent() {
  const data = useSystemChainsBlockHeight();
  const columnsDef = [colNetwork, colBlockHeight];

  return (
    <MapDataList bordered columnsDef={columnsDef} data={data} loading={false} />
  );
}

export default function SystemChainsBlockHeightPopup({ setShow }) {
  return (
    <Popup title="Block Height" onClose={() => setShow(false)}>
      <PeopleApiProvider>
        <CoretimeApiProvider>
          <PopupContent />
        </CoretimeApiProvider>
      </PeopleApiProvider>
    </Popup>
  );
}
