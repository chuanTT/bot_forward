import {
  ConfigTypeDate,
  EnumCommand,
  ICommandExecution,
  ICommandItemRetrunExecution,
} from "../types";
import { checkNumber } from "./functions";
import { renderDefaultFormat } from "./render";
import { joinKeyCommand } from "./telegram";

// dùng chung
export const format = `không đúng định dạng`;
export const returnValueCommand = `Không tìm thấy kết quả.`;

export const formatAmount = "Số tiền";
export const formatTransferContent = "Nội dung chuyển khoản";

// validate default command
export const defaultCommandHelp = [
  "Câu lệnh này không hợp lệ.",
  `Vui lòng thực hiện lệnh này ${joinKeyCommand(EnumCommand.help)}`,
];

// end validate default command

// default throw number page
export const defaultThrowNumber = (
  text: number | string,
  prefix: string = formatAmount
): string | undefined => {
  const isNumber = checkNumber(text);
  if (!isNumber) {
    return `${prefix} ${format}`;
  }
  return undefined;
};

export const defaultThrowPage = `Số trang ${format}`;
export const defaultThrowMaxPage = "Số trang vượt quá cho phép";
export const defaultCommandInputPage = (lastPage?: number): string[] => {
  const msg = ["Vui lòng nhập số trang bạn muốn xem"];
  if (lastPage) {
    msg.push(`Lưu ý: Số trang không được vượt quá <b>${lastPage}</b> trang`);
  }
  return msg;
};

// end default throw number page

// return function
export const returnExeFunction = (
  data: ICommandExecution,
  error?: boolean
): ICommandItemRetrunExecution => {
  return {
    data,
    error: !!error,
  };
};
