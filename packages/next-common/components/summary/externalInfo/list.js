import Item from "./item";

export default function List({ title, items }) {
  if (!items?.length) {
    return null;
  }

  return (
    <div className="flex flex-col gap-[8px]">
      <h6 className="text-[12px] font-medium leading-[16px] text-textTertiary">
        {title}
      </h6>
      <ul>
        {(items || []).map(({ title, href }, index) => (
          <Item key={index} title={title} href={href} />
        ))}
      </ul>
    </div>
  );
}
