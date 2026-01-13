type Props = {
  title: string;
  date: string;
  onClick: () => void;
};

export default function ChatItem({ title, date, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      className="
        px-3 py-2 rounded
        hover:bg-gray-800 cursor-pointer
        truncate
      "
    >
      <div className="text-sm truncate">{title}</div>
      <div className="text-xs text-gray-400">
        {new Date(date).toLocaleDateString()}
      </div>
    </div>
  );
}
