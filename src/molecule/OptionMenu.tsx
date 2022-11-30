export interface Option {
  label: string;
  color?: string;
  onClick(): void;
}

interface OptionMenuProps {
  options: Option[];
}

function OptionMenu({ options }: OptionMenuProps) {
  return (
    <ul>
      {options.map((option) => (
        <li
          key={option.label}
          className="bg-neutral-800 p-3 font-pixel text-xs text-white"
        >
          <button
            onClick={() => {
              option.onClick();
            }}
            className={`h-full w-full ${option.color ?? ''}`}
          >
            {option.label}
          </button>
        </li>
      ))}
    </ul>
  );
}

export default OptionMenu;
