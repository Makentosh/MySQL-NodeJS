new Vue({
  el: '#app',
  vuetify: new Vuetify(),
  data() {
    return {
      isDark: true,
      show: true,
      todoTitle: '',
      todos: []
    }
  },
  created() {
   const query = `
     query {
        getTodos {id title done createdAt updatedAt
        }
     }
   `

    fetch('/graphql', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({query})
    })
      .then(res => res.json())
      .then(({data}) => {
        this.todos = data.getTodos
      })
  },

  methods: {
    addTodo() {
      const title = this.todoTitle.trim()

      if (!title) {
        return
      }

      const query = `
        mutation {
          createTodo(todo: {title: "${title}"}) {
            title
            id
            done
            updatedAt
            createdAt
          }
        }
      `
      fetch('/graphql', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({query})
      })
          .then(res => res.json())
          .then(({data}) => {
            this.todos.push(data.createTodo)
          })
          .catch(e => console.log(e))

      this.todoTitle = ''
    },


    removeTodo(id) {

      const query = `
        mutation {
          removeTodo(id: "${id}")
        }
      `

      fetch(`/graphql`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({query})
      })
          .then(() => {
            this.todos = this.todos.filter(t => t.id !== id)
          })
          .catch(e => {
            console.log(e)
          })
    },


    completeTodo(id) {
      const query = `
        mutation {
          completeTodo(id: "${id}") {
          updatedAt
          }
        }
      `


      fetch(`/graphql`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({query})
      })
          .then(res => res.json())
          .then(({data}) => {
            const indx = this.todos.findIndex(t => t.id === id)
            this.todos[indx].updatedAt = data.completeTodo.updatedAt
          })
          .catch(e => {
            console.log(e)
          })
    }
  },

  filters: {
    capitalize(value) {
      return value.toString().charAt(0).toUpperCase() + value.slice(1)
    },
    date(value, withTime) {
      const options  = {
        year: 'numeric',
        month: 'long',
        day: '2-digit'
      }
      if(withTime) {
        options.hour = '2-digit'
        options.minute = '2-digit'
        options.second = '2-digit'
      }
      return new Intl.DateTimeFormat('ru-RU', options).format(new Date(+value))
    }
  }
})
