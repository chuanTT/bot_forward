import TelegramBot = require("node-telegram-bot-api");
import {
  arrIgnoreCommads,
  ICommand,
  IObjCommands,
  objCommands,
} from "../configs";
import { EnumCommand, IBotCommand } from "../types";
import { omit } from "lodash";

export const ignoreStartHelpFunc = (arrIngore: ICommand[] = arrIgnoreCommads) =>
  omit(objCommands, arrIngore);

export const joinFullName = (chat?: TelegramBot.Chat) => {
  return `${chat?.first_name?.trim()} ${chat?.last_name?.trim()}`?.trim();
};

export const joinKeyCommand = (key: ICommand) => `/${key}`;

export const joinCommand = (key: ICommand, desc?: string) => {
  let newDesc = desc;
  if (!newDesc && objCommands?.[key]) {
    newDesc = objCommands?.[key]?.describe;
  }
  return `${joinKeyCommand(key)} - ${newDesc}`;
};

export const joinCommands = (keys: ICommand[]): string => {
  return keys?.map((key) => `${joinCommand(key)}\n`)?.join("");
};

export const joinCommandsIgnoreStartHelp = (): string => {
  const arrKeys = Object.keys(ignoreStartHelpFunc()) as ICommand[];
  return joinCommands(arrKeys);
};

export const myCommands = (): IBotCommand[] => {
  return Object.keys(ignoreStartHelpFunc([EnumCommand.start])).map((item) => {
    return {
      command: item,
      description: (objCommands as IObjCommands)[item].describe,
    };
  });
};
