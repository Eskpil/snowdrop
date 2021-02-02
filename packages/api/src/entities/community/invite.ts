import { Field, ID, ObjectType } from "type-graphql";
import {
    BaseEntity,
    BeforeInsert,
    Column,
    CreateDateColumn,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import { Community } from "./community";

@ObjectType()
@Entity({ name: "invites" })
export class Invite extends BaseEntity {
    @Field(() => ID!)
    @PrimaryGeneratedColumn("uuid")
    @Index()
    id: string;

    @Field(() => ID!)
    @Column()
    communityId: string;

    @Field(() => String)
    @Column({ type: "varchar", unique: true })
    code: string;

    @Field(() => Community)
    @ManyToOne(() => Community, (community) => community.invites)
    @JoinColumn({ name: "communityId" })
    community: Community;

    @Field(() => String)
    @CreateDateColumn()
    createdAt: Date;

    // @Field(() => String)
    // @Column({ type: "datetime" })
    // expiresIn: string;

    @Field(() => String)
    @CreateDateColumn()
    updatedAt: Date;
}
