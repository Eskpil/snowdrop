import { Field, ID, ObjectType } from "type-graphql";
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "../user";
import { Community } from "./community";
import { Message } from "./message";

@ObjectType()
@Entity({ name: "members" })
export class Member extends BaseEntity {
    @Field(() => ID!)
    @PrimaryGeneratedColumn("uuid")
    @Index()
    id: string;

    @Field(() => ID!)
    @Column()
    communityId: string;

    @Field(() => Community)
    @ManyToOne(() => Community, (community) => community.members)
    @JoinColumn({ name: "communityId" })
    community: Community;

    @Field(() => ID!)
    @Column()
    userId: string;

    @Field(() => User)
    @ManyToOne(() => User, (user) => user.communities)
    @JoinColumn({ name: "userId" })
    user: User;

    @Field()
    @Column({ type: "boolean", default: false })
    admin: boolean;

    @Field(() => [Message])
    @OneToOne(() => Message, (message) => message.member)
    messages: Message[];

    @Field(() => String)
    @CreateDateColumn()
    createdAt: Date;

    @Field(() => String)
    @CreateDateColumn()
    updatedAt: Date;
}
