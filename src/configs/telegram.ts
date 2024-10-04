import * as TelegramBot from "node-telegram-bot-api";
import {
  joinCommand,
  joinCommandsIgnoreStartHelp,
  joinFullName,
  joinKeyCommand,
  renderCommandClearAll,
  renderCommandClearOne,
  renderSetSourceTarget,
  renderSourceTarget,
  renderSTGroupsRelations,
  renderStrongColor,
  strSource,
  strTarget,
} from "../helpers";
import {
  EnumCommand,
  ICommandItemRetrunExecution,
  SendMessageOptions,
  SourceTargetType,
} from "../types";
import { getCache, removeCache } from "./cache";
import sourcetargetService from "../services/sourcetarget.service";
import { sendForwardBot } from "./InitializationTelebot";

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
  startforward: {
    describe: "Bắt đầu lắng nghe khi có thay đổi từ các nhóm nguồn",
    render: async (msg) => {
      const fullName = `${msg?.from?.first_name?.trim()} ${msg?.from?.last_name?.trim()}`;
      return `Bắt đầu lắng nghe thay đổi của các nhóm nguồn của ${renderStrongColor(
        fullName
      )} - (${renderStrongColor(msg?.from?.username)}).\n\nGõ ${joinKeyCommand(
        EnumCommand.cancel
      )} để hủy thao tác.`;
    },
    execution: async (_, msg) => {
      const userId = msg?.from?.id;
      const groupId = msg?.chat?.id;
      const results = await sourcetargetService.findOne(
        userId,
        groupId,
        SourceTargetType.SOURCE
      );

      if (results) {
        return await sendForwardBot(msg);
      }

      return {
        data: [],
        error: true,
      };
    },
  },

  readsource: {
    describe: `Xem tất cả danh sách nhóm ${strSource}`,
    render: async (msg) => {
      return renderSTGroupsRelations(msg?.from?.id, SourceTargetType.SOURCE);
    },
  },

  setsource: {
    describe: "thêm nhóm mà bot đã tham gia vào nguồn nhóm",
    render: async () => renderSourceTarget(),
    execution: async (text, msg) => {
      return renderSetSourceTarget(text, msg, SourceTargetType.SOURCE);
    },
  },

  clearallsource: renderCommandClearAll(),
  clearonesource: renderCommandClearOne(),

  readtarget: {
    describe: `Xem tất cả danh sách nhóm ${strTarget}`,
    render: async (msg) => {
      return renderSTGroupsRelations(msg?.from?.id, SourceTargetType.TARGET);
    },
  },

  settarget: {
    describe: `thêm nhóm mà bot đã tham gia vào ${strTarget}`,
    render: async () => renderSourceTarget(strTarget),
    execution: async (text, msg) => {
      return renderSetSourceTarget(text, msg, SourceTargetType.TARGET);
    },
  },

  clearalltarget: renderCommandClearAll(SourceTargetType.TARGET),
  clearonetarget: renderCommandClearOne(SourceTargetType.TARGET),

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

  cancel: {
    describe: "Hủy bỏ hoạt động hiện tại",
    render: async (msg) => {
      const userId = msg.from.id;
      const command = getCache(userId);
      if (!command) {
        return `Không có lệnh hoạt động để hủy bỏ. Dù sao thì tôi cũng không làm gì cả.`;
      }
      removeCache(userId);
      return `Lệnh ${command} đã bị hủy. Tôi có thể làm gì khác cho bạn không?\n\nGửi ${joinKeyCommand(
        EnumCommand.help
      )} để biết danh sách các lệnh.`;
    },
  },
};
