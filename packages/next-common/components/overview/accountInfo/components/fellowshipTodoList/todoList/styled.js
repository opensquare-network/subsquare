export function TodoWrapper({ children }) {
  return (
    <div className="flex gap-[4px] sm:items-center max-sm:flex-col max-sm:justify-start">
      {children}
    </div>
  );
}

export function TodoTag({ children }) {
  return (
    <div className="w-[160px] min-w-[160px]">
      <div className="inline-flex rounded-[10px] px-[8px] py-[2px] text12Medium text-textSecondary bg-neutral200">
        {children}
      </div>
    </div>
  );
}

export function TodoContent({ children }) {
  return (
    <div className="flex flex-wrap text-textPrimary text14Medium items-center leading-[28px]">
      {children}
    </div>
  );
}
