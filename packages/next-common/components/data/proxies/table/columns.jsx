import AddressUser from "next-common/components/user/addressUser";
import { formatTimeDuration } from "next-common/utils/viewfuncs/formatTimeDuration";
import Tooltip from "next-common/components/tooltip";
import { isNil } from "lodash-es";

function ProxyTypeTag({ proxyType }) {
  if (isNil(proxyType)) {
    return null;
  }

  return (
    <div className="flex items-center flex-col">
      <div className="flex rounded-[10px] text12Medium bg-green500 px-[8px] py-[2px]">
        <span className="text-textPrimaryContrast">{proxyType}</span>
      </div>
    </div>
  );
}

function DelayTime({ delay }) {
  if (isNil(delay)) {
    return null;
  }

  return (
    <div className="inline-flex space-x-2 text14Medium text-textTertiary">
      <span>Delay</span>
      {delay > 0 ? (
        <Tooltip content={`Execution delay of ${formatTimeDuration(delay)}`}>
          <span className="text-textPrimary">{delay}</span>
        </Tooltip>
      ) : (
        <span>-</span>
      )}
    </div>
  );
}

const TableColumns = [
  {
    name: "Delegator",
    className: "text-left",
    render: (item) => (
      <AddressUser key="delegator" add={item.delegator || item.delegatee} />
    ),
  },
  {
    name: "",
    className: "w-[200px] text-left",
    render: (item) => <ProxyTypeTag proxyType={item?.proxyType} />,
  },
  {
    name: "",
    className: "w-[200px] text-left",
    render: (item) => <DelayTime delay={item?.delay} />,
  },
  {
    name: "Proxies",
    className: "w-[200px] text-left",
    render: (item) => (
      <span className="text14Medium">{item?.items?.length || 0}</span>
    ),
  },
];

export default TableColumns;
