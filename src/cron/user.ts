import { FriendItem } from "../gocq/action";
import { User } from "../model/user";
import { warn } from "../util";

export function syncUsers(friends: FriendItem[]): void {
    for (let index = 0; index < friends.length; index++) {
        const friend = friends[index];
        const user = new User();
        user.userId = friend.user_id.toString();
        user.nickname = friend.nickname;
        user.remark = friend.remark;
        user.upsertWithoutPassword().catch(e=>{
            warn(e, 'sync user failed');
        })
    }
}
