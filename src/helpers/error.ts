import {
  ConfigTypeDate,
  EnumCommand,
  ICommandExecution,
  ICommandItemRetrunExecution,
} from "../types";
import { checkNumber, daysCustom, formatDate, isValidDate } from "./functions";
import { renderDefaultFormat } from "./render";
import { joinKeyCommand } from "./telegram";

// dùng chung
export const format = `không đúng định dạng`;
export const returnValueCommand = `Không tìm thấy kết quả.`;

export const formatAmount = "Số tiền";
export const formatTransferContent = "Nội dung chuyển khoản";

// validate ngày giao dịch
export const formatDateString = "<b>Ngày/Tháng/Năm</b>";
export const defaultErrorFormatDate = renderDefaultFormat([
  [formatDateString],
  [formatDateString, formatDateString],
]);

export const defaultThrowValidDate = (
  date?: ConfigTypeDate,
  prefix = "Ngày giao dịch",
  defaultFormat = defaultErrorFormatDate
) => {
  const isValid = isValidDate(date);
  if (!isValid) {
    return [`${prefix} ${format}`, defaultFormat];
  }
  return undefined;
};

export const validateDateRange = (
  startDate?: ConfigTypeDate,
  endDate?: ConfigTypeDate
) => {
  const startDateValid = daysCustom(startDate);
  const endDateValid = daysCustom(endDate);
  if (endDateValid.isBefore(startDateValid)) {
    return "Ngày kết thúc phải lớn hơn ngày bắt đầu";
  }
  return undefined;
};

export const checkVaidateThrowRange = (
  startDate?: ConfigTypeDate,
  endDate?: ConfigTypeDate,
  prefix?: string,
  defaultFormat?: string
): ICommandItemRetrunExecution | undefined => {
  const error = defaultThrowValidDate(startDate, prefix, defaultFormat);
  if (error) return returnExeFunction(error, true);
  if (endDate) {
    const errorEndDate = defaultThrowValidDate(endDate, prefix, defaultFormat);
    if (errorEndDate) return returnExeFunction(errorEndDate, true);
    const errorBefore = validateDateRange(startDate, endDate);
    if (errorBefore) return returnExeFunction(errorBefore, true);
  }
  return undefined;
};

// end validate ngày giao dịch

// validate default command
export const defaultCommandHelp = [
  "Câu lệnh này không hợp lệ.",
  `Vui lòng thực hiện lệnh này ${joinKeyCommand(EnumCommand.help)}`,
];

// commands
export const formatAmounttransferdate = renderDefaultFormat([
  [formatAmount, formatTransferContent],
  [formatAmount, formatTransferContent, formatDateString],
  [formatAmount, formatTransferContent, formatDateString, formatDateString],
]);

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
