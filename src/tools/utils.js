import jalaliMoment from "jalali-moment";
import persianJS from "persianjs";
import fileExtension from "file-extension";
import dayjs from "dayjs";
import passGenerator from "generate-password";

export function checkRegex(
  isFarsiChar,
  isEnglishLower,
  isEnglishUpper,
  isNumberic,
  specificChars,
  stingValueToCheck
) {
  const filter_FarsiChars = "اآبپتثجچحخدذرزژسشصضطظعغفقکگلمنوهیء";
  const filter_EnUpperChars = "A-Z";
  const filter_EnLowerChars = "a-z";
  const filter_NumericChars = "0-9";

  let pattern = "";
  if (isFarsiChar || isEnglishLower || isEnglishUpper || isNumberic) {
    if (isFarsiChar) {
      pattern += filter_FarsiChars;
    }
    if (isEnglishLower) {
      pattern += filter_EnLowerChars;
    }
    if (isEnglishUpper) {
      pattern += filter_EnUpperChars;
    }
    if (isNumberic) {
      pattern += filter_NumericChars;
    }
    if (specificChars.length > 0) {
      let chars = specificChars.split("");
      chars.forEach((ch) => {
        pattern += `\\${ch}`;
      });
      pattern += specificChars;
    }
    pattern = `^[${pattern}]+$`;
  }
  var patt = new RegExp(pattern);

  return patt.test(stingValueToCheck);
}

export function addFirstZero(txtNum) {
  if (typeof txtNum === "number") {
    if (txtNum < 10) {
      return `0${txtNum}`;
    } else {
      return txtNum;
    }
  } else if (typeof txtNum === "string") {
    if (txtNum.length < 2) {
      return `0${txtNum}`;
    } else {
      return txtNum;
    }
  } else return txtNum;
}

export function farsiNum(txt) {
  let originalText = `${txt}`;

  return originalText.length > 0
    ? persianJS(originalText).englishNumber().toString()
    : "";
}

export function reverseText(text) {
  return text.split("").reverse().join("");
}

export function moneyNumber(number) {
  if (number >= 0 && number < 1000) return number;

  let txt = reverseText(`${number}`);

  let result = "";
  let part1 = txt.substr(0, 3);
  let part2 = txt.substr(3);
  result += `${part1},`;

  while (part2.length > 3) {
    txt = part2;
    part1 = txt.substr(0, 3);
    part2 = txt.substr(3);
    result += `${part1},`;
  }

  result += `${part2}`;

  return reverseText(result);
}

export function truncateText(source, size) {
  return source.length > size ? source.slice(0, size - 1) + "…" : source;
}

export function stringToDate(date) {
  const year = parseInt(date.substr(0, 4));
  const month = parseInt(date.substr(4, 2));
  const day = parseInt(date.substr(6, 2));

  return {
    year,
    month,
    day,
  };
}

export function stringToTime(time) {
  const hours = parseInt(time.substr(0, 2));
  const minutes = parseInt(time.substr(3, 2));

  return {
    hours,
    minutes,
  };
}

export function stringToTimeWithoutColon(time) {
  const hours = parseInt(time.substr(0, 2));
  const minutes = parseInt(time.substr(2, 2));

  return {
    hours,
    minutes,
  };
}

export function weekDayName(dayID) {
  let result = "";

  switch (dayID) {
    case 1: {
      result = "شنبه";
      break;
    }
    case 2: {
      result = "یکشنبه";
      break;
    }
    case 3: {
      result = "دوشنبه";
      break;
    }
    case 4: {
      result = "سه شنبه";
      break;
    }
    case 5: {
      result = "چهارشنبه";
      break;
    }
    case 6: {
      result = "پنجشنبه";
      break;
    }
    case 7: {
      result = "جمعه";
      break;
    }
    default: {
      result = "";
      break;
    }
  }

  return result;
}

export function currentDate() {
  const pdate = jalaliMoment().locale("fa").format("dddd DD MMMM YYYY");

  return farsiNum(pdate);
}

