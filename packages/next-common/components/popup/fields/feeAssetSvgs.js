export function ChevronDown({ className = "w-2.5 h-2.5" }) {
  return (
    <svg className={className} viewBox="0 0 10 6" fill="none">
      <path
        d="M1 1L5 5L9 1"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CheckIcon({ className = "w-3.5 h-3.5" }) {
  return (
    <svg className={className} viewBox="0 0 14 14" fill="currentColor">
      <path
        d="M11.5 3.5L5.5 10.5L2.5 7.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
