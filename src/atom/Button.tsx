interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export default function Button({ children, className, ...props }: ButtonProps) {
  return (
    <button
      className={`text-sm font-pixel text-white px-4 py-2
                  focus:outline-none hover:ring hover:ring-slate-100
                  ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
