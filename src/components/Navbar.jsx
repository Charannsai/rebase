import { Layout, Database, FileJson, User } from "lucide-react";
import { cn } from "../utils/cn";

export default function Navbar({ currentView, setView }) {
    const items = [
        { id: "portfolio", label: "Portfolio", icon: User },
        { id: "sql", label: "SQL Model", icon: Database },
        { id: "nosql", label: "NoSQL Model", icon: FileJson },
    ];

    return (
        <nav className="fixed top-0 z-50 w-full bg-slate-900/90 border-b border-slate-800 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex-shrink-0 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                            <span className="text-white font-bold text-xl">C</span>
                        </div>
                        <span className="text-gray-100 font-bold text-lg hidden sm:block">Charan Sai</span>
                    </div>

                    <div className="flex items-center space-x-1 bg-slate-800/50 p-1 rounded-xl border border-slate-700/50">
                        {items.map((item) => {
                            const Icon = item.icon;
                            const isActive = currentView === item.id;

                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setView(item.id)}
                                    className={cn(
                                        "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200",
                                        isActive
                                            ? "bg-slate-700 text-white shadow-sm"
                                            : "text-gray-400 hover:text-gray-200 hover:bg-slate-800"
                                    )}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span className="hidden sm:inline">{item.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </nav>
    );
}
