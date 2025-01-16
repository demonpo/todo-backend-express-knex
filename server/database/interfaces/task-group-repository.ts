import {TaskGroup} from "../../entities";

export interface TaskGroupRepository {
    findById(id:string): Promise<TaskGroup | undefined>;
    isOwnedByUser(taskGroupId: string, userId: string): Promise<boolean>;
    findByProjectId(projectId: string): Promise<TaskGroup[]>;
}