function Temp() {
	  return (
		<div className="grid grid-cols-2 grid-rows-2" id="root">
			<div className="bg-green-500 col-span-1" id="nav"></div>
			<div className="bg-blue-500 col-span-2" id="side"></div>
			<div className="bg-blue-200 col-span-2" id="game"></div>
		</div>
  );
}

export default Temp;
