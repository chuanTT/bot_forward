import * as TelegramBot from "node-telegram-bot-api";
import { optionDefaultSend, TOKEN_TELEGRAM } from "./constant";
import {
  ICommandExecution,
  ICommandItemRetrunExecution,
  SendMessageOptions,
  SourceTargetType,
} from "../types";
import { IObjCommands, objCommands, returnExecution } from "./telegram";
import { SourceTarget } from "../entity/SourceTarget";
import sourcetargetService from "../services/sourcetarget.service";
import { removeCache } from "./cache";
import { strTarget } from "../helpers";

export const botTelegram = new TelegramBot(TOKEN_TELEGRAM, {
  polling: true,
});

// //  send messeage
export const sendMessageBot = async (
  chatId: TelegramBot.ChatId,
  text?: string,
  options?: SendMessageOptions
): Promise<TelegramBot.Message | undefined> => {
  if (text) {
    return await botTelegram.sendMessage(chatId, text || "", {
      ...optionDefaultSend,
      ...options,
    });
  }
};

export const sendArrMessageBot = async (
  chatId: TelegramBot.ChatId,
  arrText?: ICommandExecution,
  options: SendMessageOptions = undefined
): Promise<void> => {
  if (arrText && Array.isArray(arrText)) {
    for (const item of arrText) {
      let newText = "";
      if (!(typeof item === "string")) {
        newText = item?.value;
        options = item?.optons;
      } else {
        newText = item;
      }
      await sendMessageBot(chatId, newText, options);
    }
    return;
  } else {
    let newText = "";
    if (!((typeof arrText as string) === "string")) {
      newText = (arrText as returnExecution)?.value;
    } else {
      newText = arrText as string;
    }
    newText && (await sendMessageBot(chatId, newText, options));
  }
};

export const sendMessageBotHelp = async (chatId: number) => {
  return await sendArrMessageBot(
    chatId,
    await (objCommands as IObjCommands)?.help?.render?.()
  );
};

export const sendForwardBot = async (
  msg: TelegramBot.Message
): Promise<ICommandItemRetrunExecution> => {
  const userId = msg?.from?.id;
  const chatId = msg?.chat?.id;
  const messageId = msg?.message_id;
  const targetIds = await sourcetargetService.findBy(
    userId,
    SourceTargetType.TARGET
  );

  if (targetIds?.length <= 0) {
    removeCache(userId);
    return {
      data: `Vui lòng thêm nhóm ${strTarget} cho bot để thực hiện chức năng này.`,
    };
  }

  console.log(msg)
  // for (const targetId of targetIds) {
  //   await botTelegram.forwardMessage(
  //     targetId?.group?.groupId,
  //     chatId,
  //     messageId
  //   );
  // }

  return {
    data: [],
    error: true,
  };
};
