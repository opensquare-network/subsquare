import WhalesPrompt from "./prompt";

export default function WhalesContainer({ children }) {
  return (
    <div className="space-y-6">
      <WhalesPrompt />

      {children}
    </div>
  );
}
