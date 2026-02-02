export default function CardHeaderLayout({ tag, actions, Icon, title }) {
  return (
    <div className="flex justify-between items-start">
      <div className="flex gap-2 items-center">
        <div className="flex items-center">
          <Icon className="w-6 h-6 [&_path]:fill-textSecondary" />
          <span className="text-textTertiary mx-1 ml-1">·</span>
          <span className="text14Bold text-textPrimary">{title}</span>
        </div>
        <div>{tag}</div>
      </div>
      {actions}
    </div>
  );
}
