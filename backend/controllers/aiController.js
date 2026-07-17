import openai from "../config/openai.js";
import Resume from "../models/Resume.js";
import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";

// controller for AI-enhanced professional summary
export const enhanceSummary = async (req, res) => {
  try {
    const { summary } = req.body;
    if (!summary) {
      return res.status(400).json({ message: "Summary is required" });
    }

    // Call the AI service to enhance the summary
    const response = await openai.chat.completions.create({
      model: "gemini-3.5-flash",
      messages: [
        {
          role: "system",
          content:
            "You are an expert in Resume writing. Your task is to enhance the professional summary of a resume. The summary should be 1-2 sentences only, also highlighting key skills, experience and career objectives. Make it compelling and ATS-friendly. Return only the enhanced summary text, nothing else.",
        },
        {
          role: "user",
          content: summary,
        },
      ],
    });
    const enhancedSummary = response.choices[0].message.content;

    return res.status(200).json({ summary: enhancedSummary });
  } catch (err) {
    console.log(err);

    if (err.status === 429) {
      return res.status(429).json({
        message: "AI quota exceeded. Please try again later.",
      });
    }
    return res.status(500).json({ message: err.message });
  }
};

// controller for AI-enhanced Job Description
export const enhanceDescription = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        message: "Experience data is required",
      });
    }

    const response = await openai.chat.completions.create({
      model: "gemini-3.5-flash",
      messages: [
        {
          role: "system",
          content: `You are an expert ATS Resume Writer and Career Coach.
            Your task is to rewrite a job or project description into strong resume achievement statements.

            Rules:
            - Generate exactly 3 statements.
            - Each statement must be on a new line.
            - Do NOT use bullet symbols or numbering.
            - Each statement should be 15-25 words maximum.
            - Begin each statement with a strong action verb.
            - Focus on accomplishments, not responsibilities.
            - Include technologies, tools, or methodologies when relevant.
            - Include measurable impact whenever possible using numbers, percentages, counts, time savings, performance improvements, user growth, cost reduction, or efficiency gains.
            - If the user does not provide measurable metrics, infer realistic metrics conservatively and naturally.
            - Make the content ATS-friendly.
            - Return only the 3 statements separated by line breaks without any blank space lines.`
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const enhancedDescription = response.choices[0].message.content;

    return res.status(200).json({
      enhancedDescription,
    });
  } catch (err) {
    console.error(err);

    if (err.status === 429) {
      return res.status(429).json({
        message: "AI quota exceeded. Please try again later.",
      });
    }

    return res.status(500).json({
      message: err.message,
    });
  }
};

// controller for extracting data from uploaded resume
export const extractResumeData = async (req, res) => {
  try {
    const userId = req.userId;
    const { title } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "Resume file is required.",
      });
    }

    let resumeText = "";

    // ================= PDF =================

    if (file.mimetype === "application/pdf") {
      const parser = new PDFParse({
        data: file.buffer,
      });

      const result = await parser.getText();
      resumeText = result.text;
    }

    // ================= DOCX =================
    else if (
      file.mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const result = await mammoth.extractRawText({
        buffer: file.buffer,
      });

      resumeText = result.value;
    } else {
      return res.status(400).json({
        success: false,
        message: "Only PDF and DOCX resumes are supported.",
      });
    }

    if (!resumeText.trim()) {
      return res.status(400).json({
        success: false,
        message: "Unable to extract text from resume.",
      });
    }

    // ================= AI =================

    const response = await openai.chat.completions.create({
      model: "gemini-2.5-flash",

      response_format: {
        type: "json_object",
      },

      messages: [
        {
          role: "system",

          content: `You are an expert Resume Parsing and Resume Enhancement AI.

                Your responsibility is to extract resume information into structured JSON while preserving factual accuracy and improving the wording for ATS (Applicant Tracking System) compatibility.

                STRICT RULES

                • Return ONLY valid JSON.
                • Never return markdown.
                • Never include explanations.
                • Never include comments.
                • Never invent information that is not supported by the resume.
                • Preserve all factual information.
                • If a value is unavailable:
                  - String → ""
                  - Array → []
                  - Boolean → false

                ------------------------------------------------------------

                EXPERIENCE & PROJECT DESCRIPTIONS

                Convert responsibilities into ATS-friendly accomplishment statements.

                Rules:

                • Generate EXACTLY TWO accomplishment statements for each Experience and each Project.

                • Each accomplishment MUST be on a NEW LINE.

                • NEVER include bullet symbols:
                  -
                  •
                  *
                  ●
                  ▪
                  ◦

                • Each statement should contain approximately 30–45 words.

                • Every statement MUST begin with a strong action verb such as:

                Developed
                Built
                Designed
                Engineered
                Implemented
                Integrated
                Optimized
                Created
                Configured
                Automated
                Reduced
                Improved
                Managed
                Collaborated
                Led
                Deployed
                Analyzed
                Enhanced
                Migrated
                Streamlined

                • Merge related tasks into one meaningful accomplishment instead of splitting them into many short points.

                • Include:
                  - Technologies used
                  - Features implemented
                  - Technical contributions
                  - Optimization or performance improvements
                  - Security improvements
                  - Scalability
                  - Business value
                  - Measurable outcomes whenever available

                • If measurable numbers exist in the resume, preserve them exactly.

                • Never fabricate metrics.

                GOOD EXAMPLE

                Developed a full-stack inventory management application using React, Node.js, Express, and MongoDB, implementing secure JWT authentication and REST APIs to streamline inventory operations while improving maintainability and overall application scalability.

                Optimized MongoDB queries, integrated role-based authentication, and deployed the application using Render, reducing API response time while ensuring secure access, responsive performance, and reliable cloud deployment.

                BAD EXAMPLE

                Developed REST APIs.

                Implemented JWT.

                Integrated MongoDB.

                Deployed Backend.

                BAD EXAMPLE

                Developed REST APIs and implemented JWT while integrating MongoDB and deploying backend.

                (Do not generate paragraphs.)

                ------------------------------------------------------------

                PROFESSIONAL SUMMARY

                Generate a concise ATS-friendly summary.

                Rules:

                • 2–3 sentences.
                • Mention:
                  - Job role
                  - Primary technologies
                  - Experience level
                  - Strong technical skills
                  - Career objective
                • Never invent years of experience.

                ------------------------------------------------------------

                SKILLS

                Categorize skills into:

                languages

                development

                cloud

                tools

                Remove duplicate skills.

                ------------------------------------------------------------

                PROJECTS

                Extract:

                • Project Name
                • ATS-friendly Description
                • Tech Stack
                • Repository or Live URL

                ------------------------------------------------------------

                CERTIFICATIONS

                Extract:

                • Name
                • Issuer
                • Date
                • Credential URL

                ------------------------------------------------------------

                ACHIEVEMENTS

                Extract achievements as concise statements.

                Do not rewrite achievements into paragraphs.

                ------------------------------------------------------------

                PERSONAL INFORMATION

                Extract:

                Full Name

                Job Role

                Email

                Phone

                Location

                LinkedIn

                GitHub

                LeetCode

                HackerRank

                Codeforces

                GeeksforGeeks

                Portfolio Website

                ------------------------------------------------------------

                DATES

                MM-YYYY format is preferred.

                If Date in alphabetic format(eg: May 2023), convert it to MM-YYYY.

                ------------------------------------------------------------

                OUTPUT

                Return ONLY valid JSON.`,
        },

        {
          role: "user",

          content: `Resume:

                  ${resumeText}

                  Extract resume information and return JSON EXACTLY in the following schema.

                  Do not add or remove fields.

                  {
                    "professional_summary": "",

                    "skills": {
                      "languages": [],
                      "development": [],
                      "cloud": [],
                      "tools": []
                    },

                    "personal_info": {
                      "full_name": "",
                      "job_role": "",
                      "email": "",
                      "phone": "",
                      "location": "",
                      "linkedin": "",
                      "github": "",
                      "leetcode": "",
                      "hackerrank": "",
                      "codeforces": "",
                      "geeksforgeeks": "",
                      "website": ""
                    },

                    "experience": [
                      {
                        "company": "",
                        "position": "",
                        "start_date": "",
                        "end_date": "",
                        "description": "",
                        "is_current": false
                      }
                    ],

                    "projects": [
                      {
                        "name": "",
                        "description": "",
                        "tech_stack": "",
                        "link": ""
                      }
                    ],

                    "certifications": [
                      {
                        "name": "",
                        "issuer": "",
                        "date": "",
                        "link": ""
                      }
                    ],

                    "achievements": [
                      {
                        "point": ""
                      }
                    ],

                    "education": [
                      {
                        "institution": "",
                        "degree": "",
                        "field_of_study": "",
                        "start_date": "",
                        "graduation_date": "",
                        "score": "",
                        "is_current": false
                      }
                    ]
                  }`,
        },
      ],
    });

    const aiContent = response.choices[0].message.content;

    let parsedData;

    try {
      parsedData = JSON.parse(aiContent);
    } catch (error) {
      console.error("AI Parse Error:", aiContent);

      return res.status(500).json({
        success: false,
        message: "Failed to parse AI response.",
      });
    }
    // =========================================
    // Helper Functions
    // =========================================

    // Remove AI bullet symbols
    const cleanBulletText = (text = "") => {
      return text
        .replace(/\r/g, "")
        .replace(/^[•●▪◦*-]+\s*/gm, "")
        .trim();
    };

    // Convert paragraph into resume bullet lines
    const normalizeDescription = (text = "") => {
      if (!text) return "";

      let value = cleanBulletText(text);

      // Convert numbered points to new lines
      value = value.replace(/\d+\.\s+/g, "\n");

      // Split sentences into separate lines
      value = value.replace(/\.\s+(?=[A-Z])/g, ".\n");

      // Remove duplicate blank lines
      value = value.replace(/\n{2,}/g, "\n");

      return value.trim();
    };

    // Remove duplicate values
    const uniqueArray = (arr = []) => [
      ...new Set(arr.filter(Boolean).map((item) => item.trim())),
    ];

    // Normalize URL
    const normalizeUrl = (url = "") => {
      if (!url) return "";

      if (url.startsWith("http://") || url.startsWith("https://")) {
        return url.trim();
      }

      return `https://${url.trim()}`;
    };

    // Check whether an object contains data
    const hasObjectData = (obj = {}) =>
      Object.values(obj).some((value) => {
        if (Array.isArray(value)) return value.length > 0;

        return !!String(value || "").trim();
      });

    // =========================================
    // Normalize Skills
    // =========================================

    const normalizeSkills = (skills) => {
      if (Array.isArray(skills)) {
        return {
          languages: uniqueArray(skills),
          development: [],
          cloud: [],
          tools: [],
        };
      }

      if (skills && typeof skills === "object") {
        return {
          languages: uniqueArray([
            ...(skills.languages || []),
            ...(skills.programmingLanguages || []),
            ...(skills.programming || []),
            ...(skills["Programming Languages"] || []),
          ]),

          development: uniqueArray([
            ...(skills.development || []),
            ...(skills.frameworks || []),
            ...(skills["Development"] || []),
            ...(skills["Frameworks"] || []),
          ]),

          cloud: uniqueArray([
            ...(skills.cloud || []),
            ...(skills.cloudDevOps || []),
            ...(skills["Cloud"] || []),
            ...(skills["Cloud / DevOps"] || []),
            ...(skills["Cloud / Devops"] || []),
          ]),

          tools: uniqueArray([
            ...(skills.tools || []),
            ...(skills.toolsPlatforms || []),
            ...(skills["Tools"] || []),
            ...(skills["Tools / Platforms"] || []),
          ]),
        };
      }

      return {
        languages: [],
        development: [],
        cloud: [],
        tools: [],
      };
    };

    parsedData.skills = normalizeSkills(parsedData.skills);

    // =========================================
    // Normalize Personal Info
    // =========================================

    parsedData.personal_info = {
      image: "",
      full_name: "",
      job_role: "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      github: "",
      leetcode: "",
      hackerrank: "",
      codeforces: "",
      geeksforgeeks: "",
      website: "",
      ...(parsedData.personal_info || {}),
    };

    parsedData.personal_info.linkedin = normalizeUrl(
      parsedData.personal_info.linkedin,
    );

    parsedData.personal_info.github = normalizeUrl(
      parsedData.personal_info.github,
    );

    parsedData.personal_info.leetcode = normalizeUrl(
      parsedData.personal_info.leetcode,
    );

    parsedData.personal_info.hackerrank = normalizeUrl(
      parsedData.personal_info.hackerrank,
    );

    parsedData.personal_info.codeforces = normalizeUrl(
      parsedData.personal_info.codeforces,
    );

    parsedData.personal_info.geeksforgeeks = normalizeUrl(
      parsedData.personal_info.geeksforgeeks,
    );

    parsedData.personal_info.website = normalizeUrl(
      parsedData.personal_info.website,
    );
    // =========================================
    // Normalize Experience
    // =========================================

    parsedData.experience = Array.isArray(parsedData.experience)
      ? parsedData.experience
          .map((exp) => ({
            company: (exp.company || "").trim(),
            position: (exp.position || "").trim(),
            start_date: (exp.start_date || "").trim(),
            end_date: (exp.end_date || "").trim(),

            description: normalizeDescription(exp.description || ""),

            is_current: Boolean(exp.is_current),
          }))
          .filter(hasObjectData)
      : [];

    // =========================================
    // Normalize Projects
    // =========================================

    parsedData.projects = Array.isArray(parsedData.projects)
      ? parsedData.projects
          .map((project) => ({
            name: (project.name || "").trim(),

            description: normalizeDescription(project.description || ""),

            tech_stack: (
              project.tech_stack ||
              project.techStack ||
              project.technologies ||
              ""
            ).trim(),

            link: normalizeUrl(
              project.link ||
                project.url ||
                project.github ||
                project.demo ||
                "",
            ),
          }))
          .filter(hasObjectData)
      : [];

    // =========================================
    // Normalize Education
    // =========================================

    parsedData.education = Array.isArray(parsedData.education)
      ? parsedData.education
          .map((edu) => ({
            institution: (edu.institution || "").trim(),

            degree: (edu.degree || "").trim(),

            field_of_study: (edu.field_of_study || "").trim(),

            start_date: (edu.start_date || "").trim(),

            graduation_date: (edu.graduation_date || "").trim(),

            score: (edu.score || "").trim(),

            is_current: Boolean(edu.is_current),
          }))
          .filter(hasObjectData)
      : [];

    // =========================================
    // Normalize Certifications
    // =========================================

    parsedData.certifications = Array.isArray(parsedData.certifications)
      ? parsedData.certifications
          .map((cert) => ({
            name: (cert.name || "").trim(),

            issuer: (cert.issuer || "").trim(),

            date: (cert.date || "").trim(),

            link: normalizeUrl(
              cert.link || cert.url || cert.credential_url || "",
            ),
          }))
          .filter(hasObjectData)
      : [];

    // =========================================
    // Normalize Achievements
    // =========================================

    parsedData.achievements = Array.isArray(parsedData.achievements)
      ? parsedData.achievements
          .map((item) => ({
            point: (item.point || item.achievement || item.title || "").trim(),
          }))
          .filter(hasObjectData)
      : [];

    parsedData.professional_summary = (parsedData.professional_summary || "")
      .replace(/\r/g, "")
      .replace(/\n{2,}/g, "\n")
      .trim();
    // =========================================
    // Save Resume
    // =========================================

    const newResume = await Resume.create({
      userId,
      title: title?.trim() || "Untitled Resume",

      professional_summary: parsedData.professional_summary,

      skills: parsedData.skills,

      personal_info: parsedData.personal_info,

      experience: parsedData.experience,

      projects: parsedData.projects,

      certifications: parsedData.certifications,

      achievements: parsedData.achievements,

      education: parsedData.education,
    });

    // =========================================
    // Success Response
    // =========================================

    return res.status(201).json({
      success: true,
      message: "Resume data extracted successfully.",
      resumeId: newResume._id,
    });
  } catch (err) {
    console.error("Resume Extraction Error:", err);

    if (err.status === 429) {
      return res.status(429).json({
        success: false,
        message: "AI quota exceeded. Please try again later.",
      });
    }

    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File size should not exceed 5 MB.",
      });
    }

    if (err.name === "SyntaxError") {
      return res.status(500).json({
        success: false,
        message: "AI returned invalid JSON.",
      });
    }

    return res.status(500).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
  }
};