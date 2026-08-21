import Resume from "../models/Resume.js";
import imgKit from "../config/imagkit.js";

// Creating new Resume
export const createResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { title } = req.body;
    const newResume = await Resume.create({
      userId,
      ...(title?.trim() && { title }),
    });

    return res
      .status(201)
      .json({ message: "Resume created successfully", resume: newResume });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Delete resume logic
export const deleteResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId } = req.params;
    await Resume.findOneAndDelete({ _id: resumeId, userId });

    return res.status(200).json({ message: "Resume deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Get get resume by Id
export const getResumeById = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId } = req.params;
    const resume = await Resume.findOne({ _id: resumeId, userId });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    resume.__v = undefined;
    resume.createdAt = undefined;
    resume.updatedAt = undefined;

    return res.status(200).json({ resume });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Get resume to view for public access
export const getResumeToView = async (req, res) => {
  try {
    const { resumeId } = req.params;
    const resume = await Resume.findOne({ _id: resumeId, public: true });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    return res.status(200).json({ resume });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Update resume logic
export const updateResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId, resumeData, removeBackground } = req.body;
    let resumeDataCopy =
      typeof resumeData === "string"
        ? JSON.parse(resumeData)
        : structuredClone(resumeData);

    const image = req.file;
    if (image) {
      const response = await imgKit.files.upload({
        file: image.buffer.toString("base64"),
        fileName: image.originalname,
        folder: "user-resumes",
        transformation: {
          pre:
            "w-300,h-300,fo-face,z-0.50" +
            (removeBackground ? ",e-bgremove" : ""),
        },
      });
      resumeDataCopy.personal_info.image = response.url;
    }

    const updatedResume = await Resume.findOneAndUpdate(
      { userId, _id: resumeId },
      resumeDataCopy,
      { returnDocument: "after" },
    );

    if (!updatedResume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    return res
      .status(200)
      .json({ message: "Resume updated successfully", resume: updatedResume });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
