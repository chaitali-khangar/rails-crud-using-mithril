//this application only has one component: todo
var todo = {};

//for simplicity, we use this component to namespace the model classes

//the Todo class has two properties
todo.Todo = function(data) {
    this.description = m.prop(data.description);
    this.done = m.prop(false);
};


//the TodoList class is a list of Todo's
todo.TodoList = Array;

//the view-model tracks a running list of todos,
//stores a description for new todos before they are created
//and takes care of the logic surrounding when adding is permitted
//and clearing the input after adding a todo to the list
todo.vm = (function() {
    var vm = {}
    vm.init = function() {
        //a running list of todos
        vm.list = m.request({method: "GET", url: "/todos"})

        //a slot to store the name of a new todo before it is created
        vm.description = m.prop("");
        vm.done = m.prop(false)

        //adds a todo to the list, and clears the description field for user convenience
        vm.add = function() {
            if (vm.description()) {
                vm.list = m.request({method: "POST", url: "/todos", data: {description: vm.description(), done: vm.done() }});
                vm.description("");
            }
        };
        vm.remove = function() {
          id = $(this).closest("tr").find("td:nth-child(1)").text();
          vm.list = m.request({method: "DELETE", url: "/todos/"+id});
        };    
        vm.update = function(){
          id = $(this).closest("tr").find("td:nth-child(1)").text();
          task_done = $(this).closest("tr").find("td:nth-child(2) input").prop("checked");
          description = $(this).closest("tr").find("td:nth-child(3)").text();
          vm.list = m.request({method: "PUT", url: "/todos/"+id, data: {description: description, done: task_done }});
        };
        vm.edit = function(){
          if($(this).text() == "Update"){
            id = $(this).closest("tr").find("td:nth-child(1)").text();
            task_done = $(this).closest("tr").find("td:nth-child(2) input").prop("checked");
            description = $(this).closest("tr").find("td:nth-child(3) input").val(); 
            vm.list = m.request({method: "PUT", url: "/todos/"+id, data: {description: description, done: task_done }});
            $(this).closest("tr").find("td:nth-child(3)").html("");
            $(this).closest("tr").find("td:last button").text("Edit");
          }else{
            id = $(this).closest("tr").find("td:nth-child(1)").text();
            task_done = $(this).closest("tr").find("td:nth-child(2) input").prop("checked");
            description = $(this).closest("tr").find("td:nth-child(3)").text(); 
            $(this).closest("tr").find("td:nth-child(3)").html("<input value = '"+ description +"'></input>");
            $(this).closest("tr").find("td:last button").text("Update");
          }
         
        }    
    }
    return vm
}())

//the controller defines what part of the model is relevant for the current page
//in our case, there's only one view-model that handles everything
todo.controller = function() {
    todo.vm.init()
}

//here's the view
todo.view = function() {
    return [
        m("label", {style: 'padding-right:10px;'},"Task"),
        m("input", {onchange: m.withAttr("value", todo.vm.description), value: todo.vm.description(),style: 'margin-right:10px;'}),
        m("button", {onclick: todo.vm.add}, "Add"),
        m("table", [
            todo.vm.list().map(function(task, index) {
                return m("tr", [
                    m("td", {style: 'display:none'}, task.id),
                    m("td", [
                        m("input[type=checkbox]", {onclick: todo.vm.update , checked: task.done})
                    ]),
                    m("td", {style: {textDecoration: task.done ? "line-through" : "none"}}, task.description),
                    m("td",[
                    	m("button", {onclick: todo.vm.remove}, "Remove")
                    ]),
                    m("td",[
                        m("button", {onclick: todo.vm.edit}, "Edit")
                    ])
                ])
            })
        ])
    ]
};

$(document).ready(function(){
//initialize the application
  m.mount(document.body, {controller: todo.controller, view: todo.view});
});