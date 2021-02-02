import { Field, InputType, ObjectType } from "type-graphql";
import { Community } from "../entities/community/community";
import { FieldError } from "./fielderror";

@ObjectType()
export class CommunityResponse {
    @Field(() => [FieldError], { nullable: true })
    errors: FieldError[];

    @Field(() => Community, { nullable: true })
    community: Community;
}

@InputType()
export class CommunityInput {
    @Field()
    name: string;
}
