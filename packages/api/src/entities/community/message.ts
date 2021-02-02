import { Field, ID, ObjectType } from "type-graphql";
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { User } from "../user";
import { Member } from "./member";

@ObjectType()
@Entity({ name: "messages" })
export class Message extends BaseEntity {
    @Field(() => ID!)
    @PrimaryGeneratedColumn("uuid")
    @Index()
    id: string;

    @Field()
    @Column({ type: "text" })
    content: string;

    @Field(() => ID!)
    @Column()
    memberId: string;

    @Field(() => Member)
    @ManyToOne(() => Member, (member) => member.messages)
    @JoinColumn({ name: "memberId" })
    member: Member;

    @Field(() => ID!)
    @Column()
    authorId: string;

    @Field(() => User)
    @ManyToOne(() => User, (user) => user.messages)
    @JoinColumn({ name: "authorId" })
    author: User;

    @Field(() => String)
    @CreateDateColumn()
    createdAt: Date;

    @Field(() => String)
    @UpdateDateColumn()
    updatedAt: Date;
}
