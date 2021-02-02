import { Field, InputType, ObjectType } from "type-graphql";
import { Invite } from "../entities/community/invite";
import { FieldError } from "./fielderror";

@ObjectType()
export class InviteResponse {
    @Field(() => [FieldError], { nullable: true })
    errors: FieldError[];

    @Field(() => Invite, { nullable: true })
    invite: Invite;
}

@InputType()
export class InviteInput {
    @Field()
    community: string;
}
