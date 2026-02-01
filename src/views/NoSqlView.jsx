import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileJson, ChevronRight, ChevronDown, Braces, Info } from "lucide-react";
import { getNoSqlData } from "../data/portfolioData";
import { cn } from "../utils/cn";

const JsonNode = ({ label, value, isLast }) => {
    const [isOpen, setIsOpen] = useState(true);

    if (value === null) return <div className="text-gray-500">null</div>;

    const isObject = typeof value === 'object' && !Array.isArray(value);
    const isArray = Array.isArray(value);
    const isExpandable = isObject || isArray;

    const toggle = (e) => {
        e.stopPropagation();
        setIsOpen(!isOpen);
    };

    const renderValue = (val) => {
        if (typeof val === 'string') return <span className="text-emerald-300">"{val}"</span>;
        if (typeof val === 'number') return <span className="text-orange-300">{val}</span>;
        if (typeof val === 'boolean') return <span className="text-pink-300">{val.toString()}</span>;
        return <span className="text-gray-400">{String(val)}</span>;
    }

    if (isExpandable) {
        const isEmpty = Object.keys(value).length === 0;
        const startBracket = isArray ? "[" : "{";
        const endBracket = isArray ? "]" : "}";
        const typeLabel = isArray ? `Array(${value.length})` : "Object";

        return (
            <div className="font-mono text-sm leading-relaxed ml-4">
                <div
                    className="flex items-center gap-1 cursor-pointer hover:bg-slate-800/50 rounded -ml-4 px-1 select-none"
                    onClick={toggle}
                >
                    <span className="text-gray-600 w-4 h-4 flex items-center justify-center">
                        {!isEmpty && (isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />)}
                    </span>
                    {label && <span className="text-blue-300 mr-2">"{label}":</span>}
                    <span className="text-gray-500">{startBracket}</span>
                    {!isOpen && (
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-gray-600 text-xs mx-2 italic"
                        >
                            ...
                        </motion.span>
                    )}
                    {!isOpen && <span className="text-gray-500">{endBracket}{!isLast && ","}</span>}

                    {/* "Embedded" Hint on hover for specific known nested fields */}
                    {(label === "projects" || label === "skills" || label === "profile") && (
                        <span className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] bg-green-900/30 text-green-400 px-2 py-0.5 rounded border border-green-800/50 hidden sm:inline-block">
                            Embedded for read performance
                        </span>
                    )}
                </div>

                <AnimatePresence>
                    {isOpen && !isEmpty && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="border-l border-slate-700/50 ml-[5px] pl-4 overflow-hidden"
                        >
                            {Object.entries(value).map(([key, val], idx, arr) => (
                                <div key={key} className="group">
                                    <JsonNode
                                        label={isArray ? null : key}
                                        value={val}
                                        isLast={idx === arr.length - 1}
                                    />
                                </div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                {isOpen && (
                    <div className="text-gray-500 ml-[-1rem] pl-4">
                        {endBracket}{!isLast && ","}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="font-mono text-sm ml-4 hover:bg-slate-800/30 rounded -ml-4 px-1 py-0.5 flex">
            {label && <span className="text-blue-300 mr-2">"{label}":</span>}
            <div>
                {renderValue(value)}
                {!isLast && <span className="text-gray-500">,</span>}
            </div>
        </div>
    );
};

export default function NoSqlView() {
    const data = getNoSqlData();

    return (
        <div className="pt-24 pb-12 px-4 max-w-5xl mx-auto min-h-screen flex flex-col">
            <div className="mb-6 bg-green-900/20 border border-green-800/50 p-4 rounded-xl flex items-start gap-3">
                <Info className="w-5 h-5 text-green-400 mt-0.5 shrink-0" />
                <div>
                    <h3 className="font-semibold text-green-300">Document Model</h3>
                    <p className="text-sm text-green-200/70">
                        Data is embedded in a single JSON document. Optimized for fast reads,
                        schema flexibility, and minimizing database joins.
                    </p>
                </div>
            </div>

            <div className="flex-1 bg-slate-900 rounded-xl border border-slate-700 shadow-2xl relative overflow-hidden flex flex-col">
                {/* Window controls decoration */}
                <div className="h-10 bg-slate-800/50 border-b border-slate-700 flex items-center px-4 gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                    <div className="ml-4 text-xs font-mono text-gray-500 flex items-center gap-2">
                        <FileJson className="w-3 h-3" />
                        database.json
                    </div>
                </div>

                <div className="flex-1 overflow-auto p-6 custom-scrollbar">
                    <JsonNode value={data} isLast={true} />
                </div>
            </div>
        </div>
    );
}
