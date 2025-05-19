export const formatDate = () => new Date().toISOString();
export const generateVerificationCode = () => Math.random().toString(36).substr(2, 8);