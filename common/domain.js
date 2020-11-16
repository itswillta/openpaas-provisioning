const getDomainNameFromEmail = email => {
  const emailSeparatorIndex = email.indexOf('@');

  if (emailSeparatorIndex <= -1) throw new Error('Invalid email');

  return email.slice(emailSeparatorIndex + 1);;
}

module.exports = {
  getDomainNameFromEmail
};
