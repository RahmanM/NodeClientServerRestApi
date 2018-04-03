import express from 'express';
import { Task } from './Task';
var fs = require('fs')
var bodyParser = require("body-parser");
var _ = require('lodash');

// Creates and configures an ExpressJS web server.
class TodoApp {

    // ref to Express instance
    public express: express.Application;
    public dataFile: string = "";

    //Run configuration methods on the Express instance.
    constructor() {
        this.express = express();
        this.middleware();
        this.routes();
        this.dataFile = './server/data/todos.json'
    }

    // Configure Express middleware.
    private middleware(): void {
        this.express.use(bodyParser.urlencoded({ extended: false }));
        this.express.use(bodyParser.json());
    }

    // Configure API endpoints.
    private routes = () => {

        let router = express.Router();

        // get all todos!
        router.get('/tasks', (req, res, next) => {
            fs.readFile(this.dataFile, 'utf8', function (err: any, data: string) {
                if (err) {
                    res.status(500).send(err);
                } else {
                    var tasks = JSON.parse(data);
                    res.json({ tasks: tasks });
                }
            });
        });

        // add new todo
        router.post('/tasks', (req, res, next) => {
            if(!req.body.taskTitle) {res.status(400).send("Task title is required!"); return;}
            fs.readFile(this.dataFile, 'utf8', (err: any, data: string) => {
                if (err) {
                    res.status(500).send(err);
                } else {
                    var json = JSON.parse(data);
                    var todoToAdd = req.body as Task;
                    json.tasks.push(todoToAdd);
                    fs.writeFile(this.dataFile, JSON.stringify(json));
                    res.json({ tasks: json });
                }
            });
        });

        router.delete('/tasks', (req, res, next) => {
            fs.readFile(this.dataFile, 'utf8', (err: any, data: string) => {
                if (err) {
                    res.status(500).send(err);
                } else {
                    var json = JSON.parse(data);
                    var title = req.param("taskTitle");
                    var index = this.findTaskIndex(json.tasks, title);
                    if (index > -1) {
                        json.tasks.splice(index, 1);
                        fs.writeFile(this.dataFile, JSON.stringify(json));
                        res.json({ tasks: json });
                    } else {
                        res.status(404).send("Cannot find task to delete.");
                    }
                }
            });
        });

        router.put('/tasks', (req, res, next) => {
            fs.readFile(this.dataFile, 'utf8', (err: any, data: string) => {
                if (err) {
                    res.status(500).send(err);
                } else {
                    var json = JSON.parse(data);
                    var taskToUpdate = req.body as Task;
                    var index = this.findTaskIndex(json.tasks, taskToUpdate.taskTitle);
                    if (index > -1) {
                        json.tasks.splice(index, 1);
                        json.tasks.push(taskToUpdate);
                        fs.writeFile(this.dataFile, JSON.stringify(json));
                        res.json({ tasks: json });
                    } else {
                        res.status(404).send("Cannot find task to update.");
                    }
                }
            });
        });

        this.express.use('/', router);
    }

    findTaskIndex = (tasks: Array<Task>, title: string): number => {
        return _.findIndex(tasks, (t:Task) => t.taskTitle === title);
    }
}

export default new TodoApp().express;