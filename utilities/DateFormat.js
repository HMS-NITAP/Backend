// Every letter and acknowledgement PDF uses DD/MM/YYYY format, pinned to IST
const DATE_FORMAT_OPTIONS = {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
};

exports.formatDate = (value) => {
    if (value === null || value === undefined || value === "") return "-";
    const parsed = value instanceof Date ? value : new Date(value);
    if (isNaN(parsed.getTime())) return "-";
    return parsed.toLocaleDateString("en-GB", DATE_FORMAT_OPTIONS);
};
