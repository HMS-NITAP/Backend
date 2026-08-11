const DIGITS_ONLY = /^[0-9]+$/;
const ROLL_NO_LENGTH = 6;

const normalizeIdentifier = (value) =>
  typeof value === "string" || typeof value === "number" ? String(value).trim() : "";

exports.normalizeIdentifier = normalizeIdentifier;
exports.ROLL_NO_LENGTH = ROLL_NO_LENGTH;

exports.isDigitsOnly = (value) => DIGITS_ONLY.test(normalizeIdentifier(value));

exports.validateRollNoFormat = (rollNo) => {
  const normalized = normalizeIdentifier(rollNo);
  if (!normalized) return null;
  if (!DIGITS_ONLY.test(normalized)) return "Roll Number must contain digits only";
  if (normalized.length !== ROLL_NO_LENGTH) return `Roll Number must be exactly ${ROLL_NO_LENGTH} digits`;
  return null;
};

// Resolves to an error message when the registration number is already taken, otherwise null.
// `excludeStudentId` lets an edit re-save a student without colliding with itself.
exports.findRegNoConflict = async (prisma, regNo, excludeStudentId = null) => {
  const normalized = normalizeIdentifier(regNo);
  if (!normalized) return "Registration Number is required";

  const existing = await prisma.instituteStudent.findFirst({
    where: {
      regNo: normalized,
      ...(excludeStudentId ? { NOT: { id: excludeStudentId } } : {}),
    },
    select: { id: true },
  });

  return existing ? "Student with this Registration Number already exists" : null;
};

// Same for roll numbers, which stay optional - a blank one never conflicts.
exports.findRollNoConflict = async (prisma, rollNo, excludeStudentId = null) => {
  const normalized = normalizeIdentifier(rollNo);
  if (!normalized) return null;

  const existing = await prisma.instituteStudent.findFirst({
    where: {
      rollNo: normalized,
      ...(excludeStudentId ? { NOT: { id: excludeStudentId } } : {}),
    },
    select: { id: true },
  });

  return existing ? "Student with this Roll Number already exists" : null;
};
