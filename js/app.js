var apiBaseURL = 'http://localhost:3000/api/';

  // Function to save task li
  saveTaskText = function (thisLi) {
    var newTaskText = thisLi.find('.task-edit-wrap>input').val();
    if(!newTaskText){
      thisLi.remove();
      // Update task count
      updateTaskCount();
      return false;
    }

    thisLi.find('.task-text').html(newTaskText);
    thisLi.removeClass('task-edit-mode');
  
    // Save this task to live
    var taskId = thisLi.attr('data-task-id');
    console.log(taskId);
    $.ajax({method: 'PUT', 
            dataType: 'json', 
              contentType: "application/json",
              url: apiBaseURL + 'tasks', data: JSON.stringify({title: newTaskText, id: taskId}), 
              success: function (data){
              // on success
              console.log(data);
            }});

  }

  // Function to update tasks count
  updateTaskCount = function () {
    $('.total-tasks').html('Total ' + $('.task-li').length + ' Tasks')
  }

  // get tasks from api
  var getTasksFromAPI=function(){
    $.ajax({method: 'GET', dataType: 'json', 
          contentType: "application/json",
          url: apiBaseURL + 'tasks', 
          success: function (tasks){
          // on success
          tasks.forEach(function(task){
            task.createDateTime = '';
            addTaskToUI(task);
          });
          updateTaskCount();
    }});
  };

  // add task to ui
  var addTaskToUI = function (task){
      if(!task._id){
        task._id = 'task_tmp_id' + (new Date()).getTime() + Math.random(11,99);
      }
      console.log('>>>>>>>>>>>', task.createDateTimeTS);
      $('#taskListWrap')
      .append('<li class="task-li" data-task-id="' + task._id + '"><input type="checkbox" name="task" class="task-checkbox"/>'
      + '<span class="task-text">'
      + task.title 
      + '</span>'
      + '<span class="task-edit-wrap"><input type="text" name="task-edit-input"/></span>'
      + '<span class="remove-task">' 
      + '&times;'
      + '</span>'
      + '<div class="task-create-time">' + moment.utc(task.createDateTimeTS).local().format('hh:mm DD-MMM-YY') + '</div>'
      + '</li>');
      
      var li = $('[data-task-id="' + task._id + '"]');
      return li;
  };
      
  $(document).ready(function(){
      // add task to ui
      getTasksFromAPI();

      // Update task count
      updateTaskCount();



      // Handle keyup on task input
      $(document).on('keyup', '#taskInput', function (evt){
          var currentDateStr = moment().format('hh:mm DD-MMM-YY');

          // To add the text
          if(evt.keyCode === 13 && $(this).val().length > 0){
            // Enter button pressed
            // Add text to list as task
            var addedLi = addTaskToUI({title: $(this).val(), createDateTimeTS: moment().utc().valueOf() });

            var newTaskText = $(this).val();
            $.ajax({method: 'POST', dataType: 'json', 
              contentType: "application/json",
              url: apiBaseURL + 'tasks', data: JSON.stringify({taskText: newTaskText, createDateTimeTS: moment().utc().valueOf()}), 
              success: function (task){
              // on success
              addedLi.attr('data-task-id', task._id);
            }});

            $(this).val('');
          }

          // Empty the input box if "Esc" key is pressed  
          if(evt.keyCode === 27){
              $(this).val('');  
          }
        
        // Update task count
        updateTaskCount();
      });

      // Handle mark done/undone click
      $(document).on('click', '.task-checkbox', function () {
        var parentLi = $(this).parent('.task-li');
        parentLi.removeClass('task-done');
        if($(this).is(':checked')){
          parentLi.addClass('task-done');
        }
      });

      // Handle remove button click
      $(document).on('click', '.remove-task', function () {
        var parentLi = $(this).parent('.task-li');
        
          var taskId = parentLi.attr('data-task-id');
          $.ajax({method: 'DELETE', 
            dataType: 'json', 
              contentType: "application/json",
              url: apiBaseURL + 'tasks', data: JSON.stringify({id: taskId}), 
              success: function (data){
              // on success
              console.log(data);
            }});


        parentLi.remove();
        updateTaskCount();
      });

      // Hnadle task text click
      $(document).on('dblclick', '.task-text', function (evt) {
        evt.stopPropagation();
        var parentLi = $(this).parent('.task-li');
        parentLi.addClass('task-edit-mode');
        if(parentLi.hasClass('task-edit-mode')){
          parentLi.find('.task-edit-wrap>input').val(parentLi.find('.task-text').html())
          parentLi.find('.task-edit-wrap>input').focus();
        }
      });

      // Handle task input click
      $(document).on('click', '.task-edit-wrap>input', function (evt) {
        evt.stopPropagation();
      });      

      // Handle task input keyup
      $(document).on('keyup', '.task-edit-wrap>input', function (evt) {
        evt.stopPropagation();

        if(evt.keyCode === 13){
          var parentLi = $(this).parent('.task-edit-wrap').parent('.task-li');
          saveTaskText(parentLi);
        }

      });      

      // Handle body click
      $(document).on('click', 'body', function(evt){
        evt.stopPropagation();
        $('.task-li.task-edit-mode').each(function(){
          var thisLi = $(this);
          saveTaskText(thisLi);
        });
      });

      

  });