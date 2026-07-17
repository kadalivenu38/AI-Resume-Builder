export const hasValue = (value) => {
  if (value === null || value === undefined) return false;

  if (typeof value === "string") return value.trim() !== "";

  if (Array.isArray(value)) return value.some(hasValue);

  return true;
};

export const hasArrayData = (arr) => {
  return (
    Array.isArray(arr) &&
    arr.some((item) => Object.values(item || {}).some(hasValue))
  );
};

export const formatDate = (date) => {
  if (!date) return "";

  const [month, year] = date.split("-");

  return new Date(year, month - 1).toLocaleString("en-US", {
    month: "short",
    year: "numeric",
  });
};

// Render date range
export const renderDateRange = (start, end, current = false) => {
  const startText = hasValue(start) ? formatDate(start) : "";

  const endText = current ? "Present" : hasValue(end) ? formatDate(end) : "";

  if (!startText && !endText) return "";

  return startText && endText
    ? `${startText} - ${endText}`
    : startText || endText;
};

// Convert multiline description into bullet array
export const getBulletPoints = (text) => {
  if (!hasValue(text)) return [];

  return text.split("\n").map((line) => line.trim()).filter(Boolean);
};

// Generate profile links
export const getProfileLinks = (personalInfo = {}) => {
  const links = [];

  const profiles = [
    ["linkedin", "LinkedIn"],
    ["github", "GitHub"],
    ["leetcode", "LeetCode"],
    ["hackerrank", "HackerRank"],
    ["codeforces", "Codeforces"],
    ["geeksforgeeks", "GeeksforGeeks"],
    ["website", "Portfolio"],
  ];

  profiles.forEach(([key, label]) => {
    if (hasValue(personalInfo[key])) {
      links.push({
        label,
        url: personalInfo[key],
      });
    }
  });

  return links;
};

// Check whether Skills section has data
export const hasSkillsData = (skills = {}) => {
  return (
    (skills.languages?.length ?? 0) > 0 ||
    (skills.development?.length ?? 0) > 0 ||
    (skills.cloud?.length ?? 0) > 0 ||
    (skills.tools?.length ?? 0) > 0
  );
};

// Detect project link label
export const getProjectLinkLabel = (url = "") => {
  const value = url.toLowerCase();

  if (value.includes("github")) return "GitHub";

  if (
    value.includes("vercel") ||
    value.includes("netlify") ||
    value.includes("render") ||
    value.includes("railway")
  )
    return "Live Demo";

  return "View";
};
