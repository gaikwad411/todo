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

app.get('/jquery.js', (req, res) => res.sendFile(path.join(__dirname, 'node_modules', 'jquery', 'dist', 'jquery.min.js')));
app.get('/moment.js', (req, res) => res.sendFile(path.join(__dirname, 'node_modules', 'moment', 'moment.js')));

// get tasks
app.get('/api/tasks', (req, res) => {
  taskModel.find({}, 'id title createDateTimeTS', function (err, tasks) {
    if (err) return handleError(err);
    // 'athletes' contains the list of athletes that match the criteria.
    res.send(tasks);
  });
  
});

// post task create task
app.post('/api/tasks', (req, res) => {

  if (req.method == 'POST') {
        var jsonString = '';

        req.on('data', function (data) {
            jsonString += data;
        });

        req.on('end', function () {
          var postedData = JSON.parse(jsonString);
            console.log(postedData);
           // Create an instance of model SomeModel
          var awesome_instance = new taskModel({ title: postedData.taskText, createDateTimeTS: postedData.createDateTimeTS});

          // Save the new model instance, passing a callback
          awesome_instance.save(function (err) {
            if (err) return handleError(err);
            // saved!
            console.log('Saved!!!!');
            res.send(awesome_instance);  
          });
            

        });
    }

  
 

  
});

// put task update task
app.put('/api/tasks', (req, res) => {
  if (req.method == 'PUT') {
        var jsonString = '';

        req.on('data', function (data) {
            jsonString += data;
        });

        req.on('end', function () {
          var postedData = JSON.parse(jsonString);
            console.log(postedData);
           // Create an instance of model SomeModel
          //var awesome_instance = new taskModel({ title: postedData.taskText });
          taskModel.findOne({'_id': postedData.id}, '_id title', {}, function(err, task){
            if (err) return handleError(err);
            task.title = postedData.title;
            task.save(function(err){
                if (err) return handleError(err);
            // saved!
            console.log('Saved!!!!');
                res.send(task);
            });
          });


        });
    }

});

// delele task remove task
app.delete('/api/tasks', (req, res) => {
  
  if (req.method == 'DELETE') {
        var jsonString = '';

        req.on('data', function (data) {
            jsonString += data;
        });

        req.on('end', function () {
          var postedData = JSON.parse(jsonString);
            console.log(postedData);
           // Create an instance of model SomeModel
          //var awesome_instance = new taskModel({ title: postedData.taskText });
          taskModel.deleteOne({'_id': postedData.id}, function(err, task){
            if (err) return handleError(err);
            res.send('Task deleted');
          });


        });
    }


});


app.listen(3000, () => console.log('Example app listening on port 3000!'));