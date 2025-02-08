import { useNavigate } from "react-router-dom";
import ProfileInfo from "./cards/profileInfo";
import Searchbar from "./Searchbar";
import { useState } from "react";
const Navbar = ({ userInfo, onSearchNote, refreshNotes }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchQuery) {
      onSearchNote(searchQuery);
    }
  };
  const onClearSearch = () => {
    setSearchQuery("");
    refreshNotes();
  };

  return (
    <div className="flex items-center justify-between px-6 py-2 drop-shadow shadow-lg w-full pb-5 sticky ">
      <h2 className="text-xl text-black py-2 font-medium">Notes App</h2>
      <Searchbar
        value={searchQuery}
        onChange={({ target }) => setSearchQuery(target.value)}
        handleSearch={handleSearch}
        onClearSearch={onClearSearch}
      />
      {/* Pass userInfo to ProfileInfo */}
      <ProfileInfo userInfo={userInfo} />
    </div>
  );
};

export default Navbar;
