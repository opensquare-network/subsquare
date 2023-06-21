import Content from "./cardContent";
import { SummaryTitle } from "./styled";
import clsx from "clsx";

export default function SummaryItems({ items, className }) {
  return (
    <div className={clsx("flex max-sm:flex-col max-sm:gap-4", className)}>
      {items.map((item, index) => (
        <div key={index} className="flex-1">
          {item.title && <SummaryTitle>{item.title}</SummaryTitle>}
          <Content>{item.content}</Content>
        </div>
      ))}
    </div>
  );
}
