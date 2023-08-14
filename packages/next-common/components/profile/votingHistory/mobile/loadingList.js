import Loading from "next-common/components/loading";

export default function LoadingList() {
  return (
    <div className="flex justify-center w-full my-[16px]">
      <Loading size={20} />
    </div>
  );
}
