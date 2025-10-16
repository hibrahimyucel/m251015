"use client";
import { useAuth } from "@/auth/context/authProvider";
import ProtectedRoute from "../components/authProtected";
import { logout } from "@/auth/actions/logInActions";
import TextButton from "../components/textButton";
export default function Dashboard() {
  const { setUser } = useAuth();
  return (
    <ProtectedRoute>
      <div className="flex w-full flex-col">
        <h1 className="bg-background border-diffcolor flex w-full border p-0.5 font-bold">
          Profil
        </h1>
        <div className="flex justify-end p-1">
          <TextButton
            text="Çıkış"
            onClick={() => {
              logout().then(() => setUser(null));
            }}
          />
        </div>
      </div>
    </ProtectedRoute>
  );
}
