import { useUserStore } from "@/app/store/useUserStore";
import { SignIcon } from "./Icons";
import { useShallow } from "zustand/shallow";

export function ProfileBlock() {
  const { userName, userEmail } = useUserStore(
    useShallow((state) => ({
      userName: state.user?.username || "User",
      userEmail: state.user?.email || "email не указан",
    }))
  );

  return (
    <div className="header-profile">
      <SignIcon />
      <div className="profile-info">
        <div className="header-avatar"></div>
        <div className="profile-short">
          <p>{userName}</p>
          <span>{userEmail}</span>
        </div>
      </div>
    </div>
  );
}
