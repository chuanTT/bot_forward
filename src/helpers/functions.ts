import { ARR_VALUE_FORMAT_DATE, KEY_SPLIT, STR_FORMAT } from "../configs";
import * as dayjs from "dayjs";
import * as customParseFormat from "dayjs/plugin/customParseFormat";
import {randomBytes} from "crypto";
dayjs.extend(customParseFormat);

export const checkNumber = (num: string | number) => {
  if (!num) return false;
  if (typeof num === "number") return true;
  const regex = /^[0-9]+$/;
  return regex.test(num);
};

export const calculatorLastPage = (total: number, take: number) =>
  Math.ceil(total / take);

export const splitPagination = (key: string) => {
  const [uuid, action] = key?.split(KEY_SPLIT);
  return {
    action,
    uuid
  };
};

export const numberMoneyVND = (num: string | number) => {
  let t = "0";
  if (num) {
    if (typeof num === "string") {
      num = Number(num);
    }
    t = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
  return t;
};

export const removeVietnameseTones = (str: string, toUpperCase = false) => {
  str = str.toLowerCase();
  str = str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
  return toUpperCase ? str.toUpperCase() : str;
};

export const formatDate = (date: dayjs.ConfigType, format = STR_FORMAT) => {
  return dayjs(date, ARR_VALUE_FORMAT_DATE).format(format);
};

export const daysCustom = (date?: dayjs.ConfigType) =>
  dayjs(date, ARR_VALUE_FORMAT_DATE);

export const isValidDate = (date: dayjs.ConfigType) => {
  return dayjs(date, ARR_VALUE_FORMAT_DATE, true).isValid();
};


export const randUuid = () => {
  const timestamp = Date.now().toString(36);  // Thời gian hiện tại (millisecond) chuyển sang hệ cơ số 36
  const randomPart = randomBytes(8).toString('hex');  // Tạo 8 byte ngẫu nhiên
  return timestamp + randomPart;  // Kết hợp timestamp và random string
}

