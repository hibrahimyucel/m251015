import React from "react";

import {
  FiCheckCircle,
  FiFilter,
  FiList,
  FiXCircle,
  FiArrowUp,
  FiArrowDown,
  FiMinusCircle,
  FiPlusCircle,
  FiLogOut,
  FiLogIn,
  FiCircle,
  FiCheckSquare,
  FiSquare,
  FiDelete,
} from "react-icons/fi";

type Ico =
  | "SortAscendant"
  | "SortDescendant"
  | "List"
  | "Filter"
  | "Ok"
  | "Cancel"
  | "Remove"
  | "Add"
  | "LogOut"
  | "LogIn"
  | "Circle"
  | "Checked"
  | "CheckedX"
  | "DeleteRow";
export function CheckIcon({ Checked }: { Checked: boolean | undefined }) {
  if (Checked)
    return (
      <FiCheckSquare className="shrink-0 justify-end text-2xl text-green-500" />
    );
  else
    return <FiSquare className="shrink-0 justify-end text-2xl text-gray-400" />;
}
export default function Icons({ icon }: { icon: Ico }) {
  switch (icon) {
    case "SortAscendant":
      return <FiArrowDown className="shrink-0 text-2xl text-blue-600" />;
    case "SortDescendant":
      return <FiArrowUp className="shrink-0 text-2xl text-blue-600" />;
    case "List":
      return <FiList className="shrink-0 text-2xl text-blue-600" />;
    case "Filter":
      return <FiFilter className="shrink-0 text-2xl text-blue-600" />;
    case "Ok":
      return <FiCheckCircle className="shrink-0 text-2xl text-blue-600" />;
    case "Cancel":
      return <FiXCircle className="shrink-0 text-2xl text-red-500" />;
    case "Remove":
      return <FiMinusCircle className="shrink-0 text-2xl text-blue-600" />;
    case "Add":
      return <FiPlusCircle className="shrink-0 text-2xl text-blue-600" />;
    case "LogOut":
      return <FiLogOut className="shrink-0 text-2xl text-blue-600" />;
    case "LogIn":
      return <FiLogIn className="shrink-0 text-2xl text-blue-600" />;
    case "Circle":
      return <FiCircle className="shrink-0 text-2xl text-blue-600" />;

    case "Checked":
      return <FiCheckSquare className="shrink-0 text-2xl text-green-500" />;
    case "CheckedX":
      return <FiSquare className="shrink-0 text-2xl text-gray-500" />;
    case "DeleteRow":
      return <FiDelete className="shrink-0 text-2xl text-red-500" />;
    default:
      return null;
  }
}
