import app from "./server";
import {
  arrTypeValid,
  FIRST_COMMAD,
  getCache,
  ICommandItem,
  objCommands,
  PORT,
  removeCache,
  sendMessageBotHelp,
  setAndDelCache,
  TAG_TELE,
} from "./configs";
import { ignoreStartHelpFunc, myCommands } from "./helpers";
import { AppDataSource } from "./data-source";
import { botTelegram, sendArrMessageBot } from "./configs";
import groupService from "./services/group.service";
import memberuseService from "./services/memberuse.service";
import { EnumCommand } from "./types";

AppDataSource.initialize()
  .then(async () => {
    const notArrayCommands = ignoreStartHelpFunc();
    const arrKeysCommands = Object.keys(notArrayCommands);

    await botTelegram.setMyCommands(myCommands());

    const botInfo = await botTelegram.getMe();
    botTelegram.on("message", async (msg) => {
      const text = msg.text ?? "";
      const chat = msg.chat;
      const userId = msg?.from?.id;
      const commandKey = getCache(userId);
      const isTypeVaild = !arrTypeValid.includes(chat.type);

      if (msg.new_chat_title) {
        await groupService.update(chat?.id, msg.new_chat_title, msg?.migrate_to_chat_id);
      }

      if (text.charAt(0) === FIRST_COMMAD) {
        const arrCommand = text?.split(TAG_TELE);
        const command = arrCommand?.[0]?.slice(1);
        const isMathTag = text.indexOf(TAG_TELE);
        const isMathBot = arrCommand?.[1] === botInfo.username;
        const currentCommand = objCommands?.[command] as ICommandItem;
        const isKey = !!currentCommand?.execution;
        if (!(command === EnumCommand.cancel)) {
          setAndDelCache(userId, command, isKey);
        }
        if ((isMathBot || isMathTag === -1) && currentCommand) {
          const arrText = await currentCommand.render(msg);
          sendArrMessageBot(chat?.id, arrText);
          return await memberuseService.upsert(msg.from);
        }
        isTypeVaild && sendMessageBotHelp(chat?.id);
      } else if (commandKey && arrKeysCommands.includes(commandKey)) {
        const currentCommand = objCommands[commandKey] as ICommandItem;
        const results = await currentCommand?.execution?.(text, msg);
        if (!results?.error) removeCache(userId);
        return sendArrMessageBot(chat?.id, results?.data);
      } else if (isTypeVaild) {
        sendMessageBotHelp(chat?.id);
      }
    });

    botTelegram.on("left_chat_member", async (msg) => {
      const chatId = msg?.chat?.id;
      const admins = await botTelegram.getChatAdministrators(chatId);
      const newAdmins = admins.filter((admin) => admin?.status === "creator")
      if (newAdmins?.length <= 0) {
        await groupService.delete(chatId);
      }
    })

    // Lắng nghe sự kiện `my_chat_member` để phát hiện thay đổi quyền của bot
    botTelegram.on("my_chat_member", async (msg) => {
      const status = msg.new_chat_member.status; // Trạng thái mới của bot
      const chatId = msg.chat.id; // ID của nhóm
      const chatTitle = msg.chat.title || "No Title"; // Tên của nhóm
      // Kiểm tra nếu bot bị đá khỏi nhóm
      if (status === "left") {
        await groupService.delete(chatId);
      } else if (status === "member") {
        await groupService.create(chatId, chatTitle);
      }
    });

    app.listen(PORT, () => console.log(`server lister port:${PORT} `));
  })
  .catch((error) => console.log(error));
