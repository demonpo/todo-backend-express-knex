import knex = require("./connection");
import {Project} from "../entities";
import {ProjectRepository} from "./interfaces/project-repository";
import * as console from "node:console";

const mapDbProjectToDomainProject = (dbProject: {
    id: string;
    name: string;
    description: string;
    workspace_id: string;
    created_at: Date;
    updated_at: Date;
}): Project => ({
    id: dbProject.id,
    name: dbProject.name,
    description: dbProject.description,
    workspaceId: dbProject.workspace_id,
    createdAt: dbProject.created_at,
    updatedAt: dbProject.updated_at
});


export class PgProjectRepository implements ProjectRepository {
    private tableName = 'project';

    async findById(projectId: string): Promise<Project | undefined> {
        try {
            const result = await knex(this.tableName)
                .select('*')
                .where({ id: projectId })
                .first();

            if (!result) {
               return undefined;
            }

            return mapDbProjectToDomainProject(result);
        } catch (error) {
            console.error('Error finding task by ID:', error);
            throw error;
        }
    }

    async findDefaultByWorkspaceId(workspaceId): Promise<Project | undefined> {
        try {
            const defaultProject = await knex(this.tableName)
                .select('*')
                .where({ workspace_id: workspaceId, name: "default" })
                .first();

            if (!defaultProject) {
                return undefined;
            }

            return mapDbProjectToDomainProject(defaultProject);
        } catch (error) {
            console.error('Error finding default project by workspace ID:', error);
            throw error;
        }
    }
}