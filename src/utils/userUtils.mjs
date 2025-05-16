import crypto from 'crypto';

export const generateUserName = (name) => {
  const suffix = Math.floor(1000 + Math.random() * 9000);
  return `${name.toLowerCase().replace(/\s/g, '')}${suffix}`;
};

export const generatePassword = () => {
  return crypto.randomBytes(8).toString('base64'); 
}
