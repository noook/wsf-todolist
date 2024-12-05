const TASK_STATUS = {
  TODO: 'todo',
  DOING: 'pending',
  DONE: 'done'
}

const todoList = document.querySelector('#TODO')
const doingList = document.querySelector('#DOING')
const doneList = document.querySelector('#DONE')
const form = document.querySelector('#new-task')

const tasks = localStorage.getItem('tasks') !== null
  ? JSON.parse(localStorage.getItem('tasks'))
  : []

for (const task of tasks) {
  const taskElement = createTaskElement(task)
  insertTask(taskElement)
}

const tag = {
  id: self.crypto.randomUUID(),
  name: 'Tag 1',
  color: '#ff0000'
}

function createTaskElement(task) {
  const template = document.querySelector('[name=task-template]').cloneNode(true)
  
  template.classList.remove('hidden')
  template.querySelector('[name=task-title]').textContent = task.title
  template.querySelector('[name=task-description]').textContent = task.description
  template.querySelector('[name=created-at]').textContent = task.createdAt
  template.querySelector('[name=completed-at]').textContent = task.completedAt
  template.setAttribute('task-id', task.id)
  template.querySelector('[name=delete-task]').addEventListener('click', () => {
    const index = tasks.findIndex(t => t.id === task.id)
    if (index > -1) {
      template.remove()
      tasks.splice(index, 1)
      saveTasks()
    }
  })
  template.querySelector('[name=mark-todo]').addEventListener('click', () => {
    updateStatus(task, TASK_STATUS.TODO, template)
  })
  template.querySelector('[name=mark-doing]').addEventListener('click', () => {
    updateStatus(task, TASK_STATUS.DOING, template)
  })
  template.querySelector('[name=mark-done]').addEventListener('click', () => {
    updateStatus(task, TASK_STATUS.DONE, template)
  })

  return template
}

function insertTask(taskElement) {
  todoList.appendChild(taskElement)
}

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks))
}

function updateStatus(task, status, element) {
  task.status = status
  element.remove()
  if (status === TASK_STATUS.DONE) {
    document.querySelector('#DONE').appendChild(element)
  } else if (status === TASK_STATUS.DOING) {
    document.querySelector('#DOING').appendChild(element)
  } else {
    document.querySelector('#TODO').appendChild(element)
  }
}

form.addEventListener('submit', (event) => {
  event.preventDefault()
  const task = {
    title: event.target.elements['title'].value,
    description: event.target.elements['description'].value,
    createdAt: event.target.elements['create'].value,
    completedAt: "2021-01-02",
    assignee: "John Doe",
    tags: [
      "Tag 3",
      "Tag 4"
    ],
    status: "todo",
    id: self.crypto.randomUUID()
  }
  
  const taskelement = createTaskElement(task)
  insertTask(taskelement)
  tasks.push(task)
  saveTasks()
  form.reset()
})

console.log(tasks[0])