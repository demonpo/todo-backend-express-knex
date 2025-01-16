import {Task, TaskPriority} from "../../entities";

export type CreateTaskInput = {
    name: string;
    description?: string;
    priority?: TaskPriority;
    dueDate?: Date;
    taskGroupId?: string;
    projectId?: string;
    workspaceId: string;
    assigneeId?: string;
}

export interface TaskRepository {
    findById(id: string): Promise<Task | undefined>;
    getAll(): Promise<Task[]>;
    create(input: CreateTaskInput): Promise<Task>;
}