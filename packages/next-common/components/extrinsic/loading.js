import tw from "tailwind-styled-components";

const Bar = tw.div`
my-[8px]
h-[20px]
rounded-[4px]
bg-gradient-to-r from-[#F6F7FA] via-[rgba(246, 247, 250, 0.5)] to-[#F6F7FA]
`;

export default function ExtrinsicLoading() {
  return (
    <div className="flex flex-col">
      <Bar className="w-[80px]"></Bar>
      <Bar className="w-full"></Bar>
      <Bar className="w-full"></Bar>
    </div>
  );
}
