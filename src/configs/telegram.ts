import * as TelegramBot from "node-telegram-bot-api";
import {
  joinCommand,
  joinCommandsIgnoreStartHelp,
  joinFullName,
  renderGroupsChunk,
  renderGroupsRelationsChunk,
  renderStrongColor,
} from "../helpers";
import {
  EnumCommand,
  ICommandItemRetrunExecution,
  SendMessageOptions,
} from "../types";
import groupService from "../services/group.service";
import { EXE_SPLIT, MAX_TAKE } from "./constant";
import { In } from "typeorm";
import sourceService from "../services/source.service";

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
      return [
        `Nhập nhóm muốn làm nguồn. Các nhóm cách nhau "${EXE_SPLIT}"\n\nLưu ý: ${renderStrongColor(
          `Danh sách nhóm nguồn tối đa có thể hỗ trợ ${MAX_TAKE} nhóm`
        )}`,
        ...renderGroupsChunk(data, true),
      ];
    },
    execution: async (text, msg) => {
      const arrGroupIds = text?.split(EXE_SPLIT);
      const userId = msg.from.id;
      const maxCountSource = await sourceService.countBy(userId);
      if (maxCountSource >= MAX_TAKE)
        return {
          data: [
            `Bot đã vượt quá ${renderStrongColor(
              MAX_TAKE
            )} nhóm cho phép làm danh sách nguồn`,
          ],
          error: true,
        };
      const data = await sourceService.insert(
        arrGroupIds,
        userId,
        maxCountSource
      );
      const error = !data || (data && data?.length <= 0);
      const msgChat = error
        ? [
            "Bot có thể không được tham gia vào nhóm hoặc đã có trong danh sách nguồn.",
          ]
        : ["Thêm danh sách nhóm thành công."];
      return { data: msgChat, error };
    },
  },

  readsource: {
    describe: "Xem tất cả danh sách nhóm nguồn",
    render: async (msg) => {
      const results = await sourceService.findBy(msg?.from?.id);
      return renderGroupsRelationsChunk(results, true);
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
