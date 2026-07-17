import React from "react";
import {
  hasValue,
  formatDate,
  renderDateRange,
  getProjectLinkLabel,
} from "./utilsFunctions.js";

const MinimalTemplate = ({ data, accentColor }) => {
  const renderBullets = (text) => {
    if (!hasValue(text)) return null;

    return (
      <ul className="list-disc pl-5">
        {text.split("\n").filter((line) => line.trim()).map((line, index) => (
          <li key={index} className="text-[14px] leading-[1.3] text-gray-700">
            {line}
          </li>
        ))}
      </ul>
    );
  };

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
  ].filter((item) => hasValue(item.url));

  const SectionHeading = ({ title }) => (
    <div className="mt-2">
      <h2 className="text-[16px] font-semibold tracking-wide" style={{ color: accentColor }}>
        {title}
      </h2>
    </div>
  );

  const experiences = (data.experience || []).filter((exp) => hasValue(exp.company) || hasValue(exp.position) || hasValue(exp.description));

  const projects = (data.projects || []).filter((project) => hasValue(project.name) || hasValue(project.description));

  const education = (data.education || []).filter((edu) => hasValue(edu.institution) || hasValue(edu.degree));

  const certifications = (data.certifications || []).filter((cert) => hasValue(cert.name));

  const achievements = (data.achievements || []).filter((item) => hasValue(item.point));

  const skills = data.skills || {
    languages: [],
    development: [],
    cloud: [],
    tools: [],
  };

  return (
    <div className="mx-auto bg-white text-gray-900"
      style={{ width: "8.5in", minHeight: "11in", fontFamily: "Helvetica, Arial, Calibri, sans-serif", boxSizing: "border-box" }}>
      <div className="px-8 py-4">
        {/* =======================HEADER======================= */}
        <header>
          {/* Name */}
          {hasValue(data.personal_info?.full_name) && (
            <h1 className={`leading-none tracking-tight font-light ${data.personal_info.full_name.length > 28
              ? "text-[30px]" : "text-[34px]"}`}>
              {data.personal_info.full_name}
            </h1>
          )}

          {/* Job Role */}
          {hasValue(data.personal_info?.job_role) && (
            <p className="text-[16px] font-normal" style={{ color: accentColor }}>
              {data.personal_info.job_role}
            </p>
          )}

          {/* Contact */}
          {(hasValue(data.personal_info?.email) || hasValue(data.personal_info?.phone) || hasValue(data.personal_info?.location)) && (
            <div className="mt-1 flex flex-wrap text-[14px] text-gray-600">
              {hasValue(data.personal_info?.email) && (
                <span>{data.personal_info.email}</span>
              )}
              {hasValue(data.personal_info?.phone) && (
                <>
                  {hasValue(data.personal_info?.email) && (
                    <span className="mx-2">·</span>
                  )}
                  <span>{data.personal_info.phone}</span>
                </>
              )}
              {hasValue(data.personal_info?.location) && (
                <>
                  {(hasValue(data.personal_info?.email) || hasValue(data.personal_info?.phone)) && (
                    <span className="mx-2">·</span>
                  )}
                  <span>{data.personal_info.location}</span>
                </>
              )}
            </div>
          )}

          {/* Social Profiles */}
          {socialLinks.length > 0 && (
            <div className="flex flex-wrap text-[14px]">
              {socialLinks.map((item, index) => (
                <React.Fragment key={item.label}>
                  {index !== 0 && <span className="mx-2 text-gray-400">·</span>}
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:underline"
                    style={{ color: accentColor }}>
                    {item.label}
                  </a>
                </React.Fragment>
              ))}
            </div>
          )}
        </header>

        {/* Thin Divider */}
        <div className="mb-2 h-px" style={{ backgroundColor: `${accentColor}30` }} />

        {/* =======================PROFESSIONAL SUMMARY========================== */}
        {hasValue(data.professional_summary) && (
          <section>
            <SectionHeading title="Professional Summary" />
            <p className="text-[14px] leading-[1.35] text-gray-700 text-justify">
              {data.professional_summary}
            </p>
          </section>
        )}

        {/* ======================PROFESSIONAL EXPERIENCE======================= */}
        {experiences.length > 0 && (
          <section>
            <SectionHeading title="Professional Experience" />
            <div className="space-y-1">
              {experiences.map((exp, index) => (
                <div key={index}>
                  {/* Company & Date */}
                  <div className="grid grid-cols-[1fr_auto] gap-6 items-start">
                    <div>
                      {hasValue(exp.company) && (
                        <h3 className="text-[15px] font-semibold text-gray-900">
                          {exp.company}
                        </h3>
                      )}
                      {hasValue(exp.position) && (
                        <p className="text-[14px] text-gray-700 font-medium" style={{ color: accentColor }}>
                          {exp.position}
                        </p>
                      )}
                    </div>
                    {renderDateRange(exp.start_date, exp.end_date, exp.is_current) && (
                      <span className="text-[13px] text-gray-500 whitespace-nowrap">
                        {renderDateRange(
                          exp.start_date,
                          exp.end_date,
                          exp.is_current,
                        )}
                      </span>
                    )}
                  </div>
                  {renderBullets(exp.description)}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ==========================PROJECTS============================ */}
        {projects.length > 0 && (
          <section>
            <SectionHeading title="Projects" />
            <div className="space-y-1">
              {projects.map((project, index) => (
                <div key={index}>
                  {/* Project Title & Link */}
                  <div className="grid grid-cols-[1fr_auto] gap-5 items-start">
                    <div>
                      {hasValue(project.name) && (
                        <h3 className="text-[15px] font-semibold text-gray-900">
                          {project.name}
                        </h3>
                      )}
                      {hasValue(project.tech_stack) && (
                        <p className="text-[13px] italic" style={{ color: accentColor }}>
                          {project.tech_stack}
                        </p>
                      )}
                    </div>
                    {hasValue(project.link) && (
                      <a href={project.link} target="_blank" rel="noopener noreferrer"
                        className="text-[13px] whitespace-nowrap hover:underline" style={{ color: accentColor }}>
                        {getProjectLinkLabel(project.link)}
                      </a>
                    )}
                  </div>
                  {renderBullets(project.description)}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ========================EDUCATION========================== */}
        {education.length > 0 && (
          <section>
            <SectionHeading title="Education" />
            {education.map((edu, index) => (
              <div key={index} className="leading-4.5">
                <div className="grid grid-cols-[1fr_auto] gap-5 items-start space-y-1">
                  <div>
                    {hasValue(edu.institution) && (
                      <h3 className="text-[15px] font-semibold">
                        {edu.institution}
                      </h3>
                    )}

                    {(hasValue(edu.degree) || hasValue(edu.field_of_study)) && (
                      <p className="text-[14px] text-gray-600">
                        {edu.degree}
                        {hasValue(edu.degree) && hasValue(edu.field_of_study) && " • "}
                        {edu.field_of_study}
                      </p>
                    )}
                    {hasValue(edu.score) && (
                      <p className="text-[13px] text-gray-500">
                        Score: {edu.score}
                      </p>
                    )}
                  </div>
                  <span className="text-[13px] whitespace-nowrap text-gray-500">
                    {renderDateRange(
                      edu.start_date,
                      edu.graduation_date,
                      edu.is_current,
                    )}
                  </span>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* =======================SKILLS========================== */}
        {Object.values(skills).some((group) => Array.isArray(group) && group.some(hasValue)) && (
          <section className="-mt-1">
            <SectionHeading title="Skills" />
            {[
              {
                label: "Languages",
                values: skills.languages,
              },
              {
                label: "Development",
                values: skills.development,
              },
              {
                label: "Cloud",
                values: skills.cloud,
              },
              {
                label: "Tools",
                values: skills.tools,
              }].map(({ label, values }) => {
                const list = values?.filter(hasValue);
                if (!list?.length) return null;
                return (
                  <p key={label} className="text-[14px]">
                    <span className="font-semibold">{label}:</span>{" "}
                    {list.join(", ")}
                  </p>
                );
              })}
          </section>
        )}

        {/* ========================CERTIFICATIONS========================== */}
        {certifications.length > 0 && (
          <section>
            <SectionHeading title="Certifications" />
            {certifications.map((cert, index) => (
              <div key={index} className='flex justify-between gap-3 overflow-hidden'>
                {hasValue(cert.name) && (
                  <h3 className="text-[15px] font-semibold">{cert.name}</h3>
                )}
                {(hasValue(cert.issuer) || hasValue(cert.date)) && (
                  <p className="text-[13px] text-gray-600">
                    {[cert.issuer, hasValue(cert.date) ? formatDate(cert.date) : null].filter(Boolean).join(" • ")}
                  </p>
                )}

                {hasValue(cert.link) && (
                  <a href={cert.link} target="_blank" rel="noopener noreferrer" className="inline-block text-[13px] hover:underline"
                    style={{ color: accentColor }}>
                    Verify Credential
                  </a>
                )}
              </div>
            ))}
          </section>
        )}

        {/* =========================ACHIEVEMENTS========================== */}
        {achievements.length > 0 && (
          <section>
            <SectionHeading title="Achievements" />
            <ul className="list-disc pl-5">
              {achievements.map((achievement, index) => hasValue(achievement.point) && (
                <li key={index} className=" text-[14px] leading-[1.55] text-gray-700">
                  {achievement.point}
                </li>
              ),
              )}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
};

export default MinimalTemplate;
