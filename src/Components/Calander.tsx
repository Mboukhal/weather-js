import { FaArrowLeft } from "react-icons/fa6";
import Calendar from "react-calendar";
import { useState } from "react";
import "./calander.css";
import { RiDragMoveFill } from "react-icons/ri";
// import "react-calendar/dist/Calendar.css";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

export const Calander = ({
  show_calander,
}: {
  show_calander: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [value, onChange] = useState<Value>(new Date());

  return (
    <div className=" absolute flex flex-col z-50 w-full h-full bg-white">
      <div className=" absolute w-full flex flex-col z-50 ">
        <button
          className={`absolute flex z-50 justify-center items-center bg-gray-500 opacity-60 w-[25px] h-[25px] rounded-md m-1  `}
          onClick={() => {
            show_calander(false);
          }}
        >
          <FaArrowLeft className=" text-white " />
        </button>
        <button
          className={`flex z-50 self-end justify-center items-center bg-gray-500 opacity-60  drag-all w-[25px] h-[25px] rounded-md m-1  `}
        >
          <RiDragMoveFill className=" text-white" />
        </button>
      </div>
      <Calendar className={""} onChange={onChange} value={value} />
    </div>
  );
};