export function currentMiladiDateWithSlash() {
  var today = new Date();
  var date =
    today.getFullYear() +
    "/" +
    addFirstZero(today.getMonth() + 1) +
    "/" +
    addFirstZero(today.getDate());

  return date;
}

export function currentMiladiDateWithoutSlash() {
  var today = new Date();
  var date =
    today.getFullYear() +
    addFirstZero(today.getMonth() + 1) +
    addFirstZero(today.getDate());

  return date;
}

export function currentPersianDateWithSlash() {
  var today = new Date();
  var date =
    today.getFullYear() + "/" + (today.getMonth() + 1) + "/" + today.getDate();

  return jalaliMoment(date, "YYYY/MM/DD").locale("fa").format("YYYY/MM/DD");
}

export function currentPersianDateWithoutSlash() {
  var today = new Date();
  var date =
    today.getFullYear() + "/" + (today.getMonth() + 1) + "/" + today.getDate();

  return jalaliMoment(date, "YYYY/MM/DD").locale("fa").format("YYYYMMDD");
}

export function currentDayName() {
  return jalaliMoment().add(1, "day").locale("fa").format("dddd");
}

export function nextDaysName(days) {
  return jalaliMoment().add(days, "day").locale("fa").format("dddd");
}

export function getPersianDate(addDays) {
  const currentDate = jalaliMoment()
    .add(addDays ? addDays : 0, "day")
    .locale("fa")
    .format("YYYY/M/D");

  const firstSlashIndex = currentDate.indexOf("/");
  const lastSlashIndex = currentDate.lastIndexOf("/");

  const year = currentDate.substr(0, 4);
  const month = currentDate.substr(
    firstSlashIndex + 1,
    lastSlashIndex - firstSlashIndex - 1
  );
  const day = currentDate.substr(lastSlashIndex + 1);

  return {
    year: parseInt(year, 10),
    month: parseInt(month, 10),
    day: parseInt(day, 10),
  };
}

export function dayName(day) {
  const miladiDay = jalaliMoment
    .from(`${day.year}/${day.month}/${day.day}`, "fa", "YYYY/MM/DD")
    .format("YYYY/MM/DD");

  return farsiNum(
    jalaliMoment(miladiDay, "YYYY/MM/DD")
      .locale("fa")
      .format("dddd DD MMMM YYYY")
  );
}

export function dayNameFromText(day) {
  const miladiDay = jalaliMoment
    .from(`${day}`, "fa", "YYYYMMDD")
    .format("YYYY/MM/DD");

  return farsiNum(
    jalaliMoment(miladiDay, "YYYY/MM/DD")
      .locale("fa")
      .format("dddd DD MMMM YYYY")
  );
}

export function weekDayNameFromText(day) {
  const miladiDay = jalaliMoment
    .from(`${day}`, "fa", "YYYYMMDD")
    .format("YYYY/MM/DD");

  return farsiNum(
    jalaliMoment(miladiDay, "YYYY/MM/DD").locale("fa").format("dddd")
  );
}

export function dateToText(date) {
  return `${date.year}${addFirstZero(`${date.month}`)}${addFirstZero(
    `${date.day}`
  )}`;
}

export function persianTime(time) {
  return farsiNum(`${addFirstZero(time.hours)}:${addFirstZero(time.minutes)}`);
}

export function formattedTime(time) {
  return `${addFirstZero(time.hours)}:${addFirstZero(time.minutes)}`;
}

export function formattedFullTime(date) {
  var d = date || new Date();
  var z = (n) => ("0" + n).slice(-2);
  var zz = (n) => ("00" + n).slice(-3);
  return `${z(d.getHours())}:${z(d.getMinutes())}:${z(d.getSeconds())}.${zz(
    d.getMilliseconds()
  )}`;
}

export function formattedDate(date) {
  return `${addFirstZero(date.year)}/${addFirstZero(date.month)}/${addFirstZero(
    date.day
  )}`;
}

export function formattedDateWithoutSlash(date) {
  return `${addFirstZero(date.year)}${addFirstZero(date.month)}${addFirstZero(
    date.day
  )}`;
}

