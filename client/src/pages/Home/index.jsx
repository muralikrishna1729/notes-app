import NoteCard from "@/components/cards/NoteCard";
import Navbar from "@/components/Navbar";
import { MdAdd } from "react-icons/md";
import AddEditNotes from "./AddEditNotes";
import { useEffect, useState } from "react";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/utils/axiosinstance";
import Toast from "../../components/Toast";
import EmptyCard from "@/components/EmptyCard";
import AddNotesImage from "../../assets/images/add-note.svg";
import NoDataImage from "../../assets/images/no-datas.svg";

Modal.setAppElement("#root");

const Home = () => {
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });
  const [userInfo, setUserInfo] = useState(null);
  const [notes, setNotes] = useState([]);
  const [showToastMsg, setshowToastMsg] = useState({
    isShown: false,
    message: "",
    type: "add",
  });
  const [isSearch, setisSearch] = useState("");

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

  // get all nodes
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

  //Delete a Node
  const deleteNode = async (note) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axiosInstance.delete(`/delete-note/${note._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.data.error) {
        showToastmessage({
          type: "delete",
          message: "Note Deleted Successfully",
        });
        fetchNotes(); // Refresh notes after deletion
      }
    } catch (error) {
      console.error("Error Deleting Note:", error);
    }
  };
  // search a Note
  const onSearchNote = async (query) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axiosInstance.get("/search-notes", {
        headers: { Authorization: `Bearer ${token}` },
        params: { query },
      });

      if (response.data && response.data.notes) {
        setisSearch(true);
        setNotes(response.data.notes);
      }
    } catch (error) {
      console.log(error);
    }
  };
  // Pinned a Note
  const updateIsPinned = async (note) => {
    const noteId = note._id;
    try {
      const token = localStorage.getItem("token");
      const response = await axiosInstance.put(
        "/update-note-pinned/" + noteId,
        { isPinned: !note.isPinned },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!response.data.error) {
        showToastmessage({
          type: "success",
          message: "Note Pinned Successfully",
        });
        fetchNotes();
      }
    } catch (error) {
      console.log(error);
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

  const showToastmessage = ({ type, message }) => {
    setshowToastMsg({
      isShown: true,
      message: message,
      type,
    });
  };

  const handleCloseToast = () => {
    setshowToastMsg({
      isShown: false,
      message: "",
    });
  };

  return (
    <div>
      <Navbar
        userInfo={userInfo}
        onSearchNote={onSearchNote}
        refreshNotes={fetchNotes}
      />
      <div className="container mx-auto">
        {notes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8">
            {notes.map((note, index) => (
              <NoteCard
                key={note._id}
                title={note.title}
                date={note.createdOn}
                content={note.content}
                tags={note.tags}
                isPinned={note.isPinned}
                onEdit={() => handleEditNote(note)}
                onDelete={() => deleteNode(note)}
                onPinNote={() => updateIsPinned(note)}
              />
            ))}
          </div>
        ) : (
          <EmptyCard
            imgSrc={isSearch ? NoDataImage : AddNotesImage}
            message={
              isSearch
                ? `Oops! No notes were found matching your search`
                : `Start Creating your First Notes ! click the Add button to join your thoughts, ideas, and reminders. Lerts get Started.`
            }
          />
        )}

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
              showToastmessage={showToastmessage}
            />
            <button
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </Modal>
        <Toast
          isShown={showToastMsg.isShown}
          message={showToastMsg.message}
          type={showToastMsg.type}
          onClose={handleCloseToast}
        />
      </div>
    </div>
  );
};

export default Home;
