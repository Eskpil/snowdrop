import { Field, ID, ObjectType } from "type-graphql";
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    Index,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { Member } from "./community/member";
import { Message } from "./community/message";

@ObjectType()
@Entity({ name: "users" })
export class User extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn("uuid")
    @Index()
    id: string;

    @Field(() => String)
    @Column({ type: "varchar", unique: true })
    email: string;

    @Field(() => String)
    @Column({ type: "varchar" })
    username: string;

    @Column({ type: "varchar" })
    password: string;

    @Field(() => [Member])
    @OneToMany(() => Member, (member) => member.user)
    communities: Member[];

    @Field(() => [Message])
    @OneToMany(() => Message, (message) => message.author)
    messages: Message[];

    @Field(() => String)
    @CreateDateColumn()
    createdAt: Date;

    @Field(() => String)
    @UpdateDateColumn()
    updatedAt: Date;

    // Typeorm only

    @Column("int", { default: 0 })
    tokenVersion: number;
}
