import Content from "./cardContent";
import { SummaryTitle } from "./styled";
import clsx from "clsx";

export default function SummaryItems({ items, className }) {
  return (
    <div
      className={clsx("grid grid-cols-4 max-sm:grid-cols-2 gap-4", className)}
    >
      {items.map((item, index) => (
        <div key={index} className="flex-1 flex justify-between">
          <div>
            {item.title && <SummaryTitle>{item.title}</SummaryTitle>}
            <Content>{item.content}</Content>
          </div>
          {item.suffix && <div>{item.suffix}</div>}
        </div>
      ))}
    </div>
  );
}
