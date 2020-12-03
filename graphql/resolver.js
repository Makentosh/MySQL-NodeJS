const Todo = require('../models/todo')

const users = [
  {name: 'Ihor', age: 23, email: 'gaga@mail.ru'},
  {name: 'Ihsdfsdor', age: 243, email: 'gaga@mail.ru'},
  {name: 'gasd', age: 2333, email: 'gaga@mail.ru'},
  {name: 'sdf', age: 22, email: 'gaga@mail.ru'},
  {name: 'sdf', age: 22, email: 'gaga@mail.ru'},
]


module.exports = {
  test() {
    return {
      count: Math.trunc(Math.random() * 10),
      users
    }
  },
  random({min, max, count}) {
    const arr = []

    for(let i = 0; i < count; i++) {
      const random = Math.random() * (max - min) + min
      arr.push(random.toFixed(2))
    }

    return arr
  },
  addTestUser({user: {name, email}}) {
    const user = {
      name, email,
      age: Math.ceil(Math.random() * 30),
    }
    users.push(user)

    return user
  },

  async getTodos() {
    try {
       return await Todo.findAll()
    } catch (e) {
      throw new Error('Fetch todos is not  available')
    }
  },

  async createTodo({todo}) {
    try {
      return await Todo.create({
        title: todo.title,
        done: false
      })
    } catch (e) {
      throw new Error('Title is required')
    }
  },

  async completeTodo({id}) {
    try {
      const todo = await Todo.findByPk(+id)
      todo.done = true
      await todo.save()

      return todo
    } catch (e) {
      throw new Error('Id required')
    }
  },

  async removeTodo({id}) {
    try {
      const todos = await Todo.findAll({
        where: {id}
      })

      await todos[0].destroy()

      return true
    } catch (e) {
      throw new Error('Id required')
      return false
    }
  }
}
