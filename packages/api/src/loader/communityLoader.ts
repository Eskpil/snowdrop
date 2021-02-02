import DataLoader from "dataloader";
import { Community } from "../entities/community/community";

export const CommunityLoader = () =>
    new DataLoader<string, Community>(async (communityIds) => {
        const communities = await Community.findByIds(communityIds as string[]);
        const communityIdToCommunity: Record<string, Community> = {};
        communities.forEach((c) => {
            communityIdToCommunity[c.id] = c;
        });

        const sortedCommunities = communityIds.map(
            (communityId) => communityIdToCommunity[communityId]
        );

        return sortedCommunities;
    });
