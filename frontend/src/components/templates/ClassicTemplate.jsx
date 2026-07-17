import React from "react";
import {
    hasValue,
    formatDate,
    renderDateRange,
    getProjectLinkLabel,
} from "./utilsFunctions.js";

const ClassicTemplate = ({ data, accentColor }) => {

    /* ===========================Utility Functions============================ */
    const renderBullets = (text) => {
        if (!hasValue(text)) return null;

        return (
            <ul className="list-disc pl-5 mt-1 space-y-0.5 text-[13.5px] leading-[1.45]">
                {text.split("\n").filter(line => line.trim()).map((line, index) => (
                    <li key={index}>{line}</li>
                ))}
            </ul>
        );
    };

    /* ============================Social Links============================ */
    const socialLinks = [
        {
            label: "LinkedIn",
            url: data.personal_info?.linkedin,
        },
        {
            label: "GitHub",
            url: data.personal_info?.github,
        },
        {
            label: "LeetCode",
            url: data.personal_info?.leetcode,
        },
        {
            label: "HackerRank",
            url: data.personal_info?.hackerrank,
        },
        {
            label: "Codeforces",
            url: data.personal_info?.codeforces,
        },
        {
            label: "GeeksforGeeks",
            url: data.personal_info?.geeksforgeeks,
        },
        {
            label: "Portfolio",
            url: data.personal_info?.website,
        },
    ].filter(link => hasValue(link.url));

    /* ==========================Filter Empty Data=========================== */
    const experiences = (data.experience || []).filter(exp => hasValue(exp.company) || hasValue(exp.position) || hasValue(exp.description));
    const projects = (data.projects || []).filter(project => hasValue(project.name) || hasValue(project.description));
    const education = (data.education || []).filter(edu => hasValue(edu.institution) || hasValue(edu.degree));
    const certifications = (data.certifications || []).filter(cert => hasValue(cert.name));
    const achievements = (data.achievements || []).filter(item => hasValue(item.point));
    const skills = data.skills || {
        languages: [],
        development: [],
        cloud: [],
        tools: [],
    };

    const nameClass = data.personal_info?.full_name?.length > 28 ? "text-[24px]" : "text-[28px]";

    const SectionHeading = ({ title }) => (
        <div className="my-1 border-b" style={{ borderColor: accentColor }}>
            <h2 className="text-[14px] font-bold uppercase tracking-[0.18em]" style={{ color: accentColor }}>
                {title}
            </h2>
        </div>
    );

    return (
        <div className="mx-auto bg-white text-gray-900"
            style={{ width: "8.5in", minHeight: "11in", fontFamily: "Arial, Helvetica, Calibri, sans-serif" }}>
            <div className="px-6 py-4">
                {/* ========================= HEADER ========================= */}
                <header className="border-b-2 text-center mb-3" style={{ borderColor: accentColor }}>
                    {/* Name */}
                    {hasValue(data.personal_info?.full_name) && (
                        <h1 className={`${nameClass} font-bold uppercase tracking-wide leading-none`} style={{ color: accentColor }}>
                            {data.personal_info.full_name}
                        </h1>
                    )}

                    {/* Job Role */}
                    {hasValue(data.personal_info?.job_role) && (
                        <p className="mt-1 text-[15px] font-medium text-gray-700">
                            {data.personal_info.job_role}
                        </p>
                    )}

                    {/* Contact Information */}
                    {(hasValue(data.personal_info?.email) || hasValue(data.personal_info?.phone) ||
                        hasValue(data.personal_info?.location)) && (
                            <div className="flex flex-wrap justify-center text-[13px] leading-5 text-gray-700">
                                {hasValue(data.personal_info?.email) && (
                                    <span>{data.personal_info.email}</span>
                                )}

                                {hasValue(data.personal_info?.phone) && (
                                    <>
                                        {hasValue(data.personal_info?.email) && (
                                            <span className="mx-2">|</span>
                                        )}
                                        <span>{data.personal_info.phone}</span>
                                    </>
                                )}

                                {hasValue(data.personal_info?.location) && (
                                    <>
                                        {(hasValue(data.personal_info?.email) || hasValue(data.personal_info?.phone)) && (
                                            <span className="mx-2">|</span>
                                        )}
                                        <span>{data.personal_info.location}</span>
                                    </>
                                )}

                                {socialLinks.map((link, index) => (
                                    <React.Fragment key={index}>
                                        <span className="mx-2 text-gray-400">|</span>
                                        <a href={link.url} target="_blank" rel="noopener noreferrer"
                                            className="text-blue-700 hover:underline">
                                            {link.label}
                                        </a>
                                    </React.Fragment>
                                ))}
                            </div>
                        )}
                </header>

                {/* =========================SUMMARY========================= */}
                {hasValue(data.professional_summary) && (
                    <section className="mb-2 leading-5 text-sm">
                        <SectionHeading title="Summary" />
                        <p className="text-gray-800 text-justify">
                            {data.professional_summary}
                        </p>
                    </section>
                )}

                {/* =========================EXPERIENCE========================= */}
                {experiences.length > 0 && (
                    <section className="mb-2">
                        <SectionHeading title="Experience" />
                        {experiences.map((exp, index) => (
                            <div key={index} className="text-sm leading-4 mb-1">
                                {/* Company & Date */}
                                <div className="grid grid-cols-[minmax(0,1fr)_110px] gap-4 items-start">
                                    <div>
                                        {hasValue(exp.company) && (
                                            <h3 className="font-bold text-gray-900">
                                                {exp.company}
                                            </h3>
                                        )}
                                        {hasValue(exp.position) && (
                                            <p className="font-medium text-gray-700">
                                                {exp.position}
                                            </p>
                                        )}
                                    </div>
                                    {renderDateRange(exp.start_date, exp.end_date, exp.is_current) && (
                                        <span className="text-[12px] text-gray-500 whitespace-nowrap">
                                            {renderDateRange(exp.start_date, exp.end_date, exp.is_current)}
                                        </span>
                                    )}
                                </div>
                                {renderBullets(exp.description)}

                            </div>
                        ))}
                    </section>
                )}

                {/* =========================PROJECTS========================= */}
                {projects.length > 0 && (
                    <section className="mb-2">
                        <SectionHeading title="Projects" />
                        {projects.map((project, index) => (
                            <div key={index} className="text-sm leading-4 mb-1">
                                {/* Project Name & Link */}
                                <div className="grid grid-cols-[minmax(0,1fr)_110px] gap-4 items-start">
                                    <div>
                                        {hasValue(project.name) && (
                                            <h3 className="font-bold text-gray-900">
                                                {project.name}
                                            </h3>
                                        )}
                                        {hasValue(project.tech_stack) && (
                                            <p className="text-gray-600 italic">
                                                {project.tech_stack}
                                            </p>
                                        )}
                                    </div>
                                    {hasValue(project.link) && (
                                        <a href={project.link} target="_blank" rel="noopener noreferrer"
                                            className="whitespace-nowrap hover:underline" style={{ color: accentColor }}>
                                            {getProjectLinkLabel(project.link)}
                                        </a>
                                    )}
                                </div>
                                {renderBullets(project.description)}
                            </div>
                        ))}
                    </section>
                )}

                {/* =========================EDUCATION========================= */}
                {education.length > 0 && (
                    <section className="mb-1">
                        <SectionHeading title="Education" />
                        {education.map((edu, index) => (
                            <div key={index}>
                                {/* Institution & Dates */}
                                <div className="grid grid-cols-[minmax(0,1fr)_110px] gap-4 items-start">
                                    <div className="leading-tight mb-1">
                                        {hasValue(edu.institution) && (
                                            <h3 className="text-[14px] font-bold text-gray-900">
                                                {edu.institution}
                                            </h3>
                                        )}
                                        {(hasValue(edu.degree) || hasValue(edu.field_of_study)) && (
                                            <p className="text-sm text-gray-700">
                                                {hasValue(edu.degree) && edu.degree}
                                                {hasValue(edu.degree) && hasValue(edu.field_of_study) && " - "}
                                                {hasValue(edu.field_of_study) && edu.field_of_study}
                                            </p>
                                        )}
                                        {hasValue(edu.score) && (
                                            <p className="text-[13px] text-gray-700">
                                                Score: {edu.score}
                                            </p>
                                        )}
                                    </div>
                                    {(() => {
                                        const dateRange = renderDateRange(
                                            edu.start_date,
                                            edu.graduation_date,
                                            edu.is_current
                                        );
                                        return dateRange ? (
                                            <span className="text-[13px] text-gray-600 whitespace-nowrap">
                                                {dateRange}
                                            </span>
                                        ) : null;
                                    })()}
                                </div>
                            </div>
                        ))}
                    </section>
                )}

                {/* =========================SKILLS========================= */}
                {Object.values(skills).some((group) => Array.isArray(group) && group.filter(hasValue).length > 0) && (
                    <section className="mb-2">
                        <SectionHeading title="Skills" />
                        {skills.languages?.filter(hasValue).length > 0 && (
                            <p className="text-[14px] leading-5">
                                <span className="font-semibold">
                                    Programming Languages:
                                </span>{" "}
                                {skills.languages.filter(hasValue).join(", ")}
                            </p>
                        )}
                        {skills.development?.filter(hasValue).length > 0 && (
                            <p className="text-[14px] leading-5">
                                <span className="font-semibold">
                                    Development:
                                </span>{" "}
                                {skills.development.filter(hasValue).join(", ")}
                            </p>
                        )}

                        {skills.cloud?.filter(hasValue).length > 0 && (
                            <p className="text-[14px] leading-5">
                                <span className="font-semibold">
                                    Cloud / DevOps:
                                </span>{" "}
                                {skills.cloud.filter(hasValue).join(", ")}
                            </p>
                        )}

                        {skills.tools?.filter(hasValue).length > 0 && (
                            <p className="text-[14px] leading-5">
                                <span className="font-semibold">
                                    Tools / Platforms:
                                </span>{" "}
                                {skills.tools.filter(hasValue).join(", ")}
                            </p>
                        )}
                    </section>
                )}

                {/* =========================CERTIFICATIONS========================= */}
                {certifications.length > 0 && (
                    <section className="mb-2">
                        <SectionHeading title="Certifications" />
                        {certifications.map((cert, index) => (
                            <div key={index} className="flex justify-between">
                                {hasValue(cert.name) && (
                                    <h3 className="text-[14px] text-gray-900 leading-5">
                                        {hasValue(cert.link) ? (
                                            <>
                                                <a href={cert.link} target="_blank" rel="noopener noreferrer"
                                                    className="font-medium hover:text-blue-700 hover:underline whitespace-nowrap">
                                                    {cert.name}
                                                </a>
                                                {hasValue(cert.issuer) && ` - ${cert.issuer}`}
                                            </>
                                        ) : (
                                            <>
                                                {cert.name}
                                                {hasValue(cert.issuer) && ` - ${cert.issuer}`}
                                            </>
                                        )}
                                    </h3>
                                )}
                                {hasValue(cert.date) && (
                                    <span className="text-[13px] text-gray-600 whitespace-nowrap text-right">
                                        {formatDate(cert.date)}
                                    </span>
                                )}
                            </div>
                        ))}
                    </section>
                )}

                {/* =========================ACHIEVEMENTS========================= */}
                {achievements.length > 0 && (
                    <section className="mb-2 leading-5 text-sm">
                        <SectionHeading title="Achievements" />
                        <ul className="list-disc pl-5">
                            {achievements.map((achievement, index) => {
                                if (!hasValue(achievement.point)) return null;
                                return (
                                    <li
                                        key={index}
                                        className="text-gray-800"
                                    >
                                        {achievement.point}
                                    </li>
                                );
                            })}
                        </ul>
                    </section>
                )}
            </div>
        </div>
    );
};

export default ClassicTemplate;