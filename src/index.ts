import app from "./server";
import {
  FIRST_COMMAD,
  ICommandItem,
  objCommands,
  PORT,
  setAndDelCache,
  TAG_TELE,
} from "./configs";
import { ignoreStartHelpFunc, myCommands } from "./helpers";
import { AppDataSource } from "./data-source";
import {
  botTelegram,
  sendArrMessageBot,
} from "./configs";
import groupService from "./services/group.service";
import memberuseService from "./services/memberuse.service";

AppDataSource.initialize()
  .then(async () => {
    const notArrayCommands = ignoreStartHelpFunc();
    const arrKeysCommands = Object.keys(notArrayCommands);

    await botTelegram.setMyCommands(myCommands());

    const botInfo = await botTelegram.getMe();
    botTelegram.on("message", async (msg) => {
      const text = msg.text ?? "";
      const chat = msg.chat;

      if (text.charAt(0) === FIRST_COMMAD) {
        const arrCommand = text?.split(TAG_TELE);
        const command = arrCommand?.[0]?.slice(1);
        const isMathTag = text.indexOf(TAG_TELE);
        const isMathBot = arrCommand?.[1] === botInfo.username;
        const currentCommand = objCommands?.[command] as ICommandItem;
        const isKey = arrKeysCommands.includes(command);
        setAndDelCache(msg?.from?.id, command, isKey);
        if ((isMathBot || isMathTag === -1) && currentCommand) {
          const arrText = await currentCommand.render(msg);
          sendArrMessageBot(chat?.id, arrText);
          await memberuseService.upsert(msg.from);
        }
      }
    });

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
