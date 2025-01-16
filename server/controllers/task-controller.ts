import {Request, Response} from "express";
import {TaskService} from "../services/task-service";
import {z} from "zod";
import {TaskPriority} from "../entities";

export class TaskController {
    private taskService: TaskService;
    constructor(taskService: TaskService) {
        this.taskService = taskService;
    }
    async getAll(req: Request, res: Response) {
        try {
            const tasks = [];
            res.json(tasks);
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    }
    async create(req: Request, res: Response) {
        const taskSchema = z.object({
            name: z.string(),
            description: z.string().optional(),
            priority: z.nativeEnum(TaskPriority).optional(),
            dueDate: z.preprocess((value) => (value ? new Date(value as string) : undefined), z.date().optional()),
            taskGroupId: z.string().optional(),
            projectId: z.string().optional(),
            workspaceId: z.string(),
            assigneeId: z.string().optional(),
        });
        try {
            const data = taskSchema.parse(req.body);
            const task =  await this.taskService.create({ task: data, userId: "1" });
            res.json({
                data: task
            });

        } catch (error) {
            if (error instanceof z.ZodError) {
                res.status(400).json({
                    message: "Validation Error",
                    errors: error.errors,
                });
            } else {
                console.error("Unexpected error:", error);
                res.status(500).json({
                    message: error.message,
                });
            }
        }
    }
}