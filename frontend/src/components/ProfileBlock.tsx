import { SignIcon } from "./Icons";
import { useUserQuery } from "@/app/hooks/useUser";

export function ProfileBlock() {
  const { data: user } = useUserQuery();

  const userName = user?.username || "User";
  const userEmail = user?.email || "email не указан";

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
