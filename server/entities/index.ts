export interface Workspace {
    id: string;
    name: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface User {
    id: string;
    name: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface UserWorkspace {
    id: string;
    workspaceId: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Project {
    id: string;
    name: string;
    description?: string;
    startedAt?: Date;
    targetDate?: Date;
    finishedAt?: Date;
    workspaceId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface TaskGroup {
    id: string;
    order: number;
    name: string;
    projectId: string;
    createdAt: Date;
    updatedAt: Date;
}

export enum TaskPriority {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
}

export interface Task {
    id: string;
    name: string;
    description?: string;
    priority?: TaskPriority;
    dueDate?: Date;
    projectId?: string;
    workspaceId?: string;
    assigneeId?: string;
    taskGroupId?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Comment {
    id: string;
    text: string;
    taskId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Tag {
    id: string;
    name: string;
    workspaceId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface TaskTag {
    id: string;
    taskId: string;
    tagId: string;
    createdAt: Date;
}
