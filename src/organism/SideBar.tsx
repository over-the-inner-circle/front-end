export interface SideBarProps {
  title: string;
}

export default function SideBar({ title }: SideBarProps) {
  return (
    <div
      className="flex flex-col justify-start items-start
                  font-pixel text-white text-sm bg-neutral-600 border-l border-neutral-400
                  w-80 h-full"
    >
      <div className="flex items-center w-full h-10 px-3 border-b bg-neutral-800 border-inherit">
        {title}
        <button className="px-1">+</button>
      </div>
      <ul className="w-full border-inherit">
        {[...Array(4)].map((_, idx) => (
          <Item key={idx} />
        ))}
      </ul>
    </div>
  );
}

function Item(props: React.HTMLAttributes<HTMLLIElement>) {
  return (
    <li {...props} className="flex items-center h-12 px-3 border-b border-inherit">
      <div className="">item</div>
    </li>
  );
}
