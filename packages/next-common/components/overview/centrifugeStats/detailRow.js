import tw from "tailwind-styled-components";

export const DetailList = tw.div`
  flex
  flex-col
  [&>div]:border-b
  [&>div]:border-dashed
  [&>div]:border-neutral300
`;

export function DetailRow({ title, value }) {
  return (
    <div className="flex items-center justify-between py-[8px] text14Medium">
      <div className="flex text-textSecondary">{title}</div>
      <div className="flex text-textPrimary">{value}</div>
    </div>
  );
}
