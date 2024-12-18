const TASK_STATUS = {
  TODO: 'todo',
  DOING: 'pending',
  DONE: 'done'
}

/**
 * Récupération des éléments du DOM pour une utilisation future
 */
const todoList = document.querySelector('#TODO')
const doingList = document.querySelector('#DOING')
const doneList = document.querySelector('#DONE')
const createTaskForm = document.querySelector('#new-task')
const createTagForm = document.querySelector('#create-tag')

/**
 * Récupération des tâches et des tags depuis le localStorage. Si pas d'entrée dans le local storage, on initialise les variables à un tableau vide.
 */
const tasks = localStorage.getItem('tasks') !== null
  ? JSON.parse(localStorage.getItem('tasks'))
  : [];

const tags = localStorage.getItem('tags') !== null
? JSON.parse(localStorage.getItem('tags'))
: [];

/**
 * Fonction qui génère une couleur aléatoire, mais pastel (couleur claire, dont la valeure RGB est comprise entre 100 et 227)
 */
function generatePastelColors() {
  const r = Math.floor((Math.random() * 127) + 100);
  const g = Math.floor((Math.random() * 127) + 100);
  const b = Math.floor((Math.random() * 127) + 100);
  return `rgb(${r}, ${g}, ${b})`
}

/**
 * On parcourt les tags pour les afficher dans le DOM
 */
for (const tag of tags) {
  const tagElement = createTagElement(tag)
  insertTag(tagElement)
}

/**
 * Pour chacune des listes, on ajoute des EventListeners pour gérer le drag and drop
 */
[todoList, doingList, doneList].forEach(list => {
  /**
   * Il est nécessaire de faire `event.preventDefault()` pour autoriser le drop
   */
  list.addEventListener('dragover', event => {
    event.preventDefault()
  })
  list.addEventListener('drop', event => {
    // Si on ne fait pas `event.preventDefault()`, le drop ne fonctionne pas et va ouvrir le fichier si on drop un fichier
    event.preventDefault()
    const taskId = event.dataTransfer.getData('text/plain')
    // On cherche l'élement dont l'attribut `task-id` est égal à taskId
    const element = document.querySelector(`[task-id="${taskId}"]`)
    // On retire l'élément du DOM puis on le rajoute à la liste où on a drop
    element.remove()
    event.target.closest('[name=drop-container]').appendChild(element)

    // On cherche dans notre "state" (mémoire de l'application) la tâche correspondant à l'id
    const task = tasks.find(task => task.id === taskId)
    // TODO: Mettre à jour le status de la tâche, pour ça il faut savoir quelle est la valeur du statut associée à la colonne où on a drop
    // On met à jour le localstorage avec la dernière version des tasks
    saveTasks()
  })
})

/**
 * On parcourt les tâches pour les afficher dans le DOM
 */
for (const task of tasks) {
  const taskElement = createTaskElement(task)
  insertTask(taskElement)
}

/**
 * Pour un élément donné, on ajoute des EventListeners pour gérer les actions de l'utilisateur
 */
function bindEvents(element, task) {
  // Pour l'élément dont l'attribut "name" vaut "delete-task", on ajoute un EventListener qui supprime la tâche de la liste
  element.querySelector('[name=delete-task]')
    .addEventListener('click', () => {
      const index = tasks.findIndex(t => t.id === task.id)
      if (index > -1) {
        element.remove()
        // Supprime un élément de la liste
        tasks.splice(index, 1)
        // Mise à jour du localtorage
        saveTasks()
      }
    })

  // Pour chaque bouton de changement de status, on ajoute un EventListener qui met à jour le status de la tâche
  element.querySelector('[name=mark-todo]').addEventListener('click', () => {
    updateStatus(task, TASK_STATUS.TODO, element)
  })
  element.querySelector('[name=mark-doing]').addEventListener('click', () => {
    updateStatus(task, TASK_STATUS.DOING, element)
  })
  element.querySelector('[name=mark-done]').addEventListener('click', () => {
    updateStatus(task, TASK_STATUS.DONE, element)
  })


  element.addEventListener('dragstart', event => {
    event.dataTransfer.setData('text/plain', task.id)
    event.dataTransfer.effectAllowed = 'move'
  })
}

/**
 * Fonction qui crée un élément HTML pour une tâche donnée. L'élément est cloné depuis un template caché dans le HTML.
 * L'élément n'est pas ajouté au DOM. Il faut le rajouter par la suite.
 */
function createTaskElement(task) {
  const template = document.querySelector('[name=task-template]').cloneNode(true)
  
  // Notre template a la classe hidden, ce qui lui permet d'être détectable par notre JavaScript, mais pas pour l'utilisateur
  template.classList.remove('hidden')
  // On met à jour le contenu
  template.querySelector('[name=task-title]').textContent = task.title
  template.querySelector('[name=task-description]').textContent = task.description
  template.querySelector('[name=created-at]').textContent = task.createdAt
  template.querySelector('[name=completed-at]').textContent = task.completedAt
  template.setAttribute('task-id', task.id)
  template.setAttribute('draggable', true)

  // On attache les events listeners
  bindEvents(template, task)

  // On retourne l'élément créé
  return template
}

/**
 * Cette fonction permet d'insérer une tâche. En fonction du status de la tâche, on l'insère dans la bonne liste.
 */
function insertTask(taskElement) {
  const task = tasks.find(t => t.id === taskElement.getAttribute('task-id'))
  switch (task.status) {
    case TASK_STATUS.TODO:
      todoList.appendChild(taskElement)
      break
    case TASK_STATUS.DOING:
      doingList.appendChild(taskElement)
      break
    case TASK_STATUS.DONE:
      doneList.appendChild(taskElement)
      break
    default:
      console.error('Invalid status')
  }
}

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks))
}

function saveTags() {
  localStorage.setItem('tags', JSON.stringify(tags))
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
  saveTasks()
}

// La soumission du formulaire déclenche un événement "submit"
createTaskForm.addEventListener('submit', (event) => {
  // On empêche le comportement par défaut du formulaire, qui est de recharger la page
  event.preventDefault()
  // On crée un objet qui représente la tâche
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
  createTaskForm.reset()
})

createTagForm.addEventListener('submit', (event) => {
  event.preventDefault()
  const value = event.target.elements['tag-name'].value
  if (value.trim() === '') {
    return
  }

  const tag = {
    id: self.crypto.randomUUID(),
    name: value,
    color: generatePastelColors()
  }
  const element = createTagElement(tag)
  insertTag(element)
  createTagForm.reset()
  tags.push(tag)
  saveTags()
})

function createTagElement(tag) {
  const template = document.querySelector('[name=tag-template]').cloneNode(true)
  template.classList.remove('hidden')
  template.querySelector('[name=tag-name]').textContent = tag.name
  template.style.backgroundColor = tag.color
  template.setAttribute('tag-id', tag.id)

  const deleteButton = template.querySelector('[name=delete-tag]')
  deleteButton.addEventListener('click', () => {
    const index = tags.findIndex(t => t.id === tag.id)
    if (index > -1) {
      template.remove()
      tags.splice(index, 1)
    }
    saveTags()
  })
  return template
}

function insertTag(tagElement) {
  document.querySelector('#tag-list').appendChild(tagElement)
}