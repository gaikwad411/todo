  const express = require('express')
const app = express()
const path = require('path');
var taskModel = require('./models').taskModel;
var moment = require('moment');

//Import the mongoose module
var mongoose = require('mongoose');

//Set up default mongoose connection
var mongoDB = 'mongodb://127.0.0.1/todo';
mongoose.connect(mongoDB, {
  useMongoClient: true
});
// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;
//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'views', 'index.html')));

app.get('/style.css', (req, res) => res.sendFile(path.join(__dirname, 'css',  'style.css')));
app.get('/jquery-ui.min.css', (req, res) => res.sendFile(path.join(__dirname, 'node_modules', 'jquery-ui-dist', 'jquery-ui.min.css')));
app.get('/jquery-ui.theme.min.css', (req, res) => res.sendFile(path.join(__dirname, 'node_modules', 'jquery-ui-dist', 'jquery-ui.theme.min.css')));
app.get('/bootstrap.min.css', (req, res) => res.sendFile(path.join(__dirname, 'node_modules', 'bootstrap', 'dist', 'css', 'bootstrap.min.css')));
app.get('/bootstrap-theme.min.css', (req, res) => res.sendFile(path.join(__dirname, 'node_modules', 'bootstrap', 'dist', 'css', 'bootstrap-theme.min.css')));
app.get('/bootstrap.min.js', (req, res) => res.sendFile(path.join(__dirname, 'node_modules', 'bootstrap', 'dist', 'js', 'bootstrap.min.js')));






app.get('/app.js', (req, res) => res.sendFile(path.join(__dirname, 'js', 'app.js')));


app.get('/jquery.js', (req, res) => res.sendFile(path.join(__dirname, 'node_modules', 'jquery', 'dist', 'jquery.min.js')));
app.get('/moment.js', (req, res) => res.sendFile(path.join(__dirname, 'node_modules', 'moment', 'moment.js')));
app.get('/jquery-ui.min.js', (req, res) => res.sendFile(path.join(__dirname, 'node_modules', 'jquery-ui-dist', 'jquery-ui.min.js')));


var handleError = function(err){
  console.log('Error:', err);
}

// get tasks
app.get('/api/tasks', (req, res) => {
  // Find tasks
  var query = taskModel.find({});
  query.select('id title createDateTimeTS priority');
  query.sort({priority: 1});

  query.exec(function (err, tasks) {
    if (err){
      res.status(500).send([]);
      return handleError(err);
    } 
    res.send(tasks);
  });
});


// post task create task
app.post('/api/tasks', (req, res) => {

  var jsonString = '';

  req.on('data', function (data) {
      jsonString += data;
  });

  req.on('end', function () {
    var postedData = JSON.parse(jsonString);

    // Find the priority
    var query = taskModel.findOne({});
    query.select('priority title');
    query.sort({ priority: -1 });

    // execute the query at a later time
    query.exec(function (err, highestPriorityRec) {
      if (err) return handleError(err);
      console.log('====>', highestPriorityRec);
        var priorityToSet = 1;
        if(highestPriorityRec && highestPriorityRec.priority){
          priorityToSet = highestPriorityRec.priority + 1
        }

        // create task instance
        var task_instance = new taskModel({ title: postedData.taskText, createDateTimeTS: postedData.createDateTimeTS, 
          priority: priorityToSet});

        // Save the new model instance, passing a callback
        task_instance.save(function (err) {
          if (err){
             res.status(500).send({});
             return handleError(err)
          };
          res.status(201).send(task_instance);  
        });

    });


    
  });

});


// put task update task
app.put('/api/tasks', (req, res) => {
  
  var jsonString = '';

  req.on('data', function (data) {
      jsonString += data;
  });

  req.on('end', function () {
    var postedData = JSON.parse(jsonString);
    
    // Find task
    taskModel.findOne({'_id': postedData.id}, '_id title', {}, function(err, task){
      if (err){
         // Could not get the task
         res.status(500).send({});
         return handleError(err);
      }

      // Update the task attributes
      task.title = postedData.title;
      
      // Save updated task
      task.save(function(err){
          if (err){
            // Could not save the task
            res.status(500).send({});
            return handleError(err);
          }
      
          res.send(task);
      });
    });
  });

});


// put task update task priorities
app.put('/api/tasks/priorities', (req, res) => {
  
  var jsonString = '';

  req.on('data', function (data) {
      jsonString += data;
  });

  req.on('end', function () {
    var postedData = JSON.parse(jsonString);
    
    postedData.forEach(function(taskPriority){
      taskModel.update({'_id': taskPriority.taskId}, 
        {'priority': taskPriority.priority}, {}, function(err, raw){
          //console.log(err);
          //console.log('update callback', raw);
        });
    });
    res.send(postedData);
  });

});

// Delele task by id
app.delete('/api/tasks', (req, res) => {
  
  var jsonString = '';

  req.on('data', function (data) {
      jsonString += data;
  });

  req.on('end', function () {
    var postedData = JSON.parse(jsonString);
    
    // Delete the task by id  
    taskModel.deleteOne({'_id': postedData.id}, function(err, task){
      if (err){
         res.status(500).send({});
         return handleError(err);
      }
      res.send({userMessage: 'Task Deleted Successfully.'});
    });
  });
});


// Create task list
app.post('/api/tasklist', (req, res) => {
  // Handle task list creation
});


app.listen(3000, () => console.log('Todo app listening on port 3000!'));