interface NavProps {
    current: string;
    onChange(n: string): void;
}

const Nav = ({current, onChange }: NavProps) => {
    return (
        <div className="bg-green-500 left-0 fixed top-0 w-full h-[78px] bg-background/[0.87]" id="nav">
            nav
            <div className="fixed  z-30 flex items-center cursor-pointer right-10 top-6">
                <button onClick={() => onChange('chat')}>chat</button>
            </div>
            <div className="fixed  z-30 flex items-center cursor-pointer right-20 top-6">
                <button onClick={() => onChange('friends')}>
                    <img alt="friends" src="../assets/react.svg"/>
                </button>
            </div>
            <div className="fixed  z-30 flex items-center cursor-pointer right-40 top-6">
                <button onClick={() => onChange('directMsg')}>directMsg</button>
            </div>

        </div>
    )
}

export default Nav;