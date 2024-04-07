import tw from "tailwind-styled-components";

export const DetailList = tw.div`
  flex
  flex-col
  [&_div]:border-b
  [&_div]:border-dashed
  [&_div]:border-neutral300
`;

export function DetailRow({ title, value }) {
  return (
    <div className="flex items-center justify-between py-[8px] text14Medium">
      <div className="text-textSecondary">{title}</div>
      <div className="text-textPrimary">{value}</div>
    </div>
  );
}
