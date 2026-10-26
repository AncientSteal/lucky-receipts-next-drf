import { SignIcon } from "./Icons";

interface ProfileBlockProps {
  userName: string;
  userEmail: string;
}

export function ProfileBlock({ userName, userEmail }: ProfileBlockProps) {
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
