import * as TelegramBot from "node-telegram-bot-api";
import { optionDefaultSend, TAKE, TOKEN_TELEGRAM } from "./constant";
import { ICommandExecution, SendMessageOptions } from "../types";
import { ICommandItem, objCommands, returnExecution } from "./telegram";
import { has } from "lodash";
import {
  calculatorLastPage,
  checkNumber,
  defaultCommandInputPage,
  defaultThrowMaxPage,
  defaultThrowPage,
  returnValueCommand,
} from "../helpers";

// export const botTelegram = new TelegramBot(TOKEN_TELEGRAM, {
//   polling: true,
// });

// //  send messeage
// export const sendMessageBot = async (
//   chatId: TelegramBot.ChatId,
//   text?: string,
//   options?: SendMessageOptions
// ): Promise<TelegramBot.Message | undefined> => {
//   if (text) {
//     return await botTelegram.sendMessage(chatId, text || "", {
//       ...optionDefaultSend,
//       ...options,
//     });
//   }
// };

// export const sendArrMessageBot = async (
//   chatId: TelegramBot.ChatId,
//   arrText?: ICommandExecution,
//   options: SendMessageOptions = undefined
// ): Promise<void> => {
//   if (arrText && Array.isArray(arrText)) {
//     for (const item of arrText) {
//       let newText = "";
//       if (!(typeof item === "string")) {
//         newText = item?.value;
//         options = item?.optons;
//       } else {
//         newText = item;
//       }
//       await sendMessageBot(chatId, newText, options);
//     }
//     return;
//   } else {
//     let newText = "";
//     if (!((typeof arrText as string) === "string")) {
//       newText = (arrText as returnExecution)?.value;
//     } else {
//       newText = arrText as string;
//     }
//     newText && (await sendMessageBot(chatId, newText, options));
//   }
// };

// export const sendMessageBotHelp = async (chatId: number) => {
//   return await sendArrMessageBot(chatId, objCommands?.help?.render?.());
// };

// export const executionCommandFunc = async (
//   keyCommand: string,
//   text: string,
//   msg: TelegramBot.Message,
//   skip?: number
// ) => {
//   const chatId = msg?.chat?.id;
//   const currentCommand = objCommands?.[keyCommand] as ICommandItem;
//   const dataStr = await currentCommand?.execution(text, msg, skip);
//   const isHasExecution = dataStr && has(dataStr, "value");

//   const newOptions = isHasExecution
//     ? (dataStr?.data as returnExecution).optons
//     : undefined;
//   await sendArrMessageBot(
//     chatId,
//     dataStr?.data || returnValueCommand,
//     newOptions
//   );
// };

// export const sendBotThrowPage = async (
//   text: string,
//   chatId: TelegramBot.ChatId,
//   total: string | number
// ) => {
//   const isNumber = checkNumber(text);
//   const lastPage = calculatorLastPage(+total, TAKE);
//   if (!isNumber) {
//     await sendArrMessageBot(chatId, [
//       defaultThrowPage,
//       ...defaultCommandInputPage(lastPage),
//     ]);
//     return true;
//   } else {
//     if (+text > lastPage) {
//       await sendArrMessageBot(chatId, [
//         defaultThrowMaxPage,
//         ...defaultCommandInputPage(lastPage),
//       ]);
//       return true;
//     }
//   }
//   return undefined;
// };
