var mongoose = require('mongoose');

// Task schema
var taskSchema = new mongoose.Schema({title: 'string', dateTS: 'number'});

// Task model
var taskModel = mongoose.model('Task', taskSchema);

exports.taskModel = taskModel;