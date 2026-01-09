export default function ElementAccountRow({ elementAccount }) {
  return (
    <div className="flex gap-4 pb-2">
      <div className="flex items-center ">
        <span className=" text14Bold w-32">Matrix ID:</span>
        <span className="truncate text-textTertiary">{elementAccount}</span>
      </div>
    </div>
  );
}
