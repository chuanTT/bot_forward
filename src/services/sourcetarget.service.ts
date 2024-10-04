import { FindOneOptions } from "typeorm";
import { AppDataSource } from "../data-source";
import { SourceTarget } from "../entity/SourceTarget";
import { ID_DB, SourceTargetType } from "../types";
import groupService from "./group.service";
import { funcTransactionsQuery } from "../helpers/transactionsQuery";
import { awaitAllFor } from "../helpers";
import { MAX_TAKE } from "../configs";

class sourceServices {
  sourceTargetDB = AppDataSource.getRepository(SourceTarget);

  findBy = async (
    ownerId: ID_DB,
    type: SourceTargetType = SourceTargetType.SOURCE,
    select: FindOneOptions<SourceTarget>["select"] = ["group"]
  ) => {
    return await this.sourceTargetDB.find({
      where: {
        ownerId: ownerId?.toString(),
        type,
      },
      select,
      relations: {
        group: true,
      },
    });
  };

  countBy = async (
    ownerId: ID_DB,
    type: SourceTargetType = SourceTargetType.SOURCE
  ) => {
    return this.sourceTargetDB.countBy({
      ownerId: ownerId?.toString(),
      type,
    });
  };

  create = async (
    ownerId: ID_DB,
    sourceId: ID_DB,
    type: SourceTargetType = SourceTargetType.SOURCE
  ) => {
    const group = await groupService.getOneWhere(sourceId);
    if (!group) {
      return undefined;
    }
    const source = new SourceTarget();
    source.ownerId = ownerId?.toString();
    source.group = group;
    source.type = type;
    return this.sourceTargetDB.save(source);
  };

  insert = async (
    groupIds: string[],
    sourceId: ID_DB,
    type: SourceTargetType = SourceTargetType.SOURCE,
    currentCount: number
  ) => {
    const groups = await groupService.finAllGroupIds(groupIds);
    if (groups?.length <= 0) return undefined;
    const newSourceId = sourceId?.toString();
    return funcTransactionsQuery({
      callBack: async (queryRunner) => {
        const results = await awaitAllFor(groups, async (group) => {
          const exitsGroup = await queryRunner.manager.findOneBy(SourceTarget, {
            group,
            ownerId: newSourceId,
            type,
          });
          if (!exitsGroup && currentCount <= MAX_TAKE) {
            const newSource = new SourceTarget();
            newSource.group = group;
            newSource.ownerId = newSourceId;
            newSource.type = type;
            const result = await queryRunner.manager.save(
              SourceTarget,
              newSource
            );
            currentCount++;
            return result;
          }
        });

        await queryRunner.commitTransaction();
        return results;
      },
    });
  };

  update = async (ownerId: ID_DB, sourceId: ID_DB) => {
    const group = await groupService.getOneWhere(sourceId);
    if (!group) {
      return undefined;
    }
    return this.sourceTargetDB.update(ownerId, {
      group,
    });
  };

  clearAll = async (ownerId: ID_DB, type = SourceTargetType.SOURCE) => {
    return funcTransactionsQuery({
      callBack: async (queryRunner) => {
        const queryBuilder = queryRunner.manager.createQueryBuilder();
        const results = await queryBuilder
          .delete()
          .from(SourceTarget)
          .where("ownerId = :ownerId", {
            ownerId: ownerId?.toString(),
          })
          .andWhere("type = :type", {
            type,
          })
          .execute();
        await queryRunner.commitTransaction();
        return results;
      },
    });
  };

  clearOne = async (
    ownerId: ID_DB,
    sourceId: ID_DB,
    type = SourceTargetType.SOURCE
  ) => {
    const data = await this.sourceTargetDB.findOne({
      where: {
        ownerId: ownerId?.toString(),
        group: {
          groupId: sourceId?.toString(),
          
        },
        type,
      },
    });
    if(!data) return null
    return this.sourceTargetDB.delete(data)
  };

  delete = async (sourceId: ID_DB) => {
    return this.sourceTargetDB.delete(sourceId);
  };
}

export default new sourceServices();
