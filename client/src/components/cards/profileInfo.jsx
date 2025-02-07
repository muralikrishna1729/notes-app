import { getInitial } from "@/utils/helper";
import { useNavigate } from "react-router-dom";

const ProfileInfo = ({ userInfo }) => {
  const navigate = useNavigate();

  const logout = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 flex items-center justify-center rounded-full text-slate-950 font-medium bg-slate-100">
        {userInfo ? getInitial(userInfo.fullName) : "?"}
      </div>
      <div>
        <p className="text-sm font-medium">
          {userInfo ? userInfo.fullName : "Guest"}
        </p>
        <button className="text-sm text-slate-700 underline" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfileInfo;
