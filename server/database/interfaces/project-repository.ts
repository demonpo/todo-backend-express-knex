import {Project} from "../../entities"

export interface ProjectRepository {
    findById(id:string): Promise<Project | undefined>;
    findDefaultByWorkspaceId(workspaceId: string): Promise<Project | undefined>;
}