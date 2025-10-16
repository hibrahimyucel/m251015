import { ReactNode } from "react";

type Column<T> = {
  key: keyof T;
  header: string;
  render?: (value: T[keyof T], id: string | number) => ReactNode;
};

type DataTableProps<T> = {
  data: T[];
  columns: Column<T>[];
};

export default function DataTable<T extends { id: number | string }>({
  data,
  columns,
}: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="border-buttoncolor min-w-full border-collapse border">
        <TableHeader columns={columns} />
        <tbody>
          {data.map((row, index) => (
            <TableRow key={row.id} row={row} columns={columns} index={index} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

type TableHeaderProps<T> = {
  columns: Column<T>[];
};

function TableHeader<T>({ columns }: TableHeaderProps<T>) {
  return (
    <thead>
      <tr className="bg-buttoncolor">
        {columns.map((column) => (
          <th key={String(column.key)} className="border p-2">
            {column.header}
          </th>
        ))}
      </tr>
    </thead>
  );
}

type TableRowProps<T> = {
  row: T;
  columns: Column<T>[];
  index: number;
};

function TableRow<T extends { id: number | string }>({
  row,
  columns,
  index,
}: TableRowProps<T>) {
  return (
    <tr
      key={row.id}
      className={`${index % 2 ? "bg-background" : "bg-diffcolor"} `}
    >
      {columns.map((column) => (
        <TableCell
          id={row.id}
          key={String(column.key)}
          value={row[column.key]}
          render={column.render}
        />
      ))}
    </tr>
  );
}

type TableCellProps<T> = {
  id: string | number;
  value: T;
  render?: (value: T, id: string | number) => ReactNode;
};

function TableCell<T>({ id, value, render }: TableCellProps<T>) {
  return <td>{render ? render(value, id) : String(value)}</td>;
}
