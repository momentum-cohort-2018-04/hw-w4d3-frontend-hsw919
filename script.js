import request from 'superagent'
let NOTES = []

function displayNotes () {
  request
    .get('https://notes-api.glitch.me/api/notes')
    .auth('hunter', 'password')
    .then(response => {
      NOTES = response.body.notes
      notes(NOTES)
      console.log(NOTES)
    })
}

function deleteNote (noteId) {
  request
    .delete(`https://notes-api.glitch.me/api/notes/${noteId}`)
    .auth('hunter', 'password')
    .then(response => {
      NOTES = NOTES.filter(notes => notes._id !== noteId)
      notes(NOTES)
    })
}

function notes (note) {
  var notesHTML = []
  for (var notes of note) {
    notesHTML.push(noteToHTML(notes))
  }
  document.querySelector('.notes__contain').innerHTML = notesHTML.join('')
  updateNote()
}

function updateNote () {
  document.querySelectorAll('.button-danger').forEach(button => {
    button.addEventListener('click', event => {
      const noteId = button.dataset.noteId
      deleteNote(noteId)
    })
  })
}

function noteToHTML (note) {
  return `
  <div class="notes__each">
    <div class="input-field">
      <label class="notes__labels">Title</label>
      <input type="text" value="${note.title}" placeholder="Title">
    </div>

    <div class="input-field">
      <label>Note</label>
      <input type="text" value="${note.text}" placeholder="Note">
    </div>

    <div class="input-fields">
      <label>Tags</label>
      <input type="text" value="${note.tags}" placeholder="Tags(Optional)">
    </div>
    <button type="button" class="button-success notes__button">Save</button>
    <button type="button" class="button-danger notes__button" data-note-id="${note._id}">Delete</button>
  </div>
  `
}

document.getElementById('new-note-form').addEventListener('submit', function (event) {
  event.preventDefault()
  const title = document.getElementById('title').value
  const text = document.getElementById('note').value
  const tags = document.getElementById('tags').value.split(/\s*,\s*/)

  request
    .post('https://notes-api.glitch.me/api/notes')
    .auth('hunter', 'password')
    .send({
      text: text,
      title: title,
      tags: tags
    })
    .then(response => {
      // console.log(response)
      document.getElementById('new-note-form').reset()
      NOTES.push(response.body)
      console.log(NOTES)
      notes(NOTES)
    })
    .catch((err) => {
      console.log(err)
    })
})
// "zvPZBfEy9aAOF9pc"

window.addEventListener('DOMContentLoaded', displayNotes())
