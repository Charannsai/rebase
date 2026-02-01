// Raw Data Source
const rawData = {
    user: {
        id: "user_charan",
        name: "Charan Sai",
        role: "Full Stack Developer",
        bio: "Building modern products with scalable architectures. Passionate about system design and clean code.",
        email: "charan@example.com",
        github: "github.com/charansai",
        linkedin: "linkedin.com/in/charansai",
    },
    skills: [
        { id: "skill_react", name: "React", category: "Frontend" },
        { id: "skill_node", name: "Node.js", category: "Backend" },
        { id: "skill_supabase", name: "Supabase", category: "Backend" },
        { id: "skill_ts", name: "TypeScript", category: "Language" },
        { id: "skill_postgres", name: "PostgreSQL", category: "Database" },
        { id: "skill_tailwind", name: "TailwindCSS", category: "Frontend" },
    ],
    projects: [
        {
            id: "proj_eventorg",
            userId: "user_charan",
            title: "EventOrgX",
            description: "A comprehensive platform for organizing and managing large-scale virtual events.",
            year: 2025,
            skillIds: ["skill_react", "skill_node", "skill_supabase"],
        },
        {
            id: "proj_resumedb",
            userId: "user_charan",
            title: "ResumeDB",
            description: "A multi-view portfolio showing data through SQL, NoSQL, and traditional lenses.",
            year: 2024,
            skillIds: ["skill_react", "skill_tailwind", "skill_ts"],
        },
        {
            id: "proj_api_gateway",
            userId: "user_charan",
            title: "Custom API Gateway",
            description: "High-performance API gateway with rate limiting and analytics.",
            year: 2024,
            skillIds: ["skill_node", "skill_postgres"],
        }
    ],
    blogs: [
        {
            id: "blog_1",
            userId: "user_charan",
            title: "Scaling certificate generation with limited resources",
            publishedAt: "2024-11-15",
            projectId: "proj_eventorg"
        },
        {
            id: "blog_2",
            userId: "user_charan",
            title: "Why I chose SQL for my latest project",
            publishedAt: "2024-10-01",
            projectId: null
        }
    ]
};

// SQL Transformation (Normalized)
export const getSqlData = () => {
    const users = [raw.user];

    const projects = raw.projects.map(p => ({
        id: p.id,
        user_id: p.userId,
        title: p.title,
        description: p.description,
        year: p.year
    }));

    const skills = raw.skills;

    const project_skills = raw.projects.flatMap(p =>
        p.skillIds.map(sId => ({ project_id: p.id, skill_id: sId }))
    );

    const blogs = raw.blogs.map(b => ({
        id: b.id,
        user_id: b.userId,
        title: b.title,
        published_at: b.publishedAt,
        project_id: b.projectId
    }));

    // Helper to rename keys to snake_case for display if needed, but we keep object keys consistent for React rendering
    // We will handle "display" keys in the View component.

    return { users, projects, skills, project_skills, blogs };
};

// NoSQL Transformation (Embedded)
export const getNoSqlData = () => {
    return {
        _id: raw.user.id,
        profile: {
            name: raw.user.name,
            role: raw.user.role,
            bio: raw.user.bio,
            contact: {
                email: raw.user.email,
                github: raw.user.github,
                linkedin: raw.user.linkedin
            }
        },
        skills: raw.skills.map(s => s.name), // Simple array of strings for NoSQL view example, or objects? Prompt says ["React", ...]
        projects: raw.projects.map(p => ({
            title: p.title,
            year: p.year,
            description: p.description,
            tech: p.skillIds.map(id => raw.skills.find(s => s.id === id)?.name),
            blogs: raw.blogs
                .filter(b => b.projectId === p.id)
                .map(b => ({ title: b.title, published_at: b.publishedAt }))
        }))
    };
};

export const getPortfolioData = () => {
    return {
        user: raw.user,
        projects: raw.projects.map(p => ({
            ...p,
            skills: p.skillIds.map(id => raw.skills.find(s => s.id === id))
        })),
        skills: raw.skills,
        blogs: raw.blogs
    }
}

const raw = rawData;
