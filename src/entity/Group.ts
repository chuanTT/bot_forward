import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { SourceTarget } from "./SourceTarget";

@Entity()
export class Group {
  @PrimaryGeneratedColumn("uuid")
  uuid: string;

  @Column("varchar", { unique: true })
  groupId: string;

  @Column("varchar", { default: null, nullable: true })
  name: string;

  @OneToMany(type => SourceTarget, sourceTarget => sourceTarget.group)
  sourceTarget: SourceTarget[];

}
