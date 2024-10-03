import { config } from "dotenv";
import { ChatType, EnumCommand, EnumType } from "../types";
import { SendMessageOptions } from "node-telegram-bot-api";
config();

export const PORT = process.env.PORT;

export const TOKEN_TELEGRAM = process.env.TOKEN_TELEGRAM;
export const TAKE = +(process.env.TAKE ?? 30);
export const MAX_TAKE = +(process.env.MAX_TAKE ?? 1000);

export const INPUT_PAGE = "inputpage";
export const NEXT_PAGE = "nextpage";
export const PREV_PAGE = "prevpage";
export const KEY_SPLIT = "_";
export const EXE_SPLIT = "|";

export const FIRST_COMMAD = "/";
export const TAG_TELE = "@";

export const arrIgnoreCommads = [EnumCommand.start, EnumCommand.help];

export const arrTypeValid: ChatType[] = ["group", "supergroup", "channel"];

export const optionDefaultSend: SendMessageOptions = {
  parse_mode: "HTML",
  disable_notification: true,
  protect_content: false,
  disable_web_page_preview: true,
  allow_sending_without_reply: false,
};
