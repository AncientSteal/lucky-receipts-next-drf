import { useUserStore } from "@/app/store/useUserStore";
import { SignIcon } from "./Icons";

export function ProfileBlock() {
  const user = useUserStore((state) => state.user);
  const userName = user?.username || "User";
  const userEmail = user?.email || "email не указан";
  const isInitialized = useUserStore((state) => state.isInitialized);

  console.log("РЕНДЕР ПРОФИЛЯ:", { username: user?.username, isInitialized });

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
