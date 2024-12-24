import AddressUser from "next-common/components/user/addressUser";
import { formatTimeDuration } from "next-common/utils/viewfuncs/formatTimeDuration";
import Tooltip from "next-common/components/tooltip";
import { isNil } from "lodash-es";
import { cn } from "next-common/utils";

function ProxyTypeTag({ proxyType, className }) {
  if (isNil(proxyType)) {
    return null;
  }

  return (
    <div className={cn("flex items-start flex-col", className)}>
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
    <div className="inline-flex items-end space-x-2 text14Medium text-textTertiary">
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

function ProxiesCount({ items }) {
  if (isNil(items)) {
    return null;
  }

  return <span className="text14Medium">{items?.length || 0}</span>;
}

export const desktopColumns = [
  {
    name: (
      <div className="inline-flex items-center space-x-1">
        <span>Delegator</span>
        <Tooltip content={"Account who set their proxies"} />
      </div>
    ),
    className: "min-w-[160px] text-left",
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
    render: (item) => <ProxiesCount items={item?.items} />,
  },
];

export const mobileColumns = [
  {
    name: "Delegator",
    className: "text-left",
    render: (item) => (
      <>
        <AddressUser key="delegator" add={item.delegator || item.delegatee} />
        <ProxiesCount items={item?.items} />
      </>
    ),
  },
  {
    name: "Type",
    className: "text-right",
    render: (item) => (
      <ProxyTypeTag proxyType={item?.proxyType} className={"items-end"} />
    ),
  },
  {
    name: "Delay",
    className: "text-right",
    render: (item) => (
      <div className="inline-flex items-end space-x-2 text14Medium text-textTertiary">
        {item?.delay > 0 ? (
          <span className="text-textPrimary">{item?.delay}</span>
        ) : (
          <span>-</span>
        )}
      </div>
    ),
  },
];
