import * as TelegramBot from "node-telegram-bot-api";
import { returnExecution } from "../configs";
import * as dayjs from "dayjs";

// telegram bot
export enum EnumCommand {
  "help" = "help",
  "start" = "start",
  "setsource" = "setsource"
}

export enum EnumType {
  "supergroup" = "supergroup",
  "group" = "group",
}

export type ID_DB = string | number;

export type ConfigTypeDate = dayjs.ConfigType;

// type telegram
export type SendMessageOptions = TelegramBot.SendMessageOptions;
export type InlineKeyboardButton = TelegramBot.InlineKeyboardButton;
export type UserTelegram = TelegramBot.User


export type ICommandExecution =
  | (string | returnExecution)[]
  | string
  | returnExecution;
export type ICommandItemRetrunExecution = {
  data: ICommandExecution;
  error?: boolean;
};

export type IBotCommand = TelegramBot.BotCommand;
