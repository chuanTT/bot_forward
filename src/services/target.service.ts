import { FindOneOptions, FindOptionsSelect } from "typeorm";
import { AppDataSource } from "../data-source";
import { Source } from "../entity/Source";
import { ID_DB } from "../types";
import groupService from "./group.service";
import { funcTransactionsQuery } from "../helpers/transactionsQuery";
import { awaitAllFor } from "../helpers";

class sourceServices {
  sourceDB = AppDataSource.getRepository(Source);

  findBy = async (
    ownerId: ID_DB,
    select: FindOneOptions<Source>["select"] = ["group"]
  ) => {
    return await this.sourceDB.find({
      where: {
        ownerId: ownerId?.toString(),
      },
      select,
      relations: {
        group: true,
      },
    });
  };

  countBy = async (ownerId: ID_DB) => {
    return this.sourceDB.countBy({
      ownerId: ownerId?.toString(),
    });
  };

  getOneWhere = async (
    ownerId: ID_DB,
    select?: FindOneOptions<Source>["select"]
  ) => {
    return this.sourceDB.findOne({
      where: {
        ownerId: ownerId?.toString(),
      },
      select,
    });
  };

  create = async (ownerId: ID_DB, sourceId: ID_DB) => {
    const group = await groupService.getOneWhere(sourceId);
    if (!group) {
      return undefined;
    }
    const source = new Source();
    source.ownerId = ownerId?.toString();
    source.group = group;
    return this.sourceDB.save(source);
  };

  insert = async (
    groupIds: string[],
    sourceId: ID_DB,
    currentCount: number
  ) => {
    const groups = await groupService.finAllGroupIds(groupIds);
    if (groups?.length <= 0) return undefined;
    const newSourceId = sourceId?.toString();
    return funcTransactionsQuery({
      callBack: async (queryRunner) => {
        const results = await awaitAllFor(groups, async (group) => {
          const exitsGroup = await queryRunner.manager.findOneBy(Source, {
            group,
            ownerId: newSourceId,
          });
          console.log(exitsGroup);
          if (!exitsGroup) {
            const newSource = new Source();
            newSource.group = group;
            newSource.ownerId = newSourceId;
            return await queryRunner.manager.save(Source, newSource);
          }
        });
        console.log(results);
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
    return this.sourceDB.update(ownerId, {
      group,
    });
  };

  delete = async (sourceId: ID_DB) => {
    return this.sourceDB.delete(sourceId);
  };
}

export default new sourceServices();
