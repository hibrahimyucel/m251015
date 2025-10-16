"use client";
import { useAuth } from "@/auth/context/authProvider";
import ProtectedRoute from "../../components/authProtected";
import { logout } from "@/auth/actions/logInActions";
import TextButton from "../../components/textButton";
import { ChangePasswordForm } from "@/auth/components/changePassword";
export default function Dashboard() {
  const { setUser } = useAuth();
  return (
    <ProtectedRoute>
      <div className="border-diffcolor flex w-full flex-col border">
        <div className="flex h-10 w-full justify-end p-1">
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
    </ProtectedRoute>
  );
}
