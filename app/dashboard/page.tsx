"use client";
import { useAuth } from "@/auth/context/authProvider";
import { logout } from "@/auth/actions/logInActions";
import TextButton from "../../components/textButton";
import { ChangePasswordForm } from "@/auth/components/changePassword";
import MemberRoute from "@/components/authMember";
export default function Dashboard() {
  const { setUser } = useAuth();
  return (
    <MemberRoute>
      <div className="flex w-full flex-col">
        <div className="flex w-full justify-end p-1">
          <TextButton
            text="Çıkış"
            onClick={() => {
              logout().then(() => setUser(null));
            }}
          />
        </div>
        <div className="flex justify-center p-3">
          <ChangePasswordForm />
        </div>
      </div>
    </MemberRoute>
  );
}
