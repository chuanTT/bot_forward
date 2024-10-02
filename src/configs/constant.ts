import { config } from "dotenv";
import { EnumCommand } from "../types";
import { SendMessageOptions } from "node-telegram-bot-api";
config();

export const PORT = process.env.PORT

export const TOKEN_TELEGRAM = process.env.TOKEN_TELEGRAM;
export const HREF_MTTQ = process.env.HREF_MTTQ;
export const TAKE = +(process.env.TAKE ?? 5);
export const INPUT_PAGE = 'inputpage'
export const NEXT_PAGE = 'nextpage'
export const PREV_PAGE = 'prevpage'
export const KEY_SPLIT = "_"
export const EXE_SPLIT = "|"
export const STR_FORMAT = "DD/MM/YYYY";
export const ARR_VALUE_FORMAT_DATE = [
  "DD/MM/YYYY",
  "D/MM/YYYY",
  "DD/M/YYYY",
  "D/M/YYYY",
];

export const arrIgnoreCommads = [EnumCommand.start, EnumCommand.help];

export const optionDefaultSend: SendMessageOptions = {
  parse_mode: "HTML",
  disable_notification: false,
  protect_content: true,
  disable_web_page_preview: true,
  allow_sending_without_reply: false,
};
