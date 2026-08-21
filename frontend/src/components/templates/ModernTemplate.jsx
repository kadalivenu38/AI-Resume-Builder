import React from "react";
import {
	hasValue,
	formatDate,
	renderDateRange,
	getProjectLinkLabel,
} from "./utilsFunctions.js";

const ModernTemplate = ({ data, accentColor }) => {

	/* =======================Utility Functions========================= */
	const renderBullets = (text) => {

		if (!hasValue(text))
			return null;

		return (
			<ul className="list-disc pl-5 space-y-0.5">

				{text
					.split("\n")
					.filter(line => line.trim())
					.map((line, index) => (

						<li
							key={index}
							className="text-[14px] leading-[1.4]"
						>
							{line}
						</li>

					))}

			</ul>
		);
	};

	/* =====================Social Links======================= */
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
	].filter(item => hasValue(item.url));

	/* ==========================Filter Empty Records=========================== */
	const experiences =
		(data.experience || []).filter(exp =>
			hasValue(exp.company) ||
			hasValue(exp.position) ||
			hasValue(exp.description)
		);

	const projects =
		(data.projects || []).filter(project =>
			hasValue(project.name) ||
			hasValue(project.description)
		);

	const education =
		(data.education || []).filter(edu =>
			hasValue(edu.institution) ||
			hasValue(edu.degree)
		);

	const certifications =
		(data.certifications || []).filter(cert =>
			hasValue(cert.name)
		);

	const achievements =
		(data.achievements || []).filter(item =>
			hasValue(item.point)
		);

	const skills = data.skills || {
		languages: [],
		development: [],
		cloud: [],
		tools: [],
	};

	/* =======================Shared Components======================= */
	const SectionHeading = ({ title }) => (
		<div className="flex items-center gap-3 mt-2">
			<h2 className="uppercase text-[15px] font-bold tracking-[0.25em] whitespace-nowrap" style={{ color: accentColor }}>
				{title}
			</h2>
			<div className="flex-1 border-t" style={{ borderColor: accentColor }} />
		</div>
	);

	return (
		<div className="mx-auto bg-white text-gray-900" style={{
			width: "8.5in", minHeight: "11in",
			fontFamily: "Calibri, Arial, Helvetica, sans-serif", boxSizing: "border-box", fontSize: "14px"
		}}>
			<div className="px-6 py-4">
				{/* ========================HEADER======================== */}
				<header>
					{/* Name & Job Role */}
					<div className="flex justify-between items-end gap-6">
						<div className="flex-1">
							{hasValue(data.personal_info?.full_name) && (
								<h1 className={`font-light tracking-wide uppercase leading-none ${data.personal_info.full_name.length > 28
									? "text-[26px]" : "text-[32px]"}`} style={{ color: accentColor }}>
									{data.personal_info.full_name}
								</h1>
							)}
							{hasValue(data.personal_info?.job_role) && (
								<p className="mt-1 text-[14px] tracking-[0.15em] uppercase text-gray-700">
									{data.personal_info.job_role}
								</p>
							)}
						</div>
					</div>

					{/* Accent Divider */}
					<div className="my-1 w-full border-t-2" style={{ borderColor: accentColor }}/>

					{/* Contact */}
					{(hasValue(data.personal_info?.email) ||
						hasValue(data.personal_info?.phone) ||
						hasValue(data.personal_info?.location)) && (
							<div className="flex flex-wrap text-[13px] text-gray-700">
								{hasValue(data.personal_info?.email) && (
									<span>{data.personal_info.email}</span>
								)}

								{hasValue(data.personal_info?.phone) && (
									<>
										{hasValue(data.personal_info?.email) && (
											<span className="mx-2 text-gray-400">•</span>
										)}
										<span>{data.personal_info.phone}</span>
									</>
								)}

								{hasValue(data.personal_info?.location) && (
									<>
										{(hasValue(data.personal_info?.email) || hasValue(data.personal_info?.phone)) && (
											<span className="mx-2 text-gray-400">•</span>
										)}
										<span>{data.personal_info.location}</span>
									</>
								)}
							</div>
						)}

					{/* Social Profiles */}
					{socialLinks.length > 0 && (
						<div className="flex flex-wrap text-[13px]">
							{socialLinks.map((item, index) => (
								<React.Fragment key={item.label}>
									{index !== 0 && (
										<span className="mx-2 text-gray-400">
											•
										</span>
									)}
									<a href={item.url} target="_blank" rel="noopener noreferrer"
										className="hover:underline" style={{ color: accentColor }}>
										{item.label}
									</a>
								</React.Fragment>
							))}
						</div>
					)}
				</header>

				{/* =========================SUMMARY========================= */}
				{hasValue(data.professional_summary) && (
					<section>
						<SectionHeading title="Summary" />
						{data.professional_summary}
					</section>
				)}

				{/* ===================PROFESSIONAL EXPERIENCE==================== */}
				{experiences.length > 0 && (
					<section>
						<SectionHeading title="Professional Experience" />
						<div className="space-y-0.5">
							{experiences.map((exp, index) => (
								<div key={index}>
									{/* Company + Date */}
									<div className="grid grid-cols-[1fr_auto] gap-5 items-start">
										<div>
											{hasValue(exp.company) && (
												<h3 className="text-[15px] font-semibold text-gray-900">
													{exp.company}
												</h3>
											)}
											{hasValue(exp.position) && (
												<p className="text-[14px]" style={{ color: accentColor }}>
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
						</div>
					</section>

				)}
				{/* ===================================PROJECTS===================================== */}
				{projects.length > 0 && (
					<section>
						<SectionHeading title="Projects" />
						<div className="space-y-0.5">
							{projects.map((project, index) => (
								<div key={index}>
									{/* Project Name & Link */}
									<div className="flex justify-between items-start gap-4">
										<div className="flex-1">
											{hasValue(project.name) && (
												<h3 className="text-[15px] font-semibold text-gray-900">
													{project.name}
												</h3>
											)}
											{hasValue(project.tech_stack) && (
												<p className="text-[13px]" style={{ color: accentColor }}>
													{project.tech_stack}
												</p>
											)}
										</div>
										{hasValue(project.link) && (
											<a href={project.link} target="_blank"
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

				{/* Education */}
				{education.length > 0 && (
					<section>
						<SectionHeading title="Education" />
						{education.map((edu, index) => (
							<div key={index}>
								<div className="flex justify-between gap-3">
									<div>
										{hasValue(edu.institution) && (
											<h3 className="text-[14px] font-semibold">
												{edu.institution}
											</h3>
										)}
										{(hasValue(edu.degree) ||
											hasValue(edu.field_of_study)) && (
												<p className="text-[13px] text-gray-700">
													{edu.degree}
													{hasValue(edu.degree) && hasValue(edu.field_of_study) && " • "}
													{edu.field_of_study}
												</p>
											)}

										{hasValue(edu.score) && (
											<p className="text-[12px] text-gray-600">
												Score: {edu.score}
											</p>
										)}
									</div>
									<span className="text-[12px] whitespace-nowrap text-gray-500">
										{renderDateRange(
											edu.start_date,
											edu.graduation_date,
											edu.is_current
										)}
									</span>
								</div>
							</div>
						))}
					</section>
				)}

				{/* Skills */}
				{Object.values(skills).some(group => Array.isArray(group) && group.some(hasValue)) && (
					<section>
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
								const list =
									values?.filter(hasValue);
								if (!list?.length) return null;
								return (
									<p key={label} className="text-[13px] leading-5">
										<span className="font-semibold">{label}:</span>{" "}
										{list.join(", ")}
									</p>
								);
							})}
					</section>
				)}

				{/* Certifications */}
				{certifications.length > 0 && (
					<section>
						<SectionHeading title="Certifications" />
						{certifications.map((cert, index) => (
							<div key={index} className="flex gap-5">
								{hasValue(cert.name) && (
									<h3 className="text-[14px] font-medium">
										{hasValue(cert.link) ? (
											<a href={cert.link} target="_blank" rel="noopener noreferrer"
												className="hover:text-blue-600 hover:underline">
												{cert.name}
											</a>
										) : (
											cert.name
										)}
									</h3>
								)}
								{(hasValue(cert.issuer) || hasValue(cert.date)) && (
									<p className="text-[13px] text-gray-600 mx-auto">
										{[
											cert.issuer, hasValue(cert.date) ? formatDate(cert.date) : null,
										].filter(Boolean).join(" • ")}
									</p>
								)}
							</div>
						))}
					</section>
				)}

				{/* Achievements */}
				{achievements.length > 0 && (
					<section>
						<SectionHeading title="Achievements" />
						<ul className="list-disc pl-5">
							{achievements.map((item, index) => (hasValue(item.point) && (
								<li key={index} className="text-[13px] leading-[1.45]">
									{item.point}
								</li>
							)
							))}
						</ul>
					</section>
				)}
			</div>
		</div>
	);
};

export default ModernTemplate;