import { FindOneOptions } from "typeorm";
import { AppDataSource } from "../data-source";
import { ID_DB, UserTelegram } from "../types";
import { MemberUse } from "../entity/MemberUse";
import { checkStatusBot } from "../helpers";

class memberUseServices {
  memberUseDB = AppDataSource.getRepository(MemberUse);

  getOneWhere = async (
    memberId: ID_DB,
    select?: FindOneOptions<MemberUse>["select"]
  ) => {
    return this.memberUseDB.findOne({
      where: {
        memberId: memberId?.toString(),
      },
      select,
    });
  };

  upsert = async (user: UserTelegram) => {
    const userId = user?.id?.toString();
    const currentUser = await this.getOneWhere(userId);
    if (currentUser) {
      return this.memberUseDB.update(currentUser?.uuid, {
        lastName: user?.last_name,
        firstName: user?.first_name,
      });
    }
    const memberuse = new MemberUse();
    memberuse.memberId = userId;
    memberuse.firstName = user.first_name;
    memberuse.lastName = user.last_name;
    memberuse.userName = user.username;
    memberuse.isBot = checkStatusBot(user.is_bot)
    return this.memberUseDB.save(memberuse);
  };
}

export default new memberUseServices();
