export default function TodoTag({ children }) {
  return (
    <div className="w-[160px]">
      <div className="inline-flex rounded-[10px] px-[8px] py-[2px] text12Medium text-textSecondary bg-neutral200">
        {children}
      </div>
    </div>
  );
}
