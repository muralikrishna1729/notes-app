import { useEffect } from "react";
import { LuCheck } from "react-icons/lu";
import { MdDeleteOutline } from "react-icons/md";

const Toast = ({ isShown, message, type, onClose }) => {
  useEffect(() => {
    if (isShown) {
      const timeoutId = setTimeout(() => {
        onClose();
      }, 3000);
      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [isShown, onClose]);

  return (
    <div
      className={`fixed top-20 right-6 transition-opacity duration-300 ${
        isShown ? "opacity-100 scale-100" : "opacity-0 scale-95"
      }`}
    >
      <div
        className={`min-w-52 bg-white border shadow-2xl rounded-md flex items-center gap-3 py-2 px-4 transition-all duration-300 ${
          type === "delete" ? "border-red-500" : "border-green-500"
        }`}
      >
        <div
          className={`w-10 h-10 flex items-center justify-center rounded-full ${
            type === "delete" ? "bg-red-100" : "bg-green-100"
          }`}
        >
          {type === "delete" ? (
            <MdDeleteOutline className="text-xl text-red-500" />
          ) : (
            <LuCheck className="text-xl text-green-500" />
          )}
        </div>
        <p className="text-sm text-slate-800">{message}</p>
      </div>
    </div>
  );
};

export default Toast;
