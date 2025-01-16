import knex = require("./connection");
import {Task, TaskPriority, Workspace} from "../entities";
import {WorkspaceRepository} from "./interfaces/workspace-repository";

const mapDbWorkspaceToDomainWorkspace = (dbWorkspace: {
    id: string;
    name: string;
    description: string;
    created_at: Date;
    updated_at: Date;
}): Workspace => ({
    id: dbWorkspace.id,
    name: dbWorkspace.name,
    description: dbWorkspace.description,
    createdAt: dbWorkspace.created_at,
    updatedAt: dbWorkspace.updated_at,
});


export class PgWorkspaceRepository implements WorkspaceRepository {
    private tableName = 'workspace';

    async findById(workspaceId:string): Promise<Workspace | undefined> {
        try {
            const result = await knex(this.tableName)
                .select('*')
                .where({ id: workspaceId })
                .first();

            if (!result) {
               return undefined;
            }

            return mapDbWorkspaceToDomainWorkspace(result);
        } catch (error) {
            console.error('Error finding task by ID:', error);
            throw error;
        }
    }

    getAll(): Promise<Task[]> {
        return Promise.resolve([]);
    }
}