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

function ProxiesCount({ items }) {
  if (isNil(items)) {
    return null;
  }

  return <span className="text14Medium">{items?.length || 0}</span>;
}

const mobileUserColumn = {
  name: "Delegator",
  className: "text-left",
  render: (item) => (
    <>
      <AddressUser key="delegator" add={item.delegator || item.delegatee} />
      <ProxiesCount items={item?.items} />
    </>
  ),
};

const userColumn = {
  name: "Delegator",
  className: "text-left",
  render: (item) => (
    <AddressUser key="delegator" add={item.delegator || item.delegatee} />
  ),
};

const proxyTypeColumn = {
  name: "Type",
  className: "w-[200px]",
  render: (item) => <ProxyTypeTag proxyType={item?.proxyType} />,
};

const delayColumn = {
  name: "Delay",
  className: "w-[200px]",
  render: (item) => <DelayTime delay={item?.delay} />,
};

const proxiesCountColumn = {
  name: "Proxies",
  className: "w-[200px] text-left",
  render: (item) => <ProxiesCount items={item?.items} />,
};

export const desktopColumns = [
  userColumn,
  proxyTypeColumn,
  delayColumn,
  proxiesCountColumn,
];

export const mobileColumns = [mobileUserColumn, proxyTypeColumn, delayColumn];
