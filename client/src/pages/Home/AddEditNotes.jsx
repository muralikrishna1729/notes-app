import TagInput from "@/components/TagInput";
import { useState, useEffect } from "react";
import { MdClose } from "react-icons/md";
import axiosInstance from "@/utils/axiosinstance";

const AddEditNotes = ({
  noteData,
  type,
  onClose,
  refreshNotes,
  showToastmessage,
}) => {
  const [title, setTitle] = useState(noteData?.title || "");
  const [content, setContent] = useState(noteData?.content || "");
  const [tags, setTags] = useState(noteData?.tags || []);
  const [error, setError] = useState(null);

  const addNewNote = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axiosInstance.post(
        "/add-note",
        { title, content, tags },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!response.data.error) {
        showToastmessage({
          type: "success",
          message: "Note Added Successfully",
        });
        refreshNotes();
        onClose();
      }
    } catch (error) {
      setError(
        error.response?.data?.message || "Error adding note. Try again."
      );
    }
  };

  const editNote = async () => {
    const noteId = noteData._id;
    try {
      const token = localStorage.getItem("token");
      const response = await axiosInstance.put(
        "/edit-note/" + noteId,
        { title, content, tags },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!response.data.error) {
        showToastmessage({
          type: "success",
          message: "Note Updated Successfully",
        });
        refreshNotes();
        onClose();
      }
    } catch (error) {
      setError(
        error.response?.data?.message || "Error updating note. Try again."
      );
    }
  };

  // Handle Add/Edit Note
  const handleAddNote = () => {
    if (!title) {
      setError("Please enter the title");
      return;
    }
    if (!content) {
      setError("Please enter the content");
      return;
    }
    setError(null);
    type === "edit" ? editNote() : addNewNote();
  };

  useEffect(() => {
    if (noteData) {
      setTitle(noteData.title);
      setContent(noteData.content);
      setTags(noteData.tags);
    }
  }, [noteData]);

  return (
    <div className="relative gap-5">
      <button
        className="w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-50"
        onClick={onClose}
      >
        <MdClose className="text-xl text-slate-400" />
      </button>

      {/* Title Input */}
      <div className="flex flex-col gap-2">
        <label className="font-medium text-sm text-gray-700">Title</label>
        <input
          type="text"
          className="border rounded-lg p-3 text-base focus:outline-blue-400 focus:ring-2 focus:ring-blue-300"
          placeholder="Enter your note title (e.g., Meeting Notes)"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>

      {/* Content Input */}
      <div className="flex flex-col gap-2">
        <label className="font-medium text-sm text-gray-700">Content</label>
        <textarea
          className="border rounded-lg p-3 text-base h-32 resize-none bg-gray-50 focus:outline-blue-400 focus:ring-2 focus:ring-blue-300"
          placeholder="Write down the details of your note..."
          rows={10}
          value={content}
          onChange={({ target }) => setContent(target.value)}
        />
      </div>

      {/* Tags Input */}
      <TagInput tags={tags} setTags={setTags} />
      {error && <p className="text-red-500 text-xs pt-4">{error}</p>}

      {/* Button Section */}
      <div className="mt-4 flex justify-end gap-3">
        <button
          className="px-5 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          className="px-5 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          onClick={handleAddNote}
        >
          {type === "edit" ? "Update Note" : "Add Note"}
        </button>
      </div>
    </div>
  );
};

export default AddEditNotes;
