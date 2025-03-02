import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/clerk-react";
import { X } from "lucide-react";

type Props = {
  children: React.ReactNode;
  className?: string;
};

const ControlLayout = ({ children, className }: Props) => {
  return (
    <div
      className={cn(
        className,
        "bg-[#171717] border-2 border-white/40 flex px-1 flex-col rounded-3xl overflow-hidden"
      )}
    >
      <div className="flex justify-between items-center p-5 draggable ">
        <span className="non-draggable">
          <UserButton />
        </span>
        <X
          size={20}
          onClick={() => window.ipcRenderer.send("closeApp")}
          className="text-gray-400 non-draggable hover:text-white cursor-pointer "
        />
      </div>
      <div className="flex-1 h-0 overflow-auto">{children}</div>
      <div className="p-5 flex w-full items-center  gap-x-2">
        <img src="/opal-logo.svg" alt="app logo" />
        <p className="text-2xl text-white">Opal</p>
      </div>
    </div>
  );
};

export default ControlLayout;
