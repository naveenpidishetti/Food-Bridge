export function isValidEmail(email) {
  if (!email || typeof email !== "string") return false;
  const trimmed = email.trim();
  // Comprehensive RFC-compliant regex with valid TLD requirement (at least 2 chars)
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  if (!emailRegex.test(trimmed)) return false;
  
  const parts = trimmed.split("@");
  if (parts.length !== 2) return false;
  const domain = parts[1].toLowerCase();
  
  // Ensure domain contains a period and valid extension
  if (!domain.includes(".") || domain.startsWith(".") || domain.endsWith(".")) return false;
  const tld = domain.split(".").pop();
  if (!tld || tld.length < 2) return false;
  
  return true;
}

export function validateEmailWithFeedback(email) {
  if (!email || email.trim() === "") {
    return { valid: false, message: "Please enter your email address." };
  }
  const trimmed = email.trim();
  if (!trimmed.includes("@")) {
    return { valid: false, message: "Email is missing '@' symbol (e.g., yourname@gmail.com)." };
  }
  const parts = trimmed.split("@");
  if (!parts[0] || parts[0].length === 0) {
    return { valid: false, message: "Missing username before the '@' sign." };
  }
  if (!parts[1] || parts[1].length === 0) {
    return { valid: false, message: "Missing domain after '@' (e.g., gmail.com)." };
  }
  if (!parts[1].includes(".")) {
    return { valid: false, message: `Incomplete domain '${parts[1]}'. Did you mean '${parts[1]}.com'?` };
  }
  if (!isValidEmail(trimmed)) {
    return { valid: false, message: "Please enter a valid format: name@domain.com" };
  }
  return { valid: true, message: "Valid email address." };
}
