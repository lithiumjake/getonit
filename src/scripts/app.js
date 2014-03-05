/*global Vue,$ */
window.Vue = require("./vue.min")
window.$ = window.jQuery = require("./jquery.min")
require('./bootstrap.min')
var loStorage = require('./loStorage.min')
var storage = loStorage.storage

Vue.component('ListItem', {
  template: "#itemTemplate"
})

Vue.component('CompleteItem', {
  template: "#completedTemplate"
})

Vue.component('ImportantItem', {
  template: "#importantTemplate"
})

Vue.component('Lists', {
  template: '#listTemplate'
})

 ListController = new Vue({
  el: "#v-app",
  data: {
    currentList: "",
    lists: [],
    msg: ""
  },
  methods: {
    toggleComplete: function(item) {
      if (item.complete) {
        item.complete = false
        this.lists[this.currentList].complete -= 1
      } else {
        item.complete = true
        this.lists[this.currentList].complete += 1
      }
    },
    toggleImportant: function(item) {
      item.important = !item.important
    },
    addItem: function() {
      if(this.msg === "") return
      this.lists[this.currentList].items.push({task:this.msg, complete:false, important:false})
      this.msg = ""
    },
    removeItem: function(item) {
      if (item.complete) {
        this.lists[this.currentList].complete -= 1
      }
      this.lists[this.currentList].items.splice(item.$index, 1)
    },
    configItem: function(e) {
      var item = e.targetVM
      $("#item-config-" + item.$index)
        .collapse('show')
        .on('shown.bs.collapse', function () {
          $("#item-config-" + item.$index + " input").focus().select()
            .on('blur', function() {
              //delay collapse on blur so delete button works
              //turn off toggle so that if item is deleted, new item at $index isn't triggered to open
              setTimeout(function() {
                $("#item-config-" + item.$index).collapse({toggle: false})
                $("#item-config-" + item.$index).collapse("hide")
              }, 400)
            })
        })
    },
    changeItemName: function(e) {
      var item = e.targetVM
      $("#item-config-" + item.$index).collapse('hide')
    },
    selectList: function(listIndex) {
      this.currentList = listIndex
    },
    configList: function(e) {
      var item = e.targetVM
      $("#list-config-" + item.$index)
        .collapse('show')
        .on('shown.bs.collapse', function () {
          $("#list-config-" + item.$index + " input").focus().select()
            .on('blur', function() {
              $("#list-config-" + item.$index).collapse('hide')
            })
        })
    },
    changeListName: function(e) {
      var item = e.targetVM
      $("#list-config-" + item.$index).collapse('hide')
    },
    addList: function() {
      var cl
      this.lists.push({name: "New List", icon: "fa-list-ul", items:[], complete:0})
      cl = this.currentList = this.lists.length - 1
      //wait for Vue DOM update, then show config
      Vue.nextTick(function(){
        $("#list-config-" + cl)
          .collapse('show')
          .on('shown.bs.collapse', function () {
            $("#list-config-" + cl + " input").focus().select().on('blur', function() {
              $("#list-config-" + cl).collapse('hide')
            })
          })
      })
    },
    removeList: function() {
      var oldCurrent = this.currentList
      this.lists.splice(this.currentList, 1)
      if(oldCurrent === this.lists.length) {
        this.currentList = this.lists.length -1
      } else {
        this.currentList = oldCurrent
      }
    }
  },
  created: function() {
    var lists = storage.get('lists')
    if (lists === null) {
      this.lists = [
        {name:"Inbox", icon:"fa-inbox", items:[], complete:0},
        {name:"Morning", icon:"fa-sun-o", items:[], complete:0},
        {name:"Shopping", icon:"fa-shopping-cart", items:[], complete:0},
        {name:"Chores", icon:"fa-lemon-o", items:[], complete:0},
        {name:"Reading", icon:"fa-book", items:[], complete:0},
        {name:"Projects", icon:"fa-rocket", items:[], complete:0}
      ]
    } else {
      this.lists = lists
    }

    this.currentList = 0

    this.$watch("lists", function(val) {
      storage.set("lists", val)
    })
  },

  ready: function() {
    $("#menu-toggle").click(function(e) {
      e.preventDefault();
      $("#wrapper").toggleClass("active");
    })
  }
})


