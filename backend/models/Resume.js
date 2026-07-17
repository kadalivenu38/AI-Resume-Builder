import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    title: { type: String, default: "Untitled Resume" },
    public: { type: Boolean, default: false },
    template: { type: String, default: "classic" },
    accent_color: { type: String, default: "#000000" },
    professional_summary: { type: String, default: "" },
    skills: {
      languages: [{ type: String, default: "" }],
      development: [{ type: String, default: "" }],
      cloud: [{ type: String, default: "" }],
      tools: [{ type: String, default: "" }],
    },
    personal_info: {
      image: { type: String, default: "" },
      full_name: { type: String, default: "" },
      job_role: { type: String, default: "" },
      email: { type: String, default: "" },
      phone: { type: String, default: "" },
      location: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      github: { type: String },
      leetcode: { type: String },
      hackerrank: { type: String },
      codeforces: { type: String },
      geeksforgeeks: { type: String },
      website: { type: String, default: "" },
    },
    experience: [
      {
        company: { type: String },
        position: { type: String },
        start_date: { type: String },
        end_date: { type: String },
        description: { type: String },
        is_current: { type: Boolean, default: false },
      },
    ],
    projects: [
      {
        name: { type: String },
        description: { type: String },
        tech_stack: { type: String },
        link: { type: String },
      },
    ],
    certifications: [
      {
        name: { type: String },
        issuer: { type: String },
        date: { type: String },
        link: { type: String },
      },
    ],
    achievements: [
      {
        point: { type: String },
      },
    ],
    education: [
      {
        institution: { type: String },
        degree: { type: String },
        field_of_study: { type: String },
        start_date: { type: String },
        graduation_date: { type: String },
        score: { type: String },
        is_current: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true, minimize: false },
);

const Resume = mongoose.model("Resume", resumeSchema);
export default Resume;
