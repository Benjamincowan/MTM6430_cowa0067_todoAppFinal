<template>
  <div>
    <h2>{{listTitle}}</h2>
    <div class="toolbar">
      <label for="priority-filter">Sort by Priority</label>
      <select name="priority-filter" id="priority-filter" v-model="selectedPriority">
        <option value="">all</option>
        <option
          v-for="option in priorityOptions"
          :value="option"
          :key="option">{{option}}</option>
      </select>

      <label for="priority-filter">Sort by Category</label>
      <select name="category-filter" id="category-filter" v-model="selectedCategory">
        <option value="">all</option>
        <option
          v-for="option in categoryOptions"
          :value="option"
          :key="option">{{option}}</option>
      </select>

      <button @click="sortAscending = !sortAscending">Sort by Date</button>
    </div>
    <ul class="task-list">
      <li v-for="task in sortedTasks" :key="task.id" class="task-item">
        <div class="check">
          <span class="far"
            :class="{
              'fa-circle': ! task.isComplete,
              'fa-check-circle': task.isComplete
            }"
            @click="toggleDone(task)"></span>
          </div>
        <div class="line1">
          <div class="tt">
            <span><h3>{{ task.title }}</h3></span>
          </div>
          <div class="tp">
            <span><h4>{{ task.priority.name }}</h4></span>
          </div>
          <div class="trash">
            <span class="far fa-trash-alt" @click="removeTask(task)"></span>
          </div>
        </div>

          <br>
        <div class="line2">

          <div class="tdd"><span><h5> Due by: {{ task.dueAt }}</h5></span></div>
          <div class="tc"><span><h5>{{ task.category }}</h5></span></div>

        </div>
          <br>
        <div class="line3">
          <div class="td">
            <span>{{ task.description }}</span>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
// import axios from 'axios'

export default {
  // We are not actually managing the task list in this component.
  // We are only displaying the list. The parent component (App.vue) is
  // passing down a reference to the list in the 'tasks' prop.
  props: ['tasks', 'listTitle'],
  data () {
    return {
      priorityOptions: ['low', 'medium', 'high'],
      selectedPriority: '',
      categoryOptions: ['work', 'home', 'school', 'other'],
      selectedCategory: '',
      sortAscending: true
    }
  },
  computed: {
    filteredPriorityTasks () {
      // If the selectedFilter is 'all', the value is set to an empty string
      // which will evaluate to false. In that case, we will reuturn the
      // entire task list. Otherwise we use the array.filter() method to return
      // only the tasks with the selected priority.
      return (!this.selectedPriority)
        ? this.tasks
        : this.tasks.filter(task => task.priority === this.selectedPriority)
    },
    filteredCategoryTasks () {
      return (!this.selectedCategory)
        ? this.tasks
        : this.tasks.filter(task => task.category === this.selectedCategory)
    },
    filteredTasks () {
      return (!this.selectedPriority && !this.selectedCategory)
        ? this.tasks
        : this.tasks.filter(task => {
          let matched = false
          if (this.selectedPriority && this.selectedCategory) {
            if (task.priority === this.selectedPriority &&
                task.category === this.selectedCategory) {
              matched = true
            }
          } else if (this.selectedPriority) {
            if (task.priority === this.selectedPriority) matched = true
          } else if (this.selectedCategory) {
            if (task.category === this.selectedCategory) matched = true
          }
          return matched
        })
    },
/* eslint-disable */
    sortedTasks () {
      return [...this.filteredTasks].sort((a, b) => {
        const dateOne = new Date(a.dueAt)
        const dateTwo = new Date(b.dueAt)
        return this.sortAscending ? (dateOne - dateTwo) : (dateTwo - dateOne)
      })
    }
  },
  methods: {
    // Since this component does not own the task list data, we need to
    // notify the parent component that the user wants to toggle the
    // completion status of the task.  We do that by emitting a custom event,
    // and passing up the affected task with the event. We will listen for
    // this event in the parent component and call the appropriate method to
    // make the change to the data.
    toggleDone (task) {
      this.$emit('toggleDone', task)
    },
    removeTask (task) {
      this.$emit('removeTask', task)
    }
  }
}
</script>

<style>
/* We will add styles here later. */
.task-item {
  /* display: grid;
  grid-template-columns: auto 1fr auto auto; */
  align-items: center;
  background-color: white;
  margin-bottom: 10px;
  padding-left: 20px;
  padding-right: 10px;
  border-radius: 15px;
  height: 100%;
  box-shadow: 3px 3px 10px;

}

.check {
  height: 100%;
  width: 20px;
  display: flex;
  justify-content: center;
  padding-top: 22px;
  margin-right: 20px;

  float: left;
}

.line1 {
  min-height: 50px;
}

.tt {
  float: left;
  width: 65%;
}

.tp {
  float: left;
  width: 22%
}

.trash {
 float: left;
 padding-top: 21px;
}

.line2 {
  height: 50px;
  width: 100%;
  margin-top: -20px;
}

.tdd {
 float: left;
 width: 64%;
 padding-left: 8.5%;
}

.tc {
 float: left;
 width: 24%;
}

.line3 {
  min-height: 50px;
  width: 100%;
  margin-top: 5px;
}

.td {
  padding-bottom: 15px;
  padding-left: 8.5%;
  padding-right: 8.5%
}

.toolbar {
  margin-bottom: 1rem;
}

ul {
  background-color:
}

h3 {

}

h4 {
  color: #cc6600
}

h5 {
  color: dark-grey
}
</style>
