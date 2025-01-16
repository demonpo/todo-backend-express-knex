import {Workspace} from "../../entities";

export interface WorkspaceRepository {
    findById(id:string): Promise<Workspace | undefined>;
}