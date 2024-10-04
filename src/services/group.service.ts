import { FindManyOptions, FindOneOptions, In } from "typeorm";
import { AppDataSource } from "../data-source";
import { Group } from "../entity/Group";
import { ID_DB } from "../types";
import { funcTransactionsQuery } from "../helpers/transactionsQuery";
import { SourceTarget } from "../entity/SourceTarget";
import { paginationFunc, TakeAndSkip } from "../helpers";

class groupServices {
  groupDB = AppDataSource.getRepository(Group);
  finAllGroupIds = async (groupId: string[]) => {
    return this.groupDB.findBy({
      groupId: In(groupId),
    });
  };

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

  create = async (groupId: ID_DB, name?: string) => {
    const groupEntity = new Group();
    groupEntity.groupId = groupId?.toString();
    groupEntity.name = name;
    return this.groupDB.save(groupEntity);
  };

  update = async (groupId: ID_DB, name?: string, newGroupId?: ID_DB) => {
    const currentUser = await this.getOneWhere(groupId);
    if (!currentUser) return null;
    return this.groupDB.update(currentUser?.uuid, {
      name,
      groupId: (newGroupId || groupId)?.toString()
    });
  };

  delete = async (groupId: ID_DB) => {
    return funcTransactionsQuery({
      callBack: async (queryRunner) => {
        const queryBuilder = queryRunner.manager.createQueryBuilder();

        await queryBuilder
          .delete()
          .from(SourceTarget)
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
