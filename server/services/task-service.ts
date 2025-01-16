import {TaskRepository} from "../database/interfaces/task-repository";
import {Task, TaskGroup, TaskPriority} from "../entities";
import {TaskGroupRepository} from "../database/interfaces/task-group-repository";
import {ProjectRepository} from "../database/interfaces/project-repository";
import {WorkspaceRepository} from "../database/interfaces/workspace-repository";


export type TaskInput = {
    name: string;
    description?: string;
    priority?: TaskPriority;
    dueDate?: Date;
    taskGroupId?: string;
    projectId?: string;
    workspaceId: string;
    assigneeId?: string;
}

export type CreateTaskInput = {
    task: TaskInput;
    userId: string;
};

export class TaskService {

    taskRepository: TaskRepository;
    taskGroupRepository: TaskGroupRepository;
    projectRepository: ProjectRepository;
    workspaceRepository: WorkspaceRepository;

    constructor(
        taskRepository: TaskRepository,
        taskGroupRepository: TaskGroupRepository,
        projectRepository: ProjectRepository,
        workspaceRepository: WorkspaceRepository
    ) {
        this.taskRepository = taskRepository;
        this.taskGroupRepository = taskGroupRepository;
        this.projectRepository = projectRepository;
        this.workspaceRepository = workspaceRepository;
    }

    // async create(input: CreateTaskInput): Promise<Task> {
    //     if (input.task.taskGroupId) {
    //         const taskGroup = this.taskGroupRepository.findById(input.task.taskGroupId);
    //         if (!taskGroup) {
    //             throw new Error('Task group not found');
    //         }
    //         const isOwnedByUser = this.taskGroupRepository.isOwnedByUser(input.task.taskGroupId, input.userId);
    //         if (!isOwnedByUser) {
    //             throw new Error('Task group not owned by user');
    //         }
    //         const task = this.taskRepository.create({
    //             ...input.task,
    //             projectId: input.task.projectId,
    //             workspaceId: input.task.workspaceId,
    //             assigneeId: input.task.assigneeId
    //         });
    //         return task;
    //     }
    //     if (input.task.projectId) {
    //         const project = this.projectRepository.findById(input.task.projectId);
    //         if (!project) {
    //             throw new Error('Project not found');
    //         }
    //         const taskGroup: TaskGroup[] = this.taskGroupRepository.findByProjectId(input.task.projectId);
    //         if (taskGroup.length === 0) {
    //             throw new Error('Task group not found');
    //         }
    //         const isOwnedByUser = this.taskGroupRepository.isOwnedByUser(taskGroup[0].id, input.userId);
    //         if (!isOwnedByUser) {
    //             throw new Error('Task group not owned by user');
    //         }
    //         const task = this.taskRepository.create({
    //             ...input.task,
    //             taskGroupId: taskGroup[0].id,
    //             workspaceId: input.task.workspaceId,
    //             assigneeId: input.task.assigneeId
    //         });
    //         return task;
    //     }
    //     const workspace = this.workspaceRepository.findById(input.task.workspaceId);
    //     if (!workspace) {
    //         throw new Error('Workspace not found');
    //     }
    //     const defaultProject = this.projectRepository.findDefaultByWorkspaceId(input.task.workspaceId);
    //     if (!defaultProject) {
    //         throw new Error('Default project not found');
    //     }
    //     const taskGroup: TaskGroup[] = this.taskGroupRepository.findByProjectId(defaultProject.id);
    //     if (taskGroup.length === 0) {
    //         throw new Error('Task group not found');
    //     }
    //     taskGroup.sort((a, b) => b.order - a.order);
    //     const isOwnedByUser = this.taskGroupRepository.isOwnedByUser(taskGroup[0].id, input.userId);
    //     if (!isOwnedByUser) {
    //         throw new Error('Task group not owned by user');
    //     }
    //     const task = this.taskRepository.create({
    //         ...input.task,
    //         taskGroupId: taskGroup[0].id,
    //         projectId: defaultProject.id,
    //         workspaceId: input.task.workspaceId,
    //         assigneeId: input.task.assigneeId
    //     });
    //     return task;
    // }


    async create(input: CreateTaskInput): Promise<Task> {
        const { task, userId } = input;

        if (task.taskGroupId) {
            return this.createTaskInGroup(task, userId);
        }

        if (task.projectId) {
            return this.createTaskInProject(task, userId);
        }

        return this.createTaskInDefaultProject(task, userId);
    }

    private async createTaskInGroup(task: TaskInput, userId: string): Promise<Task> {
        const taskGroup = await this.taskGroupRepository.findById(task.taskGroupId);
        if (!taskGroup) {
            throw new Error('Task group not found');
        }
        const isOwnedByUser = this.taskGroupRepository.isOwnedByUser(task.taskGroupId, userId);
        if (!isOwnedByUser) {
            throw new Error('Task group not owned by user');
        }
        return this.taskRepository.create({
            ...task,
            projectId: taskGroup.projectId,
            taskGroupId: taskGroup.id,
            workspaceId: task.workspaceId,
        });
    }

    private async createTaskInProject(task: TaskInput, userId: string): Promise<Task> {
        const project = await this.projectRepository.findById(task.projectId);
        if (!project) {
            throw new Error('Project not found');
        }

        const taskGroups = await this.taskGroupRepository.findByProjectId(task.projectId);
        if (taskGroups.length === 0) {
            throw new Error('Task group not found');
        }

        const isOwnedByUser = await this.taskGroupRepository.isOwnedByUser(taskGroups[0].id, userId);

        if (!isOwnedByUser) {
            throw new Error('Task group not owned by user');
        }

        return this.taskRepository.create({
            ...task,
            taskGroupId: taskGroups[0].id,
            projectId: project.id,
            workspaceId: task.workspaceId,
        });
    }

    private async createTaskInDefaultProject(task: TaskInput, userId: string): Promise<Task> {
        const workspace = await this.workspaceRepository.findById(task.workspaceId);
        if (!workspace) {
            throw new Error('Workspace not found');
        }

        const defaultProject = await this.projectRepository.findDefaultByWorkspaceId(task.workspaceId);
        if (!defaultProject) {
            throw new Error('Default project not found');
        }

        const taskGroups = await this.taskGroupRepository.findByProjectId(defaultProject.id);
        if (taskGroups.length === 0) {
            throw new Error('Task group not found');
        }

        taskGroups.sort((a, b) => b.order - a.order);

        const isOwnedByUser = await this.taskGroupRepository.isOwnedByUser(taskGroups[0].id, userId);
        if (!isOwnedByUser) {
            throw new Error('Task group not owned by user');
        }

        return this.taskRepository.create({
            ...task,
            taskGroupId: taskGroups[0].id,
            projectId: defaultProject.id,
            workspaceId: task.workspaceId,
        });
    }

}