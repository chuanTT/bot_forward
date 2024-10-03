import { config } from "dotenv";
import { EnumCommand, EnumType } from "../types";
import { SendMessageOptions } from "node-telegram-bot-api";
config();

export const PORT = process.env.PORT;

export const TOKEN_TELEGRAM = process.env.TOKEN_TELEGRAM;
export const HREF_MTTQ = process.env.HREF_MTTQ;
export const TAKE = +(process.env.TAKE ?? 30);
export const MAX_TAKE = 1000;

export const INPUT_PAGE = "inputpage";
export const NEXT_PAGE = "nextpage";
export const PREV_PAGE = "prevpage";
export const KEY_SPLIT = "_";
export const EXE_SPLIT = "|";

export const FIRST_COMMAD = "/";
export const TAG_TELE = "@";

export const arrIgnoreCommads = [EnumCommand.start, EnumCommand.help];

export const arrTypeValid = [EnumType.supergroup, EnumType.group];

export const optionDefaultSend: SendMessageOptions = {
  parse_mode: "HTML",
  disable_notification: true,
  protect_content: false,
  disable_web_page_preview: true,
  allow_sending_without_reply: false,
};
