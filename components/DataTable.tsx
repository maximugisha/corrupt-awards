interface DataTableProps {
  columns: string[];
  data: Record<string, any>[]; // Accept any type for data, including JSX
}

export default function DataTable({ columns, data }: DataTableProps) {
  return (
    <table className="table-auto w-full border-collapse border border-gray-300">
      <thead>
        <tr>
          {columns.map((column, index) => (
            <th key={index} className="border border-gray-300 px-4 py-2 text-black">
              {column}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {columns.map((column, colIndex) => (
              <td
                key={colIndex}
                className="border border-gray-300 px-4 py-2 text-black"
              >
                {typeof row[column.toLowerCase()] === "function"
                  ? row[column.toLowerCase()]() // Render function results
                  : row[column.toLowerCase()]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
