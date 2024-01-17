import "./App.css";
import { RiDragMoveFill } from "react-icons/ri";

import { useMouse } from "@uidotdev/usehooks";
import { LegacyRef } from "react";

function App() {
  const [mouse, ref] = useMouse();

  return (
    <div
      ref={ref as LegacyRef<HTMLDivElement>}
      className="flex flex-col w-screen h-screen bg-slate-200"
    >
      <button
        className={`${
          mouse.x >= 0 && mouse.y >= 0 ? "flex" : "hidden"
        } absolute  justify-center items-center self-end bg-slate-400  drag-all w-[25px] h-[25px] rounded-md m-1 opacity-70`}
      >
        <RiDragMoveFill className=" text-black opacity-70" />
      </button>

      <div className="text-red-500">OK</div>
      {/* <div className=" hidden place-self-end self-end bg-slate-400  w-[25px] h-[25px] rounded-md m-1"></div> */}
    </div>
  );
}

export default App;
