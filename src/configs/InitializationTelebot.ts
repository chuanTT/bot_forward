import * as TelegramBot from "node-telegram-bot-api";
import { optionDefaultSend, TOKEN_TELEGRAM } from "./constant";
import {
  ICommandExecution,
  ICommandItemRetrunExecution,
  IMessage,
  SendMessageOptions,
  SourceTargetType,
} from "../types";
import { IObjCommands, objCommands, returnExecution } from "./telegram";
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

// check send
export const senDocumentBot = async (
  chatId: TelegramBot.ChatId,
  msg: IMessage
) => {
  if (msg.document) {
    const file_id = msg.document.file_id;
    const caption = msg.caption;
    const thumbnailId = msg.document.thumb.file_id;
    botTelegram.sendDocument(chatId, file_id, {
      caption,
      parse_mode: "HTML",
      thumbnail: thumbnailId,
    });
  }
};

export const sendPhotoBot = async (
  chatId: TelegramBot.ChatId,
  msg: IMessage
) => {
  if (msg?.photo) {
    const photo = msg.photo;
    const caption = msg.caption;
    const originalFile = photo?.[photo?.length - 1];

    botTelegram.sendPhoto(chatId, originalFile?.file_id, {
      caption,
      parse_mode: "HTML",
    });
  }
};

export const sendMessage = async (
  chatId: TelegramBot.ChatId,
  msg: IMessage
) => {
  if (msg?.text) {
    await sendMessageBot(chatId, msg.text);
  }
};

const objSendTelegram = {};

export const sendForwardBot = async (
  msg: IMessage
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

  for (const targetId of targetIds) {
    const groupId = targetId?.group?.groupId;
    if (msg?.photo) {
      await sendPhotoBot(groupId, msg);
    } else if (msg?.document) {
      await senDocumentBot(groupId, msg);
    } else if (msg.text) {
      await sendMessageBot(groupId, msg.text);
    }
    // await botTelegram.forwardMessage(
    //   targetId?.group?.groupId,
    //   chatId,
    //   messageId
    // );
  }

  return {
    data: [],
    error: true,
  };
};
