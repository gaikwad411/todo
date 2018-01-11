var mongoose = require('mongoose');

// Task schema
var taskSchema = new mongoose.Schema({title: 'string', createDateTimeTS: 'number', priority: 'number'});

// Task model
var taskModel = mongoose.model('Task', taskSchema);

exports.taskModel = taskModel;