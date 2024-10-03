import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Group } from "./Group";

@Entity()
export class Source {
  @PrimaryGeneratedColumn("uuid")
  uuid: string;

  @Column("varchar", { length: 80, nullable: true })
  ownerId: string;

  @ManyToOne(() => Group, group => group.sources)
  @JoinColumn({ name: 'groupId', referencedColumnName: 'groupId' })
  group: Group;
}
