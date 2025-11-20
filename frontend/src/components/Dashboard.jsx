import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export default function Dashboard({ analysis }) {
  if (!analysis) return null

  const { aiAnalysis } = analysis
  const severityColors = {
    Critical: "#dc2626",
    High: "#f97316",
    Medium: "#eab308",
    Low: "#22c55e",
  }

  // Prepare data for error types chart
  const errorTypeData = (aiAnalysis.error_types || []).map((type, idx) => ({
    name: type || `Error ${idx + 1}`,
    value: 1,
  }))

  // Prepare data for affected modules chart
  const modulesData = (aiAnalysis.affected_modules || []).map((module, idx) => ({
    name: module || `Module ${idx + 1}`,
    value: idx + 1,
  }))

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800 rounded-lg shadow-lg p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Summary</h3>
          <p className="text-slate-300 text-sm leading-relaxed">{aiAnalysis.summary}</p>
        </div>

        <div className="bg-slate-800 rounded-lg shadow-lg p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Root Cause</h3>
          <p className="text-slate-300 text-sm leading-relaxed">{aiAnalysis.root_cause}</p>
          <div className="mt-4">
            <span
              className="inline-block px-4 py-2 rounded-full text-sm font-semibold"
              style={{
                backgroundColor: severityColors[aiAnalysis.severity],
                color: "white",
                opacity: 0.8,
              }}
            >
              Severity: {aiAnalysis.severity}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {errorTypeData.length > 0 && (
          <div className="bg-slate-800 rounded-lg shadow-lg p-6 border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4">Error Types</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={errorTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name }) => name}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {errorTypeData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"][index % 5]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {modulesData.length > 0 && (
          <div className="bg-slate-800 rounded-lg shadow-lg p-6 border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4">Affected Modules</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={modulesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }} />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800 rounded-lg shadow-lg p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Recommendations</h3>
          <ul className="space-y-2">
            {(aiAnalysis.recommendations || []).map((rec, idx) => (
              <li key={idx} className="flex items-start text-slate-300 text-sm">
                <span className="text-green-400 mr-3 font-bold">✓</span>
                <span>{rec}</span>
              </li>
            ))}
            {(!aiAnalysis.recommendations || aiAnalysis.recommendations.length === 0) && (
              <p className="text-slate-500">No recommendations available</p>
            )}
          </ul>
        </div>

        <div className="bg-slate-800 rounded-lg shadow-lg p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Duplicate Patterns</h3>
          <ul className="space-y-2">
            {(aiAnalysis.possible_duplicates || []).map((dup, idx) => (
              <li key={idx} className="flex items-start text-slate-300 text-sm">
                <span className="text-yellow-400 mr-3 font-bold">⚠</span>
                <span>{dup}</span>
              </li>
            ))}
            {(!aiAnalysis.possible_duplicates || aiAnalysis.possible_duplicates.length === 0) && (
              <p className="text-slate-500">No duplicate patterns detected</p>
            )}
          </ul>
        </div>
      </div>

      {aiAnalysis.stack_trace && (
        <div className="bg-slate-800 rounded-lg shadow-lg p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Stack Trace</h3>
          <pre className="bg-slate-900 p-4 rounded border border-slate-700 text-slate-300 text-xs overflow-x-auto whitespace-pre-wrap break-words">
            {aiAnalysis.stack_trace}
          </pre>
        </div>
      )}
    </div>
  )
}
