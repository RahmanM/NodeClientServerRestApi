"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var fs = require('fs');
var bodyParser = require("body-parser");
var _ = require('lodash');
// Creates and configures an ExpressJS web server.
var TodoApp = /** @class */ (function () {
    //Run configuration methods on the Express instance.
    function TodoApp() {
        var _this = this;
        this.dataFile = "";
        // Configure API endpoints.
        this.routes = function () {
            var router = express_1.default.Router();
            // get all todos!
            router.get('/tasks', function (req, res, next) {
                fs.readFile(_this.dataFile, 'utf8', function (err, data) {
                    if (err) {
                        res.status(500).send(err);
                    }
                    else {
                        var tasks = JSON.parse(data);
                        res.json({ tasks: tasks });
                    }
                });
            });
            // add new todo
            router.post('/tasks', function (req, res, next) {
                if (!req.body.taskTitle) {
                    res.status(400).send("Task title is required!");
                    return;
                }
                fs.readFile(_this.dataFile, 'utf8', function (err, data) {
                    if (err) {
                        res.status(500).send(err);
                    }
                    else {
                        var json = JSON.parse(data);
                        var todoToAdd = req.body;
                        json.tasks.push(todoToAdd);
                        fs.writeFile(_this.dataFile, JSON.stringify(json));
                        res.json({ tasks: json });
                    }
                });
            });
            router.delete('/tasks', function (req, res, next) {
                fs.readFile(_this.dataFile, 'utf8', function (err, data) {
                    if (err) {
                        res.status(500).send(err);
                    }
                    else {
                        var json = JSON.parse(data);
                        var title = req.param("taskTitle");
                        var index = _this.findTaskIndex(json.tasks, title);
                        if (index > -1) {
                            json.tasks.splice(index, 1);
                            fs.writeFile(_this.dataFile, JSON.stringify(json));
                            res.json({ tasks: json });
                        }
                        else {
                            res.status(404).send("Cannot find task to delete.");
                        }
                    }
                });
            });
            router.put('/tasks', function (req, res, next) {
                fs.readFile(_this.dataFile, 'utf8', function (err, data) {
                    if (err) {
                        res.status(500).send(err);
                    }
                    else {
                        var json = JSON.parse(data);
                        var taskToUpdate = req.body;
                        var index = _this.findTaskIndex(json.tasks, taskToUpdate.taskTitle);
                        if (index > -1) {
                            json.tasks.splice(index, 1);
                            json.tasks.push(taskToUpdate);
                            fs.writeFile(_this.dataFile, JSON.stringify(json));
                            res.json({ tasks: json });
                        }
                        else {
                            res.status(404).send("Cannot find task to update.");
                        }
                    }
                });
            });
            _this.express.use('/', router);
        };
        this.findTaskIndex = function (tasks, title) {
            return _.findIndex(tasks, function (t) { return t.taskTitle === title; });
        };
        this.express = express_1.default();
        this.middleware();
        this.routes();
        this.dataFile = './server/data/todos.json';
    }
    // Configure Express middleware.
    TodoApp.prototype.middleware = function () {
        this.express.use(bodyParser.urlencoded({ extended: false }));
        this.express.use(bodyParser.json());
    };
    return TodoApp;
}());
exports.default = new TodoApp().express;