export function slashDate(dateTxt) {
  return dateTxt
    ? `${dateTxt.substr(0, 4)}/${dateTxt.substr(4, 2)}/${dateTxt.substr(6)}`
    : "//";
}

export function colonTime(timeTxt) {
  let result = "::";

  if (timeTxt) {
    result = `${timeTxt.substr(0, 2)}:${timeTxt.substr(2, 2)}`;

    if (timeTxt.length === 6) {
      result += `:${timeTxt.substr(4)}`;
    }
  }

  return result;
}

export function formattedDateTime(dateTxt, timeTxt) {
  return farsiNum(`${slashDate(dateTxt)} - ${colonTime(timeTxt)}`);
}

export function jalaliToMiladi(date, time) {
  const dateForamtted = `${date.substr(0, 4)}/${date.substr(
    4,
    2
  )}/${date.substr(6, 2)}`;
  const timeFormatted = `${time.substr(0, 2)}:${time.substr(2, 2)}`;

  const miladiDateTimeObject = jalaliMoment(
    `${dateForamtted} ${timeFormatted}`,
    "jYYYY/jM/jD HH:mm"
  ).toDate();

  return miladiDateTimeObject;
}

export function isImageFile(filename) {
  const ext = fileExtension(filename);

  const imageExtensioan = ["jpg", "jpeg", "png", "bmp"];

  return imageExtensioan.filter((fx) => fx === ext).length > 0;
}

export function jalaliDate(dashedDateString) {
  dayjs.calendar("jalali");

  return dayjs(dashedDateString, { jalali: true });
}

export function generateRandomNumericPassword(passLength) {
  return passGenerator.generate({
    length: passLength,
    numbers: true,
    lowercase: false,
    uppercase: false,
    symbols: false,
  });
}

export function checkNationalCode(nationalCode) {
  if (nationalCode.length === 10) {
    if (
      nationalCode === "0000000000" ||
      nationalCode === "1111111111" ||
      nationalCode === "2222222222" ||
      nationalCode === "3333333333" ||
      nationalCode === "4444444444" ||
      nationalCode === "5555555555" ||
      nationalCode === "6666666666" ||
      nationalCode === "7777777777" ||
      nationalCode === "8888888888" ||
      nationalCode === "9999999999"
    ) {
      return false;
    }

    const c = parseInt(nationalCode.charAt(9));

    const n =
      parseInt(nationalCode.charAt(0)) * 10 +
      parseInt(nationalCode.charAt(1)) * 9 +
      parseInt(nationalCode.charAt(2)) * 8 +
      parseInt(nationalCode.charAt(3)) * 7 +
      parseInt(nationalCode.charAt(4)) * 6 +
      parseInt(nationalCode.charAt(5)) * 5 +
      parseInt(nationalCode.charAt(6)) * 4 +
      parseInt(nationalCode.charAt(7)) * 3 +
      parseInt(nationalCode.charAt(8)) * 2;

    const r = n - parseInt(n / 11) * 11;

    if (
      (r === 0 && r === c) ||
      (r === 1 && c === 1) ||
      (r > 1 && c === 11 - r)
    ) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

const methods = {
  addFirstZero,
  farsiNum,
  reverseText,
  moneyNumber,
  stringToDate,
  stringToTime,
  stringToTimeWithoutColon,
  currentDate,
  currentPersianDateWithSlash,
  currentPersianDateWithoutSlash,
  currentMiladiDateWithSlash,
  currentMiladiDateWithoutSlash,
  currentDayName,
  nextDaysName,
  getPersianDate,
  dayName,
  dayNameFromText,
  weekDayNameFromText,
  dateToText,
  persianTime,
  formattedTime,
  formattedFullTime,
  formattedDate,
  formattedDateWithoutSlash,
  truncateText,
  checkRegex,
  slashDate,
  colonTime,
  formattedDateTime,
  weekDayName,
  jalaliToMiladi,
  isImageFile,
  jalaliDate,
  generateRandomNumericPassword,
  checkNationalCode,
};

export default methods;
