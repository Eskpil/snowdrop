import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { Field, ID, ObjectType } from "type-graphql";
import { Community } from "./community";
import { Channel } from "./channel";

@ObjectType()
@Entity({ name: "categories" })
export class Category extends BaseEntity {
    @Field(() => ID!)
    @PrimaryGeneratedColumn("uuid")
    @Index()
    id: string;

    @Field()
    @Column({ type: "varchar" })
    name: string;

    @Field(() => [Channel])
    @OneToMany(() => Channel, (channel) => channel.category)
    channels: Channel[];

    @Field(() => ID!)
    @Column()
    communityId: string;

    @Field(() => Community)
    @ManyToOne(() => Community, (community) => community.categories)
    @JoinColumn({ name: "communityId" })
    community: Community;

    @Field(() => String)
    @CreateDateColumn()
    createdAt: Date;

    @Field(() => String)
    @UpdateDateColumn()
    updatedAt: Date;
}
