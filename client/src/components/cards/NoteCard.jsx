import { MdOutlinePushPin, MdCreate, MdDelete } from "react-icons/md";
import moment from "moment";

const NoteCard = ({
  title,
  date,
  content,
  tags,
  isPinned,
  onEdit,
  onDelete,
  onPinNote,
}) => {
  return (
    <div className="border rounded-lg p-4 bg-white shadow hover:shadow-xl transition-all ease-in-out w-full h-auto">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-2">
        <div className="text-justify">
          <h6 className="text-base font-semibold text-gray-800">{title}</h6>
          <span className="text-xs text-slate-500">
            {moment(date).format("Do MMM YYYY")}
          </span>
        </div>
        <MdOutlinePushPin
          className={`text-xl cursor-pointer ${
            isPinned ? "text-blue-600" : "text-gray-400"
          } hover:text-blue-400 transition-colors`}
          onClick={onPinNote}
        />
      </div>

      {/* Content Section */}
      <p className="text-sm text-gray-600 mt-2 mb-3 line-clamp-2 text-justify">
        {content ? content.slice(0, 100) : "No content available."}
      </p>

      {/* Tags Section */}
      {tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <MdCreate
          className="text-xl text-slate-500 cursor-pointer hover:text-slate-700 transition-colors"
          onClick={onEdit}
        />
        <MdDelete
          className="text-xl text-red-400 cursor-pointer hover:text-red-500 transition-colors"
          onClick={onDelete}
        />
      </div>
    </div>
  );
};

export default NoteCard;
