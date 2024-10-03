import * as TelegramBot from "node-telegram-bot-api";
import {
  joinCommand,
  joinCommandsIgnoreStartHelp,
  joinFullName,
  renderGroupsChunk,
} from "../helpers";
import {
  EnumCommand,
  ICommandItemRetrunExecution,
  SendMessageOptions,
} from "../types";
import groupService from "../services/group.service";
import { EXE_SPLIT } from "./constant";

export type ICommand = keyof typeof EnumCommand;
export type returnExecution = {
  value: string;
  optons: SendMessageOptions;
};

export type ICommandItem = {
  describe?: string;
  name?: string;
  render?: (msg?: TelegramBot.Message) => Promise<string | string[]>;
  execution?: (
    text: string,
    msg?: TelegramBot.Message,
    skip?: number
  ) => Promise<ICommandItemRetrunExecution>;
};

export interface IObjCommands extends Record<ICommand, ICommandItem> {}

export const objCommands: IObjCommands = {
  setsource: {
    describe: "thêm nhóm mà bot đã tham gia vào nguồn nhóm",
    render: async () => {
      const { data } = await groupService.findAllPagination({});
      return [`Nhập nhóm muốn làm nguồn các nhóm cách nhau "${EXE_SPLIT}"`, ...renderGroupsChunk(data, true)];
    },
  },

  help: {
    describe: "Xem trợ giúp",
    render: async () =>
      `Bạn có thể thực hiện những lệnh này:\n\n${joinCommandsIgnoreStartHelp()}`,
  },
  start: {
    describe: "Bắt đầu bot",
    render: async (msg) => {
      const fullName = joinFullName(msg?.chat);
      return `Xin chào, <b>${fullName}</b>!!!\n\n${joinCommand(
        EnumCommand.help
      )}`;
    },
  },
};
