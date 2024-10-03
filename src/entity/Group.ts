import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Source } from "./Source";
import { Target } from "./Target";

@Entity()
export class Group {
  @PrimaryGeneratedColumn("uuid")
  uuid: string;

  @Column("varchar", { unique: true })
  groupId: string;

  @Column("varchar", { default: null, nullable: true })
  name: string;

  @OneToMany(type => Source, source => source.group)
  sources: Source[];

  @OneToMany(type => Target, target => target.group)
  targets: Target[];
}
