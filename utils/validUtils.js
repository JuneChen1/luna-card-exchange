module.exports = {
  isPositiveInteger(number) {
    return Number.isInteger(number) && number > 0;
  },
  isValidString(value) {
    return typeof value === 'string' && value.trim() !== '';
  },
  isValidUsername(username) {
    const usernameRegex = /^[A-Za-z0-9_]{1,50}$/;

    return typeof username === 'string' && usernameRegex.test(username.trim());
  },
  isValidUUID(value) {
    return (
      typeof value === 'string' &&
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        value
      )
    );
  },
  isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    return emailRegex.test(email);
  },
  isValidPassword(password) {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

    return typeof password === 'string' && passwordRegex.test(password);
  },
  isValidGenshinUid(uid) {
    const uidRegex = /^(6\d{8}|7\d{8}|9\d{8}|18\d{8}|8\d{8})$/;

    return typeof uid === 'string' && uidRegex.test(uid.trim());
  },
  isValidCardsList(list) {
    return (
      Array.isArray(list) &&
      list.every(
        (cardId) => Number.isInteger(cardId) && cardId >= 0 && cardId <= 21
      )
    );
  }
};
