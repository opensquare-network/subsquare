import Item from "./item";

export default function List({ title, items }) {
  if (!items?.length) {
    return null;
  }

  return (
    <div className="flex flex-col gap-[8px]">
      <span className="text-[12px] font-medium leading-[16px] text-textTertiary">
        {title}
      </span>
      {(items || []).map(({ title, href }, index) => (
        <Item key={index} title={title} href={href} />
      ))}
    </div>
  );
}
