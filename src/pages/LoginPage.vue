<template>
  <form class="form" @submit.prevent="login">
    <img class="logo" src="https://i.imgur.com/al9Jeh9.png" alt="">
    <div v-if="errorMessage" class="errors">{{ errorMessage }}</div>
    <div class="form-group">
      <label for="email">Login name</label>
      <input
        type="email"
        id="email"
        v-model="loginName"
        placeholder="email"
        autocomplete="username"
        required
      >
    </div>
    <div class="form-group">
      <label for="password">Password</label>
      <input
        type="password"
        id="password"
        v-model="password"
        autocomplete="current-password"
        required
      >
    </div>
    <button type="submit" @click="login">
      {{ isWorking ? 'Working ...' : 'LOGIN' }}
    </button>
  </form>
</template>

<script>
/* eslint-disable */
import axios from 'axios'
import moment from 'moment'

export default {
  data () {
    return {
      loginName: '',
      password: '',
      errorMessage: '',
      isWorking: false
    }
  },
  methods: {
    login () {
      this.errorMessage = ''
      this.isWorking = true
      axios.post(
        'https://vue-todos.robertmckenney.ca/oauth/token',
        {
          grant_type: 'password',
          client_id: '5',
          client_secret: 'j96oasjgqQLXSQtVzZtD5hXGhXtulEeOxUG4ozpY',
          username: this.loginName,
          password: this.password,
          scope: '*'
        }
      )
      .then(response => {
        console.log(response)
        // eslint-disable-next-line
        const { expires_in, ...rest } = response.data
        const apiTokens = {
          expires_at: moment().add(expires_in, 'seconds').format(),
          ...rest
        }
        // console.log(apiTokens)
        this.$emit('saveApiTokens', apiTokens)
        this.loginName = null
        this.password = null
      })
      .catch(error => this.handleError(error))
      .finally(() => { this.isWorking = false })
      },
    handleError (error) {
      console.log(error)
    }
  }
}
</script>

<style lang="css">
.form-group {
  display: block;
  margin: 0 auto;
}

.logo {
  display: block;
  margin-left: auto;
  margin-right: auto;
 }
</style>
