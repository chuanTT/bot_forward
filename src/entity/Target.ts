import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Group } from "./Group";

@Entity()
export class Target {
  @PrimaryGeneratedColumn("uuid")
  uuid: string;

  @Column("varchar", { length: 80 })
  ownerId: string;

  @ManyToOne(() => Group, group => group.targets)
  @JoinColumn({ name: 'groupId', referencedColumnName: 'groupId' })
  group: Group;
}
