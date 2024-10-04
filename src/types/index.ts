import * as TelegramBot from "node-telegram-bot-api";
import { returnExecution } from "../configs";
import * as dayjs from "dayjs";

// telegram bot
export enum EnumCommand {
  "help" = "help",
  "start" = "start",
  "setsource" = "setsource",
  "readsource" = "readsource",
  "clearallsource" = "clearallsource",
  "clearonesource" = "clearonesource",
  "readtarget" = "readtarget",
  "settarget" = "settarget",
  "clearalltarget" = "clearalltarget",
  "clearonetarget" = "clearonetarget",
  "cancel" = "cancel"
}

export enum EnumType {
  "supergroup" = "supergroup",
  "group" = "group",
}

export enum SourceTargetType {
  SOURCE = 'source',
  TARGET = 'target',
}

export type ID_DB = string | number;

export type ConfigTypeDate = dayjs.ConfigType;

// type telegram
export type SendMessageOptions = TelegramBot.SendMessageOptions;
export type InlineKeyboardButton = TelegramBot.InlineKeyboardButton;
export type UserTelegram = TelegramBot.User;
export type ChatType = TelegramBot.ChatType;
export type IMessage = TelegramBot.Message;

export type ICommandExecution =
  | (string | returnExecution)[]
  | string
  | returnExecution;
export type ICommandItemRetrunExecution = {
  data: ICommandExecution;
  error?: boolean;
};

export type IBotCommand = TelegramBot.BotCommand;
