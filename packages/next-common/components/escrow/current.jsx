import { Wrap } from "./style";

function Datatips({ datas }) {
  return (
    <Wrap className="grid max-sm:grid-cols-2 max-sm:gap-4 grid-cols-3 md:grid-cols-4">
      {datas.map((i) => (
        <div key={i.label} className="flex flex-col gap-1">
          <span className="text12Medium text-textTertiary">{i.label}</span>
          {i.content}
        </div>
      ))}
    </Wrap>
  );
}

function Value({ num, symbol }) {
  return (
    <div className="flex items-center gap-1">
      <span className="text16Bold text-textPrimary">
        {Number(num).toLocaleString("en-US")}
      </span>
      {symbol && <span className="text-textTertiary text16Bold">{symbol}</span>}
    </div>
  );
}

export default function Current() {
  const datas = [
    {
      label: "Total Token Supply",
      content: <Value num={"10424634"} symbol="vINTR" />,
    },
    {
      label: "Total Stacked Balance",
      content: <Value num={10424634} symbol="vINTR" />,
    },
    {
      label: "Total Staked Accounts",
      content: <Value num={10424634} />,
    },
  ];
  return (
    <div className="flex flex-col gap-[18px]">
      <span className="text16Bold text-textPrimary ml-6">Current</span>
      <Datatips datas={datas} />
    </div>
  );
}
