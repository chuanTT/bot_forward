import { KEY_SPLIT } from "../configs";
import * as dayjs from "dayjs";
import * as customParseFormat from "dayjs/plugin/customParseFormat";
import { randomBytes } from "crypto";
dayjs.extend(customParseFormat);

export const checkNumber = (num: string | number) => {
  if (!num) return false;
  if (typeof num === "number") return true;
  const regex = /^[0-9]+$/;
  return regex.test(num);
};

export const checkNumberGroup = (num: string | number) => {
  if (!num) return false;
  if (typeof num === "number") return true;
  const regex = /^-?[0-9]+(\|?-?[0-9]+)*$/;
  return regex.test(num);
};

export const calculatorLastPage = (total: number, take: number) =>
  Math.ceil(total / take);

export const splitPagination = (key: string) => {
  const [uuid, action] = key?.split(KEY_SPLIT);
  return {
    action,
    uuid,
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

export const randUuid = () => {
  const timestamp = Date.now().toString(36); // Thời gian hiện tại (millisecond) chuyển sang hệ cơ số 36
  const randomPart = randomBytes(8).toString("hex"); // Tạo 8 byte ngẫu nhiên
  return timestamp + randomPart; // Kết hợp timestamp và random string
};

export const checkStatusBot = (bot: boolean) => (bot ? 1 : 0);

export const awaitAllFor = async <T, R>(
  data: T[],
  callBack: (item: T, index: number) => Promise<R>
): Promise<R[]> => {
  const newData: R[] = [];
  let i = 0;
  for (const item of data) {
    const result = await callBack(item, i);
    if (result) {
      newData.push(result);
    }
    i++;
  }
  return newData;
};
