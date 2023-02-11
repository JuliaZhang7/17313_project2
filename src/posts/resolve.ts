// Referenced @mthaitan TypeScript translation from P1 (PR link): https://github.com/CMU-313/NodeBB/pull/97#issue-1557234461
import db from '../database';
import plugins from '../plugins';

interface PostObject {
    resolve : (pid:number, uid:string) => Promise<{ post: PostObject; isResolved: boolean; }>;
    resolves : number;
    uid : string;
    unresolve : (pid: number, uid: string) => Promise<{ post: PostObject; isResolved: boolean; }>;
    getPostFields: (pid:number, fields:string[]) => Promise<PostObject>;
    hasResolved : (pid: number | number[], uid: string) => Promise<boolean | boolean[]>;
    setPostField : (pid:number, field:string, value:number) => Promise<void>;
}

export = function (Posts: PostObject) {
    async function toggleResolve(type:string, pid:number, uid:string) {
        if (parseInt(uid, 10) <= 0) {
            throw new Error('[[error:not-logged-in]]');
        }

        const isResolving = type === 'resolved';

        const [postData, hasResolved]:[PostObject, boolean | boolean[]] = await Promise.all([
            Posts.getPostFields(pid, ['pid', 'uid']),
            Posts.hasResolved(pid, uid),
        ]);

        if (isResolving && hasResolved) {
            throw new Error('[[error:already-mark-as-resolved]]');
        }

        if (!isResolving && !hasResolved) {
            throw new Error('[[error:already-mark-as-unresolved]]');
        }

        if (isResolving) {
            await db.sortedSetAdd(`uid:${uid}:resolved`, Date.now(), pid);
        } else {
            await db.sortedSetRemove(`uid:${uid}:resolved`, pid);
        }
        await db[isResolving ? 'setAdd' : 'setRemove'](`pid:${pid}:users_resolved`, uid);
        postData.resolves = await db.setCount(`pid:${pid}:users_resolved`) as number;
        await Posts.setPostField(pid, 'resolves', postData.resolves);

        plugins.hooks.fire(`action:post.${type}`, {
            pid: pid,
            uid: uid,
            owner: postData.uid,
            current: hasResolved ? 'resolved' : 'unresolved',
        });

        return {
            post: postData,
            isResolved: isResolving,
        };
    }

    Posts.resolve = async function (pid: number, uid: string) {
        return await toggleResolve('resolve', pid, uid);
    };

    Posts.unresolve = async function (pid: number, uid: string) {
        return await toggleResolve('unresolve', pid, uid);
    };

    Posts.hasResolved = async function (pid: number | number[], uid: string) {
        if (parseInt(uid, 10) <= 0) {
            return Array.isArray(pid) ? pid.map(() => false) : false;
        }

        if (Array.isArray(pid)) {
            const sets = pid.map(pid => `pid:${pid}:users_resolved`);
            const returnVal:boolean = await db.isMemberOfSets(sets, uid) as boolean;
            return returnVal;
        }
        const returnVal:boolean = await db.isSetMember(`pid:${pid}:users_resolved`, uid) as boolean;
        return returnVal;
    };
};
