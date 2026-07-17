"use client";

interface PreviewTableProps {
  headers: string[];
  rows: any[];
}

export default function PreviewTable({
  headers,
  rows,
}: PreviewTableProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">

      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Data Preview
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Preview the first few rows before importing into CRM.
        </p>
      </div>

      {headers.length === 0 ? (

        <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-gray-500 font-medium">No data to preview</p>
          <p className="text-sm text-gray-400 mt-1">Select a spreadsheet and worksheet to preview data.</p>
        </div>

      ) : (

        <div className="overflow-x-auto rounded-lg border border-gray-200">

          <table className="w-full text-sm border-collapse">

            <thead>

              <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">

                {headers.map((header) => (
                  <th
                    key={header}
                    className="text-left p-3 font-semibold text-gray-700 text-xs uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}

              </tr>

            </thead>

            <tbody>

              {rows.map((row, index) => (

                <tr
                  key={index}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >

                  {row.map((cell: any, i: number) => (

                    <td
                      key={i}
                      className="p-3 text-gray-700"
                    >
                      {cell}
                    </td>

                  ))}

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

    </div>
  );
}