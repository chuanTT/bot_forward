import { FindOneOptions } from "typeorm";
import { AppDataSource } from "../data-source";
import { Source } from "../entity/Source";
import { ID_DB } from "../types";
import groupService from "./group.service";

class sourceServices {
  sourceDB = AppDataSource.getRepository(Source);

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
