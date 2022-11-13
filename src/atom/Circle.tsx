interface CircleProps {
  radius: number;
  style?: string;
}

function Circle({ radius, style }: CircleProps) {
  return (
    <svg height={radius * 2} width={radius * 2} className={style}>
      <circle cx={radius} cy={radius} r={radius} />
    </svg>
  );
}

export default Circle;
