interface Section<T> {
  title: string;
  list: T[];
}

interface SectionListProps<T> {
  sections: Section<T>[] | undefined;
  keyExtractor(data: T): React.Key;
  renderItem(data: T): React.ReactNode;
}

function SectionList<T extends object>({
  sections = [],
  keyExtractor,
  renderItem,
}: SectionListProps<T>) {
  return (
    <ul className="flex h-full w-full flex-col overflow-auto bg-neutral-600 font-pixel text-white">
      {sections.map((section) => (
        <li key={section.title}>
          <div
            className="flex w-full flex-row items-center justify-start
                   border-b border-neutral-400 bg-neutral-800 px-5 py-1 text-xs"
          >
            {section.title}
          </div>
          <ul>
            {section.list.map((data) => (
              <li key={keyExtractor(data)}>{renderItem(data)}</li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}

export default SectionList;
