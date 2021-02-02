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
import { Category } from "./category";
import { Invite } from "./invite";
import { Member } from "./member";

@ObjectType()
@Entity({ name: "communities" })
export class Community extends BaseEntity {
    @Field(() => ID!)
    @PrimaryGeneratedColumn("uuid")
    @Index()
    id: string;

    @Column()
    ownerId: string;

    @Field()
    @Column({ type: "varchar" })
    name: string;

    @Field(() => [Member])
    @OneToMany(() => Member, (member) => member.community)
    members: Member[];

    @Field(() => [Invite])
    @OneToMany(() => Invite, (invite) => invite.community)
    invites: Invite[];

    @Field(() => [Category])
    @OneToMany(() => Category, (category) => category.community)
    categories: Category[];

    @Field(() => String)
    @CreateDateColumn()
    createdAt: Date;

    @Field(() => String)
    @UpdateDateColumn()
    updatedAt: Date;
}
