import { motion } from "framer-motion";
import { Github, Linkedin, Mail, ExternalLink, Calendar } from "lucide-react";
import { getPortfolioData } from "../data/portfolioData";

export default function PortfolioView() {
    const data = getPortfolioData();

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="max-w-4xl mx-auto px-4 pt-32 pb-20 space-y-24"
        >
            {/* Hero Section */}
            <motion.section variants={item} className="space-y-6">
                <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-white">
                    {data.user.name}
                </h1>
                <h2 className="text-2xl sm:text-3xl font-light text-blue-400">
                    {data.user.role}
                </h2>
                <p className="text-lg text-gray-400 max-w-2xl leading-relaxed">
                    {data.user.bio}
                </p>
                <div className="flex gap-4 pt-4">
                    <a href={`mailto:${data.user.email}`} className="p-2 text-gray-400 hover:text-white transition-colors">
                        <Mail className="w-6 h-6" />
                    </a>
                    <a href={`https://${data.user.github}`} target="_blank" rel="noreferrer" className="p-2 text-gray-400 hover:text-white transition-colors">
                        <Github className="w-6 h-6" />
                    </a>
                    <a href={`https://${data.user.linkedin}`} target="_blank" rel="noreferrer" className="p-2 text-gray-400 hover:text-white transition-colors">
                        <Linkedin className="w-6 h-6" />
                    </a>
                </div>
            </motion.section>

            {/* Skills Section */}
            <motion.section variants={item} className="space-y-8">
                <h3 className="text-2xl font-semibold text-white border-b border-slate-800 pb-4">Technical Expertise</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {data.skills.map((skill) => (
                        <div key={skill.id} className="group">
                            <div className="text-gray-400 text-sm mb-1">{skill.category}</div>
                            <div className="text-gray-200 font-medium group-hover:text-blue-400 transition-colors">
                                {skill.name}
                            </div>
                        </div>
                    ))}
                </div>
            </motion.section>

            {/* Projects Section */}
            <motion.section variants={item} className="space-y-8">
                <h3 className="text-2xl font-semibold text-white border-b border-slate-800 pb-4">Selected Work</h3>
                <div className="grid gap-8">
                    {data.projects.map((project) => (
                        <div key={project.id} className="group bg-slate-800/30 rounded-2xl p-6 hover:bg-slate-800/50 transition-all border border-slate-800 hover:border-slate-700">
                            <div className="flex justify-between items-start mb-4">
                                <h4 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                                    {project.title}
                                </h4>
                                <span className="text-sm font-mono text-gray-500">{project.year}</span>
                            </div>
                            <p className="text-gray-400 mb-6 leading-relaxed">
                                {project.description}
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {project.skills.map((skill) => (
                                    <span key={skill.id} className="px-3 py-1 text-xs rounded-full bg-slate-900 text-gray-300 border border-slate-700">
                                        {skill.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </motion.section>

            {/* Blogs Section */}
            <motion.section variants={item} className="space-y-8">
                <h3 className="text-2xl font-semibold text-white border-b border-slate-800 pb-4">Writing & Thoughts</h3>
                <div className="space-y-6">
                    {data.blogs.map((blog) => (
                        <article key={blog.id} className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6 group cursor-pointer">
                            <span className="text-sm font-mono text-gray-500 min-w-[100px] group-hover:text-gray-400 transition-colors">
                                {blog.publishedAt}
                            </span>
                            <h4 className="text-lg text-gray-200 font-medium group-hover:text-blue-400 transition-colors">
                                {blog.title}
                            </h4>
                        </article>
                    ))}
                </div>
            </motion.section>

            <motion.footer variants={item} className="pt-20 border-t border-slate-800 text-center text-gray-500 text-sm">
                <p>© {new Date().getFullYear()} {data.user.name}. All rights reserved.</p>
            </motion.footer>
        </motion.div>
    );
}
