import { FindManyOptions, FindOneOptions } from "typeorm";
import { AppDataSource } from "../data-source";
import { Group } from "../entity/Group";
import { ID_DB } from "../types";
import { funcTransactionsQuery } from "../helpers/transactionsQuery";
import { Target } from "../entity/Target";
import { Source } from "../entity/Source";
import { paginationFunc, TakeAndSkip } from "../helpers";

class groupServices {
  groupDB = AppDataSource.getRepository(Group);

  findAllPagination = async ({
    take,
    skip,
    ...spread
  }: TakeAndSkip & FindManyOptions<Group>) => {
    return await paginationFunc({
      skip,
      take,
      callBack: async ({ skip: skipQuery, take: takeQuery }) =>
        await this.groupDB.findAndCount({
          ...spread,
          take: takeQuery,
          skip: skipQuery,
        }),
    });
  };

  getOneWhere = async (
    groupId: ID_DB,
    select?: FindOneOptions<Group>["select"]
  ) => {
    return this.groupDB.findOne({
      where: {
        groupId: groupId?.toString(),
      },
      select,
    });
  };

  create = async (groupId: string | number, name?: string) => {
    const groupEntity = new Group();
    groupEntity.groupId = groupId?.toString();
    groupEntity.name = name;
    return this.groupDB.save(groupEntity);
  };

  delete = async (groupId: string | number) => {
    return funcTransactionsQuery({
      callBack: async (queryRunner) => {
        const queryBuilder = queryRunner.manager.createQueryBuilder();
        await queryBuilder
          .delete()
          .from(Target)
          .where("groupId = :groupId", { groupId })
          .execute();

        await queryBuilder
          .delete()
          .from(Source)
          .where("groupId = :groupId", { groupId })
          .execute();

        const groupResult = await queryBuilder
          .delete()
          .from(Group)
          .where("groupId = :groupId", { groupId })
          .execute();
        await queryRunner.commitTransaction();
      },
    });
  };
}

export default new groupServices();
