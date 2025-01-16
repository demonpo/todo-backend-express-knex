import { Application } from "express";
import {PgTaskRepository} from "../database/pg-task-repository";
import {PgProjectRepository} from "../database/pg-project-repository";
import {PgWorkspaceRepository} from "../database/pg-workspace-repository";
import {PgTaskGroupRepository} from "../database/pg-task-group-repository";
import {TaskService} from "../services/task-service";
import {TaskController} from "../controllers/task-controller";

const taskRepository = new PgTaskRepository();
const projectRepository = new PgProjectRepository();
const workspaceRepository = new PgWorkspaceRepository();
const taskGroupRepository = new PgTaskGroupRepository();
const taskService = new TaskService(taskRepository, taskGroupRepository, projectRepository, workspaceRepository);
const taskController = new TaskController(taskService);

export function setTaskRoutes(app: Application) {
  app.post("/task", (req, res) => taskController.create(req, res));
  app.get("/task", (req, res) => taskController.getAll(req, res));
}