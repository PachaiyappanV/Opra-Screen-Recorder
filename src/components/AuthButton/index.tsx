import { SignedOut, SignInButton, SignUpButton } from "@clerk/clerk-react";
import { Button } from "../ui/button";

const AuthButton = () => {
  return (
    <SignedOut>
      <div className="flex gap-x-3 justify-center items-center">
        <SignInButton>
          <Button
            variant="outline"
            className="px-10 rounded-full hover:bg-gray-200"
          >
            SignIn
          </Button>
        </SignInButton>
        <SignUpButton>
          <Button variant="default" className="px-10 rounded-full">
            SignUp
          </Button>
        </SignUpButton>
      </div>
    </SignedOut>
  );
};

export default AuthButton;
