import knex = require("./connection");
import {CreateTaskInput, TaskRepository} from "./interfaces/task-repository";
import {v4 as uuid} from 'uuid';
import * as console from "node:console";
import {Task, TaskPriority} from "../entities";

const mapDbTaskToDomainTask = (dbTask: {
    id: string;
    name: string;
    description: string;
    priority: string | null;
    due_date: Date;
    project_id: string;
    workspace_id: string;
    assignee_id: string;
    task_group_id: string;
    created_at: Date;
    updated_at: Date;
}): Task => ({
    id: dbTask.id,
    name: dbTask.name,
    description: dbTask.description,
    priority: dbTask.priority as TaskPriority | null,
    dueDate: dbTask.due_date,
    projectId: dbTask.project_id,
    workspaceId: dbTask.workspace_id,
    assigneeId: dbTask.assignee_id,
    taskGroupId: dbTask.task_group_id,
    createdAt: dbTask.created_at,
    updatedAt: dbTask.updated_at,
});


export class PgTaskRepository implements TaskRepository {
    private tableName = 'task';
    async create(task: CreateTaskInput): Promise<Task | undefined> {
        try {
            const results = await knex(this.tableName).insert({
                id: uuid(),
                name: task.name,
                description: task.description || null,
                priority: task.priority || null,
                due_date: task.dueDate || null,
                project_id: task.projectId || null,
                workspace_id: task.workspaceId,
                assignee_id: task.assigneeId || null,
                task_group_id: task.taskGroupId || null,
            }).returning('*');
            const result = results[0];
            return mapDbTaskToDomainTask(result);
        } catch (error) {
            console.error('Error creating task:', error);
            throw error;
        }
    }

    async findById(taskId): Promise<Task | undefined> {
        try {
            const result = await knex(this.tableName)
                .select('*')
                .where({ id: taskId })
                .first();

            if (!result) {
               return undefined;
            }

            return mapDbTaskToDomainTask(result);
        } catch (error) {
            console.error('Error finding task by ID:', error);
            throw error;
        }
    }

    getAll(): Promise<Task[]> {
        return Promise.resolve([]);
    }
}