"use client";
import React, { useState, useEffect } from "react";
import { base64from, tryCatch } from "@/lib/utils";
import DataTable from "../../components/dataTable";
import { CheckIcon } from "../../components/icons";
import AdminRoute from "@/components/authAdmin";
import { useAuth } from "@/auth/context/authProvider";

export interface usersData {
  id: string | number;
  email?: string;
  name?: string;
  member?: number;
  admin?: number;
  pk_user: string;
}
export default function UsersPage() {
  async function saveUserAdmin(id: string, padmin: boolean) {
    if (UserData.id == id) return;
    const sql = `update auth_user set admin = ${padmin ? "pk_user" : "null"} where pk_user = ${id}`;
    const [data, error] = await tryCatch(
      fetch("/api/runsql", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          data: base64from(JSON.stringify({ Sql: sql })),
        },
      }),
    );
    if (data) await getUsers();
    if (error) return error;
  }
  async function saveUserMember(id: string, pmember: boolean) {
    const sql = `update auth_user set member = ${pmember ? "pk_user" : "null"} where pk_user = ${id}`;
    const [data, error] = await tryCatch(
      fetch("/api/runsql", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          data: base64from(JSON.stringify({ Sql: sql })),
        },
      }),
    );
    if (data) await getUsers();
    if (error) console.log(error.message);
  }

  const { UserData } = useAuth();

  const renderV = (value: string | number | undefined) => (
    <p className={`${value ? "block" : "border-b"} `}>{value}</p>
  );
  const columns: Array<{
    key: keyof usersData;
    header: string;
    render?: (
      value: usersData[keyof usersData],
      id: string | number,
    ) => React.ReactNode;
  }> = [
    {
      key: "admin",
      header: "Admin",
      render: (value: usersData[keyof usersData], id: string | number) => {
        return (
          <button
            className="flex place-self-center align-middle"
            type="button"
            onClick={() => {
              saveUserAdmin(id as string, !value);
            }}
          >
            <CheckIcon Checked={value ? true : false} />
          </button>
        );
      },
    },
    {
      key: "member",
      header: "User",
      render: (value: usersData[keyof usersData], id: string | number) => {
        return (
          <button
            className="flex place-self-center align-middle"
            type="button"
            onClick={() => {
              saveUserMember(id as string, !value);
            }}
          >
            <CheckIcon Checked={value ? true : false} />
          </button>
        );
      },
    },
    { key: "email", header: "e-Posta", render: renderV },
    {
      key: "name",
      header: "Adı",
      render: renderV,
    },
  ];

  const [users, setusers] = useState<usersData[]>([]);

  async function getUsers() {
    fetch("/api/user", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setusers(data);
      });
  }

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <AdminRoute>
      <div className="w-full overflow-x-auto">
        <DataTable<usersData> data={users} columns={columns} />
      </div>
    </AdminRoute>
  );
}
