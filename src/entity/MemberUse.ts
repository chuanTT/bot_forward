import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class MemberUse {
  @PrimaryGeneratedColumn("uuid")
  uuid: string;

  @Column("varchar", { length: 80 })
  memberId: string;

  @Column("varchar", { length: 80 })
  firstName: string;

  @Column("varchar", { length: 80 })
  lastName: string;

  @Column("varchar", { length: 80 })
  userName: string;

  @Column("int", { default: 0 })
  isBot: number;
}
