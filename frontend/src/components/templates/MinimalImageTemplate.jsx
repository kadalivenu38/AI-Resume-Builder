import { Mail, Phone, MapPin } from "lucide-react";

import {
    hasArrayData,
    hasSkillsData,
    formatDate,
    getBulletPoints,
    getProfileLinks,
} from "./utilsFunctions";

const MinimalImageTemplate = ({
    data,
    accentColor,
}) => {
    const profileLinks = getProfileLinks(
        data.personal_info || {}
    );

    const allSkills = [
        ...(data.skills?.languages || []),
        ...(data.skills?.development || []),
        ...(data.skills?.cloud || []),
        ...(data.skills?.tools || []),
    ];

    return (
        <div className="max-w-5xl mx-auto bg-white text-zinc-800">
            <div className="grid grid-cols-3">

                {/* ================= HEADER IMAGE ================= */}

                <div className="col-span-1 pt-5">
                    {data.personal_info?.image && typeof data.personal_info.image === "string" ? (
                        <div className="w-32 h-32 rounded-full overflow-hidden mx-auto flex items-center justify-center"
                            style={{ backgroundColor: accentColor + "30" }}>
                            <img src={data.personal_info.image} className="w-full h-full object-contain" alt="" />
                        </div>
                    ) : data.personal_info?.image && typeof data.personal_info.image === "object" ? (
                        <div className="w-32 h-32 rounded-full overflow-hidden mx-auto flex items-center justify-center"
                            style={{ backgroundColor: accentColor + "30" }}>
                            <img src={URL.createObjectURL(data.personal_info.image)} className="w-full h-full object-cover" alt="" />
                        </div>
                    ) : null}
                </div>

                {/* ================= HEADER ================= */}

                <div className="col-span-2 flex flex-col justify-center py-3">
                    <h1 className="text-4xl font-bold tracking-widest text-zinc-700">
                        {data.personal_info?.full_name || "Your Name"}
                    </h1>

                    {data.personal_info?.job_role && (
                        <p className="uppercase tracking-widest text-sm font-medium" style={{ color: accentColor }}>
                            {data.personal_info.job_role}
                        </p>
                    )}
                    {profileLinks.length > 0 && (
                        <div className="flex flex-wrap gap-3">
                            {profileLinks.map((link) => (
                                <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer"
                                    className="block text-sm text-blue-700 hover:underline mt-3">
                                    {link.label}
                                </a>
                            ))}
                        </div>
                    )}
                </div>

                {/* ================= LEFT SIDEBAR ================= */}

                <aside className="col-span-1 border-r border-zinc-400 p-5 overflow-hidden">

                    {/* CONTACT */}

                    {(data.personal_info?.phone || data.personal_info?.email || data.personal_info?.location) && (
                        <section className="mb-3">
                            <h2 className="font-semibold tracking-widest" style={{ color: accentColor }}>
                                CONTACT
                            </h2>

                            {data.personal_info?.phone && (
                                <div className="flex gap-2 items-center text-sm">
                                    <Phone size={14} style={{ color: accentColor }} />
                                    <span>{data.personal_info.phone}</span>
                                </div>
                            )}

                            {data.personal_info?.email && (
                                <div className="flex gap-2 items-center text-sm">
                                    <Mail size={14} style={{ color: accentColor }} />
                                    <span>{data.personal_info.email}</span>
                                </div>
                            )}

                            {data.personal_info?.location && (
                                <div className="flex gap-2 items-center text-sm">
                                    <MapPin size={14} style={{ color: accentColor }} />
                                    <span>{data.personal_info.location}</span>
                                </div>
                            )}
                        </section>
                    )}

                    {/* EDUCATION */}

                    {hasArrayData(data.education) && (
                        <section className="mb-3">
                            <h2 className="font-semibold tracking-widest" style={{ color: accentColor }}>
                                EDUCATION
                            </h2>

                            <div className="space-y-2 text-sm">
                                {data.education.filter((edu) => edu.degree || edu.institution).map((edu, index) => (
                                    <div key={index}>
                                        <div className="flex justify-between flex-wrap">
                                            <p className="font-semibold uppercase">
                                                {edu.degree}
                                            </p>
                                            {(edu.start_date || edu.graduation_date) && (
                                                <p className="text-xs text-zinc-500">
                                                    {formatDate(edu.start_date)}
                                                    {" - "}
                                                    {edu.is_current ? "Present" : formatDate(edu.graduation_date)}
                                                </p>
                                            )}
                                        </div>

                                        {edu.field_of_study && (
                                            <p>{edu.field_of_study}</p>
                                        )}

                                        <p className="text-zinc-600">
                                            {edu.institution}
                                        </p>

                                        {edu.score && (
                                            <p className="text-xs">
                                                Score:{" "}{edu.score}
                                            </p>
                                        )}
                                    </div >
                                )
                                )}
                            </div>
                        </section>
                    )}

                    {/* SKILLS */}

                    {hasSkillsData(data.skills) && (
                        <section>
                            <h2 className="font-semibold tracking-widest" style={{ color: accentColor }}>
                                SKILLS
                            </h2>

                            <ul className="text-sm">
                                {allSkills.map((skill, index) => (
                                    <li key={index}>{skill}</li>
                                ))}
                            </ul>
                        </section>
                    )}
                </aside>

                {/* ================= RIGHT CONTENT STARTS IN PART 2 ================= */}

                <main className="col-span-2 px-5 overflow-hidden leading-normal">
                    {/* SUMMARY */}

                    {data.professional_summary && (
                        <section className="mb-3">
                            <h2 className="font-semibold tracking-widest" style={{ color: accentColor }}>
                                SUMMARY
                            </h2>

                            <p className="text-sm text-zinc-700 text-justify">
                                {data.professional_summary}
                            </p>
                        </section>
                    )}

                    {/* EXPERIENCE */}

                    {hasArrayData(data.experience) && (
                        <section className="mb-3">
                            <h2 className="font-semibold tracking-widest" style={{ color: accentColor }}>
                                EXPERIENCE
                            </h2>

                            {data.experience.filter((exp) => exp.company || exp.position || exp.description).map((exp, index) => (
                                <div key={index} className="mb-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-semibold">{exp.company}</p>
                                            <p className="text-sm italic" style={{ color: accentColor }}>{exp.position}</p>
                                        </div>

                                        {(exp.start_date || exp.end_date) && (
                                            <span className="text-xs text-zinc-500 whitespace-nowrap">
                                                {formatDate(exp.start_date)}{" - "}
                                                {exp.is_current ? "Present" : formatDate(exp.end_date)}
                                            </span>
                                        )}
                                    </div>

                                    <ul className="list-disc list-inside text-sm text-zinc-700 mt-1">
                                        {getBulletPoints(exp.description).map((point, i) => (
                                            <li key={i}>{point}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </section>
                    )}

                    {/* PROJECTS */}

                    {hasArrayData(data.projects) && (
                        <section className="mb-3">
                            <h2 className="font-semibold tracking-widest" style={{ color: accentColor }}>
                                PROJECTS
                            </h2>

                            {data.projects.map((project, index) => (
                                <div key={index} className="mb-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-semibold">{project.name}</p>
                                            <p className="text-sm italic" style={{ color: accentColor }}>
                                                {project.tech_stack}
                                            </p>
                                        </div>

                                        {project.link && (
                                            <a href={project.link} target="_blank" rel="noopener noreferrer"
                                                className="text-sm hover:underline whitespace-nowrap text-blue-600">
                                                Live Demo
                                            </a>
                                        )}
                                    </div>

                                    {project.description && (
                                        <ul className="list-disc list-inside text-sm text-zinc-700 mt-1">
                                            {getBulletPoints(project.description).map((point, i) => (
                                                <li key={i}>{point}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </section>
                    )}

                    {/* CERTIFICATIONS */}

                    {hasArrayData(data.certifications) && (
                        <section className="mb-3">
                            <h2 className="font-semibold tracking-widest" style={{ color: accentColor }}>
                                CERTIFICATIONS
                            </h2>

                            {data.certifications.map((cert, index) => (
                                <div key={index} className="flex justify-between items-start text-sm">
                                    {cert.link ? (
                                        <a href={cert.link} target="_blank" rel="noopener noreferrer"
                                            className="hover:underline hover:text-blue-600"                                                >
                                            {cert.name}
                                        </a>
                                    ) : (
                                        <p>{cert.name}</p>
                                    )}

                                    <p className="text-zinc-500">
                                        {cert.issuer}
                                    </p>

                                    <span className="text-xs text-zinc-500 whitespace-nowrap">
                                        {formatDate(cert.date)}
                                    </span>
                                </div>
                            ))}
                        </section>
                    )}

                    {/* ACHIEVEMENTS */}

                    {hasArrayData(data.achievements) && (
                        <section>
                            <h2 className="font-semibold tracking-widest" style={{ color: accentColor }}>
                                ACHIEVEMENTS
                            </h2>

                            <ul className="list-disc list-inside text-sm text-zinc-700">
                                {data.achievements.map((achievement, index) => (
                                    <li key={index}>
                                        {achievement.point}
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}
                </main>
            </div>
        </div>
    );
};

export default MinimalImageTemplate;