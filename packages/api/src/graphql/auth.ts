import { Field, InputType, ObjectType } from "type-graphql";
import { User } from "../entities/user";
import { FieldError } from "./fielderror";

@ObjectType()
export class AuthResponse {
    @Field(() => [FieldError], { nullable: true })
    errors: FieldError[];

    @Field(() => User, { nullable: true })
    user: User;

    @Field({ nullable: true })
    accessToken: string;
}

@InputType()
export class AuthInput {
    @Field({ nullable: true })
    email: string;

    @Field({ nullable: true })
    username: string;

    @Field()
    password: string;
}
