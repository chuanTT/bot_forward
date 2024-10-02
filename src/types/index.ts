import * as TelegramBot from "node-telegram-bot-api";
import { returnExecution } from "../configs";
import * as dayjs from "dayjs";

// telegram bot
export enum EnumCommand {
  "help" = "help",
  "start" = "start",
}

export type ConfigTypeDate = dayjs.ConfigType;
export type SendMessageOptions = TelegramBot.SendMessageOptions;
export type InlineKeyboardButton = TelegramBot.InlineKeyboardButton;
export type ICommandExecution =
  | (string | returnExecution)[]
  | string
  | returnExecution;
export type ICommandItemRetrunExecution = {
  data: ICommandExecution;
  error?: boolean;
};

export type IBotCommand = TelegramBot.BotCommand;
