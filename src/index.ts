// import { AppDataSource } from "./data-source";
import app from "./server";
import { PORT, TOKEN_TELEGRAM } from "./configs";
import { ignoreStartHelpFunc } from "./helpers";
import * as TelegramBot from "node-telegram-bot-api"

const notArrayCommands = ignoreStartHelpFunc();
const arrKeysCommands = Object.keys(notArrayCommands);

// Tạo một instance của bot
const bot = new TelegramBot(TOKEN_TELEGRAM, { polling: true });

// Lắng nghe sự kiện `my_chat_member` để phát hiện thay đổi quyền của bot
bot.on("my_chat_member", (msg) => {
  const status = msg.new_chat_member.status; // Trạng thái mới của bot
  const chatId = msg.chat.id; // ID của nhóm
  const chatTitle = msg.chat.title || "No Title"; // Tên của nhóm

  console.log(msg)

  // Kiểm tra nếu bot bị đá khỏi nhóm
  if (status === "left") {
    console.log(`Bot đã bị kích khỏi nhóm: ${chatTitle} (${chatId})`);
    // Thực hiện các hành động khác như gửi thông báo hoặc xóa ID nhóm khỏi cơ sở dữ liệu
  } else if (status === "member") {
    console.log(`Bot đã được thêm vào nhóm: ${chatTitle} (${chatId})`);
  }
});

app.listen(PORT, () => console.log(`server lister port:${PORT} `));

// AppDataSource.initialize()
//   .then(async () => {
 
//   })
//   .catch((error) => console.log(error));
