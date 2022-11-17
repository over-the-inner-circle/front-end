export interface SideBarProps {
  title: string;
  setRoom_Id: (room_id: string | null) => void;
}
import chatingRoom from "@/organism/ChatingRoom";

export default function SideBar({ title, setRoom_Id }: SideBarProps) {
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
          <button onClick={() => setRoom_Id('tmp') } className="flex items-center w-full" key={idx}>
            <Item key={idx} />
          </button>
        ))}
      </ul>
    </div>
  );
}

function Item(props: React.HTMLAttributes<HTMLLIElement>) {

  return (
    <li {...props} className="flex items-center w-full h-12 px-3 border-b border-inherit">
      <div className="">item</div>
    </li>
  );
}
