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
import { Category } from "./category";

@ObjectType()
@Entity()
export class Channel extends BaseEntity {
    @Field(() => ID!)
    @PrimaryGeneratedColumn("uuid")
    @Index()
    id: string;

    @Field()
    @Column({ type: "varchar" })
    name: string;

    @Field()
    @Column()
    categoryId: string;

    @Field(() => Category)
    @ManyToOne(() => Category, (category) => category.channels)
    @JoinColumn({ name: "categoryId" })
    category: Category;

    @Field(() => String)
    @CreateDateColumn()
    createdAt: Date;

    @Field(() => String)
    @UpdateDateColumn()
    updatedAt: Date;
}
