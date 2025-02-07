import NoteCard from "@/components/cards/NoteCard";
import Navbar from "@/components/Navbar";
import { MdAdd } from "react-icons/md";
import AddEditNotes from "./AddEditNotes";
import { useEffect, useState } from "react";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/utils/axiosinstance";

Modal.setAppElement("#root");

const Home = () => {
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });
  const [userInfo, setUserInfo] = useState(null);
  const [notes, setNotes] = useState([]);

  const navigate = useNavigate();

  // Fetch User Info
  const getUserInfo = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  const fetchNotes = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axiosInstance.get("/get-all-notes", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.data.error) {
        setNotes(response.data.notes);
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  useEffect(() => {
    getUserInfo();
    fetchNotes(); // Fetch notes when component loads
  }, []);

  const closeModal = () => {
    setOpenAddEditModal({ ...openAddEditModal, isShown: false });
  };

  const handleEditNote = (note) => {
    setOpenAddEditModal({
      isShown: true,
      type: "edit",
      data: note,
    });
  };

  return (
    <div>
      <Navbar userInfo={userInfo} />
      <div className="container mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8">
          {notes.map((note) => (
            <NoteCard
              key={note._id}
              title={note.title}
              date={note.date}
              content={note.content}
              tags={note.tags}
              isPinned={note.isPinned}
              onEdit={() => handleEditNote(note)}
              onDelete={() => console.log("Delete Note")}
              onPinNote={() => console.log("Pin/Unpin Note")}
            />
          ))}
        </div>

        <button
          className="w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 fixed right-10 bottom-10"
          onClick={() => {
            setOpenAddEditModal({
              isShown: true,
              type: "add",
              data: null,
            });
          }}
        >
          <MdAdd className="text-[32px] text-white" />
        </button>

        <Modal
          isOpen={openAddEditModal.isShown}
          onRequestClose={closeModal}
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          className="bg-white p-6 rounded-2xl shadow-lg w-[90%] max-w-lg mx-auto"
        >
          <div>
            <h2 className="text-xl font-bold mb-4">
              {openAddEditModal.type === "add" ? "Add Note" : "Edit Note"}
            </h2>
            <AddEditNotes
              type={openAddEditModal.type}
              noteData={openAddEditModal.data}
              onClose={closeModal}
              refreshNotes={fetchNotes}
            />
            <button
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Home;
