import knex = require("./connection");
import {TaskGroup} from "../entities";
import {TaskGroupRepository} from "./interfaces/task-group-repository";

const mapDbTaskGroupToDomainTaskGroup = (dbTaskGroup: {
    id: string;
    name: string;
    order: number;
    project_id: string;
    created_at: Date;
    updated: Date;
}): TaskGroup => ({
    id: dbTaskGroup.id,
    name: dbTaskGroup.name,
    order: dbTaskGroup.order,
    projectId: dbTaskGroup.project_id,
    createdAt: dbTaskGroup.created_at,
    updatedAt: dbTaskGroup.updated
})


export class PgTaskGroupRepository implements TaskGroupRepository {
    private tableName = 'task_group';


    async findById(taskGroupId: string): Promise<TaskGroup | undefined> {
        try {
            const result = await knex(this.tableName)
                .select('*')
                .where({ id: taskGroupId })
                .first();

            if (!result) {
                return undefined;
            }

            return mapDbTaskGroupToDomainTaskGroup(result);
        } catch (error) {
            console.error('Error finding TaskGroup by ID:', error);
            throw error;
        }
    }

    async findByProjectId(projectId: string): Promise<TaskGroup[]> {
        try {
            const taskGroups = await knex(this.tableName)
                .select('*')
                .where({ project_id: projectId });

            return taskGroups.map(mapDbTaskGroupToDomainTaskGroup)
        } catch (error) {
            console.error('Error getting task groups by project ID:', error);
            throw error;
        }
    }

    async isOwnedByUser(taskGroupId: string, userId: string): Promise<boolean> {
        try {
            const isOwned = await knex(this.tableName)
                .join('project', 'task_group.project_id', 'project.id') // Join with the project table
                .join('workspace', 'project.workspace_id', 'workspace.id') // Join with the workspace table
                .join('user_workspace', 'workspace.id', 'user_workspace.workspace_id') // Join with the user_workspace table
                .where('task_group.id', taskGroupId) // Filter by taskGroupId
                .andWhere('user_workspace.user_id', userId) // Filter by userId
                .first(); // Retrieve the first matching record

            return Boolean(isOwned); // Return true if a matching record is found, false otherwise
        } catch (error) {
            console.error('Error checking task group ownership:', error);
            throw error;
        }
    }
}