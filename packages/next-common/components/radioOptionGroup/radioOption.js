import RadioButton from "./radioButton";

export default function RadioOption({ checked, label, onClick }) {
  return (
    <div className="flex gap-2">
      <RadioButton checked={checked} onClick={onClick} />
      <span>{label}</span>
    </div>
  );
}
