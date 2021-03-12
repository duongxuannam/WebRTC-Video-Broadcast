// Generate password
export function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }

  return `${s4() + s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
}

export function makeMemberCode() {
  let code = 'QM';
  const possible = '0123456789';

  for (let i = 0; i < 10; i++)
    code += possible.charAt(Math.floor(Math.random() * possible.length));

  return code;
}

const viPhonePrefixRegexp = /^(\+?0|\+?840|\+?84)|\+/;

export function removePhonePrefix(phoneNumber) {
  let _result = phoneNumber;
  if (phoneNumber) {
    _result = phoneNumber.replace(viPhonePrefixRegexp, '');
  }
  return _result;
}

export function isMobilePhone(number) {
  const lengthNum = number.length;
  const reg = /\d/g;
  const numberPhone = number.match(reg, number);
  if (!numberPhone) return false;
  const _length = numberPhone.length;
  return _length > 8 && lengthNum === _length;
}

export function insertPhonePrefix(prefix, phoneNumber) {
  let _result = phoneNumber;
  if (phoneNumber) {
    _result = prefix.concat(removePhonePrefix(phoneNumber));
  }
  return _result;
}

export const queryPhone = (number) => {
  const phoneWithoutNationCode = insertPhonePrefix('', number);
  const phoneWithPlusPrefix = insertPhonePrefix('+', number);
  const phoneWithZeroPrefix = insertPhonePrefix('0', number);
  const phoneWithPlusZeroPrefix = insertPhonePrefix('+0', number);
  const phoneWithNationCode = insertPhonePrefix('84', number);
  const phoneWithPlusNationCode = insertPhonePrefix('+84', number);
  const phoneWithNationCodeZero = insertPhonePrefix('840', number);
  const phoneWithPlusNationCodeZero = insertPhonePrefix('+840', number);
  return {
    phoneWithoutNationCode,
    phoneWithPlusPrefix,
    phoneWithZeroPrefix,
    phoneWithPlusZeroPrefix,
    phoneWithNationCode,
    phoneWithPlusNationCode,
    phoneWithNationCodeZero,
    phoneWithPlusNationCodeZero,
  };
};

export function changeAlias(str) {
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(/đ/g, 'd');
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A');
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E');
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I');
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O');
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U');
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y');
  str = str.replace(/Đ/g, 'D');
  return str;
}
