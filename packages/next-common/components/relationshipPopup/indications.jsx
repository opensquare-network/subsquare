export default function Indications() {
  const indications = [
    { name: "Signatory", color: "var(--theme500)" },
    { name: "Proxied", color: "var(--green500)" },
    { name: "Received", color: "var(--neutral500)" },
  ];

  return (
    <div className="flex justify-center gap-x-4">
      {indications.map((item, index) => (
        <div
          key={index}
          className="text-textSecondary text12Medium flex gap-x-2 items-center"
        >
          <span
            className="w-[0.625rem] border-b-2 inline-flex"
            style={{ borderColor: item.color }}
          ></span>
          {item.name}
        </div>
      ))}
    </div>
  );
}
