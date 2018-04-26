<template>
  <div id="app">
    <div v-if="isLoggedIn">

      <!-- We need some navigation links to switch between views -->
<button class="logout" @click="logout">LOGOUT</button>
      <img class="logo" src="https://i.imgur.com/al9Jeh9.png" alt="">

      <!-- <span><h2>{{ someDate | moment('dddd, MMMM, Do, YYYY')}}</h2></span> -->

      <div class="date">
        {{ now }}
      </div>

      <nav>
        <ul>
          <!--
            The RouterLink component comes with VueRouter.
            The 'to' prop is the URL route.
          -->
          <li><router-link to="/">All</router-link></li>
          <li><router-link to="/active">Active</router-link></li>
          <li><router-link to="/completed">Completed</router-link></li>
        </ul>
      </nav>

      <add-task-form @taskAdded="addTask" />
      <!--
        The RouterView is a placeholder that VueRouter uses to know
        where to insert the designated component for a given URL.
        In this case we are passing our taskList as a prop to each route's
        component and we are listening for user events.  This way we are still
        only mainting one master list in the App.vue component.
       -->
      <router-view
        :tasks="taskList"
        @toggleDone="toggleDone"
        @removeTask="removeTask"
      />
    </div>
    <login-page v-else @saveApiTokens="saveApiTokens" />
  </div>
</template>

<script>
/* eslint-disable */
import AddTaskForm from '@/components/AddTaskForm'
import moment from 'moment'
import axios from 'axios'
import LoginPage from '@/pages/LoginPage'

export default {
  name: 'App',
  components: { LoginPage, AddTaskForm },
  data () {
    return {
      baseURL: 'https://vue-todos.robertmckenney.ca/api',
      now: moment().format('MMM Do YYYY'),
      api: {
        accessToken: null,
        expiresAt: null
      },
      taskList: [
        // { id: 1234, title: 'Learn Vue', isComplete: true, priority: 'medium' },
        // { id: 1235, title: 'Learn Vue Router', isComplete: false, priority: 'medium' },
        // { id: 1236, title: 'Learn Vuex', isComplete: false, priority: 'medium' },
        // { id: 1237, title: 'Learn Vue DevTools', isComplete: true, priority: 'medium' }
      ]
    }
  },

  created () {
    // this.taskList = JSON.parse(localStorage.getItem('taskList')) || []
    axios
      .get(`${this.baseURL}/priorities`)
      .then(response => {
        this.priorityOptions = response.data.data.length
          ? response.data.dafta
          : []
      })
      .catch(error => { console.error(error) })
  },

  methods: {
    refreshTasks () {
       axios
         .get('/todos', this.axiosOptions)
         .then(response => { this.taskList = response.data.data })
         .catch(error => { this.handleError(error) })
     },
     addTask (task) {
       axios
         .post('/todos', task, this.axiosOptions)
         .then(response => { this.taskList.push(response.data.data) })
         .catch(error => { this.handleError(error) })
     },
     toggleDone (task) {
       task.isComplete = !task.isComplete
       axios
         .put(`/todos/${task.id}`, task, this.axiosOptions)
         .catch(error => { this.handleError(error) })
     },
     removeTask (task) {
       axios
         .delete(`/todos/${task.id}`, this.axiosOptions)
         .then(response => {
           const taskIndex = this.taskList.findIndex(t => t.id === task.id)
           this.taskList.splice(taskIndex, 1)
         })
         .catch(error => { this.handleError(error) })
     },
     handleError(error) {
       console.log(error)
     },

     async getTask (taskId) {
      const response = await axios.get(`${this.baseURL}/tasks/${taskId}`)
      return response.data.data
    },

    async saveTask (newTask) {
      const response = await axios.post(`${this.baseURL}/tasks`, newTask)
      return response.data.data
    },

    async deleteTask (task) {
      const response = await axios.delete(`${this.baseURL}/tasks/${task.id}`)
      return response.data.data
    },

    saveTaskList () {
      localStorage.setItem('taskList', JSON.stringify(this.taskList))
    },

    saveApiTokens (apiTokens) {
      this.api.accessToken = apiTokens.access_token
      this.api.expiresAt = apiTokens.expires_at
      localStorage.setItem('todoApiTokens', JSON.stringify(apiTokens))
      this.refreshTasks()
    },

    refreshTasks () {
      const axiosOptions = {
        baseURL: this.baseURL,
        headers: { 'Authorization': `Bearer ${this.api.accessToken}` }
      }
      axios
        .get('/todos', axiosOptions)
        .then(response => { this.taskList = response.data.data })
        .catch(error => { console.error(error) })
    },

    loadInitialData () {
      const apiTokens = JSON.parse(localStorage.getItem('todoApiTokens'))
      if (apiTokens) {
        this.api.accessToken = apiTokens.access_token
        this.api.expiresAt = apiTokens.expires_at
        if (this.isLoggedIn) this.refreshTasks()
      }
    },

    created () {
      this.loadInitialData()
    },

    logout () {
      this.api.accessToken = null
      this.api.expiresAt = null
      localStorage.removeItem('todoApiTokens')
    }
  },

  computed: {
    isLoggedIn () {
     return this.api.accessToken && moment(this.api.expiresAt).isAfter()
   },

   axiosOptions () {
     return {
       baseURL: this.baseURL,
       headers: { 'Authorization': `Bearer ${this.api.accessToken}`}
     }
   }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
  width: 100%;
  max-width: 550px;
  margin: 60px auto;
}
ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
}
nav ul {
  display: flex;
  justify-content: center;
}
nav ul li {
  margin-right: 1em;
}

body {
  background-color: #f4f4f4
}

.logo {
  display: block;
  margin-left: auto;
  margin-right: auto;
 }

 .date {
   text-align: center;
   margin-bottom: 20px;
   font-size: 26px;

 }


</style>
