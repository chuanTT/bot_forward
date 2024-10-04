import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Group } from "./Group";
import { SourceTargetType } from "../types";

@Entity()
export class SourceTarget {
  @PrimaryGeneratedColumn("uuid")
  uuid: string;

  @Column("varchar", { length: 80, nullable: true })
  ownerId: string;

  @ManyToOne(() => Group, (group) => group.sourceTarget)
  @JoinColumn({ name: "groupId", referencedColumnName: "groupId" })
  group: Group;

  @Column("simple-enum", {
    default: SourceTargetType.SOURCE,
    enum: SourceTargetType,
  })
  type: SourceTargetType;
}
