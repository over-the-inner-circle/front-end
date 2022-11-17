export interface SideBarLayoutProps {
  children: React.ReactNode;
}

function SideBarLayout({ children }: SideBarLayoutProps) {
  return (
    <div
      className="col-span-1 col-start-2 row-span-2 row-start-2 shrink-0
                 flex h-full w-[370px] flex-col items-start justify-start
                 border-l border-neutral-400 bg-neutral-600 font-pixel text-white"
    >
      {children}
    </div>
  );
}

export default SideBarLayout;
