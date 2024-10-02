import * as TelegramBot from "node-telegram-bot-api";
import {
  joinCommand,
  joinCommandsIgnoreStartHelp,
  joinFullName,
} from "../helpers";
import {
  EnumCommand,
  ICommandItemRetrunExecution,
  SendMessageOptions,
} from "../types";

export type ICommand = keyof typeof EnumCommand;
export type returnExecution = {
  value: string;
  optons: SendMessageOptions;
};

export type ICommandItem = {
  describe?: string;
  name?: string;
  render?: (msg?: TelegramBot.Message) => string | string[];
  execution?: (
    text: string,
    msg?: TelegramBot.Message,
    skip?: number
  ) => Promise<ICommandItemRetrunExecution>;
};

export interface IObjCommands extends Record<ICommand, ICommandItem> {}

export const objCommands: IObjCommands = {
  help: {
    describe: "Xem trợ giúp",
    render: () =>
      `Bạn có thể thực hiện những lệnh này:\n\n${joinCommandsIgnoreStartHelp()}\nLưu ý: Tổng hợp dữ liệu có thể một số cái sẽ không lấy không đủ được dữ liệu.`,
  },
  start: {
    describe: "Bắt đầu bot",
    render: (msg) => {
      const fullName = joinFullName(msg?.chat);
      return `Xin chào, <b>${fullName}</b>!!!\n\n${joinCommand(
        EnumCommand.help
      )}`;
    },
  },
};
