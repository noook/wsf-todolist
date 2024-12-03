const TASK_STATUS = {
  TODO: 'todo',
  DOING: 'doing',
  DONE: 'done'
}

const task = {
  title: 'titles',
  description: 'Task description',
  createdAt: '2021-01-01',
  completedAt: '2021-01-02',
  assignee: 'John Doe',
  tags: ['Tag 3', 'Tag 4'],
  status: TASK_STATUS.TODO,
  id: "",
}

const tag = {
  id: self.crypto.randomUUID(),
  name: 'Tag 1',
  color: '#ff0000'
}

const TODOlist = document.querySelector('#TODO')

function createTask(task) {
  task.id = self.crypto.randomUUID()
  const template = document.querySelector('[name=task-template]').cloneNode(true)
  
  template.classList.remove('hidden')
  template.querySelector('[name=task-title]').textContent = task.title
  template.querySelector('[name=task-description]').textContent = task.description
  template.querySelector('[name=created-at]').textContent = task.createdAt
  template.querySelector('[name=completed-at]').textContent = task.completedAt
  template.setAttribute('task-id', task.id)
  template.querySelector('[name=delete-task]').addEventListener('click', ()=>{
    template.remove()
  })
  template.querySelector('[name=mark-todo]').addEventListener('click', ()=>{
    updateStatus(task, TASK_STATUS.TODO, template)
  })
  template.querySelector('[name=mark-doing]').addEventListener('click', ()=>{
    updateStatus(task, TASK_STATUS.DOING, template)
  })
  template.querySelector('[name=mark-done]').addEventListener('click', ()=>{
    updateStatus(task, TASK_STATUS.DONE, template)
  })
  TODOlist.appendChild(template)
  console.log(template)
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

createTask(task)
createTask(task)
createTask(task)
createTask(task)