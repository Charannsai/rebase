import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Database, Key, Table as TableIcon, Info } from "lucide-react";
import { getSqlData } from "../data/portfolioData";
import { cn } from "../utils/cn";

export default function SqlView() {
    const data = getSqlData();
    const [activeTable, setActiveTable] = useState("users");
    const [hoveredFk, setHoveredFk] = useState(null);

    const tables = Object.keys(data);

    // Schema definitions for visual cues (PK/FK)
    const schema = {
        users: { pk: "id" },
        projects: { pk: "id", fks: { user_id: "users" } },
        skills: { pk: "id" },
        project_skills: { fks: { project_id: "projects", skill_id: "skills" } },
        blogs: { pk: "id", fks: { user_id: "users", project_id: "projects" } }
    };

    const currentSchema = schema[activeTable];
    const tableData = data[activeTable];
    const columns = tableData.length > 0 ? Object.keys(tableData[0]) : [];

    return (
        <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto h-[calc(100vh-4rem)] flex flex-col">
            <div className="mb-6 bg-blue-900/20 border border-blue-800/50 p-4 rounded-xl flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" />
                <div>
                    <h3 className="font-semibold text-blue-300">Relational Model</h3>
                    <p className="text-sm text-blue-200/70">
                        Data is normalized into tables with strict relationships.
                        Optimized for consistency, complex queries, and data integrity.
                    </p>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-[250px_1fr] gap-6 overflow-hidden">
                {/* Sidebar: Tables List */}
                <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden flex flex-col">
                    <div className="p-4 bg-slate-800/80 border-b border-slate-700 font-mono text-sm text-gray-400 uppercase tracking-wider">
                        Tables
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-1">
                        {tables.map((tableName) => (
                            <button
                                key={tableName}
                                onClick={() => setActiveTable(tableName)}
                                className={cn(
                                    "w-full text-left px-3 py-2 rounded-lg text-sm font-mono flex items-center justify-between transition-colors",
                                    activeTable === tableName
                                        ? "bg-blue-600/20 text-blue-300 border border-blue-500/30"
                                        : "text-gray-400 hover:bg-slate-700/50 hover:text-gray-200",
                                    hoveredFk === tableName && activeTable !== tableName && "bg-purple-900/30 text-purple-300 border border-purple-500/30 ring-1 ring-purple-500/50"
                                )}
                            >
                                <div className="flex items-center gap-2">
                                    <TableIcon className="w-4 h-4 opacity-70" />
                                    <span>{tableName}</span>
                                </div>
                                {hoveredFk === tableName && (
                                    <span className="text-[10px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded uppercase">
                                        Relation
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main: Active Table */}
                <div className="bg-slate-900 rounded-xl border border-slate-700 flex flex-col overflow-hidden shadow-xl">
                    <div className="p-4 border-b border-slate-800 bg-slate-800/30 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Database className="w-4 h-4 text-blue-400" />
                            <span className="font-mono text-gray-200 font-semibold">{activeTable}</span>
                        </div>
                        <div className="text-xs text-gray-500 font-mono">
                            {tableData.length} records
                        </div>
                    </div>

                    <div className="flex-1 overflow-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-800/80 sticky top-0 z-10">
                                <tr>
                                    {columns.map((col) => {
                                        const isPk = currentSchema?.pk === col;
                                        const isFk = currentSchema?.fks?.[col];
                                        return (
                                            <th key={col} className="p-4 text-xs font-mono text-gray-400 uppercase tracking-wider border-b border-slate-700 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    {col}
                                                    {isPk && <Key className="w-3 h-3 text-yellow-500" />}
                                                    {isFk && <Key className="w-3 h-3 text-purple-400 rotate-90" />}
                                                </div>
                                            </th>
                                        );
                                    })}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50 font-mono text-sm">
                                <AnimatePresence mode="wait">
                                    {tableData.map((row, idx) => (
                                        <motion.tr
                                            key={idx}
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="hover:bg-slate-800/30"
                                        >
                                            {columns.map((col) => {
                                                const isFkTo = currentSchema?.fks?.[col];
                                                return (
                                                    <td
                                                        key={col}
                                                        className={cn(
                                                            "p-4 text-gray-300 whitespace-nowrap border-b border-slate-800/50",
                                                            isFkTo && "text-purple-300 cursor-help underline decoration-purple-500/30 decoration-dashed underline-offset-4"
                                                        )}
                                                        onMouseEnter={() => isFkTo && setHoveredFk(isFkTo)}
                                                        onMouseLeave={() => setHoveredFk(null)}
                                                    >
                                                        <span className="opacity-90">{String(row[col])}</span>
                                                        {isFkTo && hoveredFk === isFkTo && (
                                                            <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] bg-purple-500/10 text-purple-400 border border-purple-500/20">
                                                                → {isFkTo}
                                                            </span>
                                                        )}
                                                    </td>
                                                );
                                            })}
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                        {tableData.length === 0 && (
                            <div className="p-8 text-center text-gray-500 font-mono text-sm">Empty Table</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
