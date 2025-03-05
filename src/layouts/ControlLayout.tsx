import { ToolTip } from "@/components/ToolTip";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { AvatarImage } from "@radix-ui/react-avatar";

import { LogOut, User, X } from "lucide-react";

type Props = {
  children: React.ReactNode;
  className?: string;
  userLogo: string | null | undefined;
  setUserId: (userId: string | null) => void;
  setProfile: (profile: any) => void;
};

const ControlLayout = ({
  children,
  className,
  userLogo,
  setUserId,
  setProfile,
}: Props) => {
  return (
    <div
      className={cn(
        className,
        "bg-[#171717] border-2 border-white/40 flex px-1 flex-col rounded-3xl overflow-hidden"
      )}
    >
      <div className="flex justify-between items-center p-4 draggable ">
        <Avatar className="non-draggable">
          <AvatarImage src={userLogo!} alt="logo" />
          <AvatarFallback>
            <User />
          </AvatarFallback>
        </Avatar>
        <ToolTip content="Close">
          <X
            size={23}
            onClick={() => window.ipcRenderer.send("closeApp")}
            className="text-gray-400 non-draggable hover:text-white cursor-pointer "
          />
        </ToolTip>
      </div>
      <div className="flex-1 h-0 overflow-auto">{children}</div>
      <div className="flex justify-between items-center p-4">
        <div className=" flex  items-center  gap-x-2">
          <img
            src="https://raw.githubusercontent.com/PachaiyappanV/Opra/refs/heads/main/public/opra-logo.svg"
            alt="app logo"
          />
          <p className="text-2xl text-white">Opra</p>
        </div>
        {userLogo && (
          <ToolTip content="Log out">
            <LogOut
              onClick={() => {
                window.localStorage.removeItem("userId");

                setUserId(null);
                setProfile(null);
              }}
              size={23}
              className="text-gray-400 cursor-pointer"
            />
          </ToolTip>
        )}
      </div>
    </div>
  );
};

export default ControlLayout;
