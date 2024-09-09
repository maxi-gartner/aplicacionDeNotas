/* 
para crear nuevas notas necesito: 
capturar el input de titulo y contenido de la nota 
capturar el boton que añade una nueva nota 
crear una funcion para agregar la nueva nota al array "notes" guardar las notas en localstorage

para eliminar notas existentes: 
asignar un boton de eliminar en cada nota al momento de renderizarlas 
crear una funcion deleteNote() para eliminar una nota del array "notes" 
actualizar localstorage y volver a renderizar las notas

marcar notas como realizadas o incompletas: 
añadir un boton de estado (completada/incompleta) 
en cada nota crear una funcion changeState() para cambiar el estado de la nota 
actualizar localstorage y renderizar las notas

buscar notas por texto: 
capturar el campo de busqueda y escuchar el evento 
filtrar el array "notes" segun el texto que se ingresa renderizar las notas filtradas

filtrar notas completadas: 
capturar el checkbox de notas completadas 
filtrar el array notes para mostrar solo las notas con state true 
permitir la combinacion de busqueda por texto y estado de nota

persistencia de datos: 
guardar y recuperar notas del localstorage 
cargar las notas del localstorage al iniciar la aplicacion 
actualizar localstorage cada vez que se agregue, elimine o modifique una nota
*/

//console.log("funcionando");

const titleNote = document.getElementById("titleNote");
const contentNote = document.getElementById("contentNote");
const addNote = document.getElementById("addNote");
const searchNotesInput = document.getElementById("searchNotesInput");
const searchNotesBtn = document.getElementById("searchNotesBtn");
const inputCheckboxCompleted = document.getElementById(
  "inputCheckboxCompleted"
);
const btnDeleteNote = document.querySelectorAll(".btnDeleteNote");
const btnState = document.querySelectorAll(".btnState");
const notesList = document.getElementById("notesList");

const examples = [
  {
    id: 0,
    title: "Nota 1",
    content: "Este es un ejemplo de contenido en la nota 1",
    state: false,
  },
  {
    id: 1,
    title: "Nota 2",
    content: "Este es un ejemplo de contenido en la nota 2",
    state: true,
  },
  {
    id: 2,
    title: "Nota 3",
    content: "Este es un ejemplo de contenido en la nota 3",
    state: false,
  },
];

let notes = localStorage.getItem("notes")
  ? JSON.parse(localStorage.getItem("notes"))
  : [];
//console.log("notes", notes);

let id = notes[notes.length - 1]?.id || 0;
//console.log("id", id);

const firstRender = (data) => {
  if (notes.length === 0) {
    notes = data;
    localStorage.setItem("notes", JSON.stringify(data));
    data ? renderNotes(data) : null;
  } else {
    renderNotes(notes);
  }
};
firstRender(examples);

/* Generando Nuevas notas */
addNote.addEventListener("click", () => {
  saveNotes(titleNote.value, contentNote.value);
});

function renderNotes(data) {
  const fragment = document.createDocumentFragment();

  data.forEach((element) => {
    const note = document.createElement("div");
    note.className =
      "noteTemplate relative p-6 bg-white rounded-lg shadow-md text-black h-auto overflow-hidden w-64 flex flex-col justify-between";
    note.id = element.id;

    const buttonDelete = document.createElement("button");
    buttonDelete.className =
      "btnDeleteNote absolute top-2 right-2 text-red-600 p-2 hover:text-red-800 transition-colors duration-300";
    buttonDelete.innerHTML = '<i class="fas fa-trash-alt"></i>';
    buttonDelete.addEventListener("click", () => {
      deleteNote(element);
    });

    const buttonState = document.createElement("button");
    buttonState.className = element.state
      ? "btnState py-2 px-4 rounded bg-green-500 text-white mt-4 hover:bg-green-800 transition-colors duration-300"
      : "btnState py-2 px-4 rounded bg-red-500 text-white mt-4 hover:bg-red-800 transition-colors duration-300";
    buttonState.textContent = element.state ? "Completada" : "Incompleta";

    buttonState.addEventListener("click", () => {
      changeState(element);
    });

    const title = document.createElement("h2");
    title.className =
      "titleNote text-center text-xl font-semibold mt-4 text-gray-800";
    title.textContent = element.title;

    const content = document.createElement("p");
    content.className = "contentNote mt-2 text-gray-600 text-sm";
    content.textContent = element.content;

    note.appendChild(buttonDelete);
    note.appendChild(title);
    note.appendChild(content);
    note.appendChild(buttonState);

    fragment.appendChild(note);
  });

  notesList.innerHTML = "";
  notesList.appendChild(fragment);
}

function saveNotes(title, content) {
  const newNote = {
    id: ++id,
    title,
    content,
    state: false,
  };
  localStorage.setItem("notes", JSON.stringify([...notes, newNote]));
  notes.push(newNote);
  titleNote.value = "";
  contentNote.value = "";
  //console.log("notes", notes);
  renderNotes(notes);
}

function changeState(element) {
  notes = notes.map((note) => {
    if (note.id === element.id) {
      return {
        ...note,
        state: !note.state,
      };
    }
    return note;
  });
  localStorage.setItem("notes", JSON.stringify(notes));
  renderNotes(notes);
  searchNotesInput.value = "";
  inputCheckboxCompleted.checked = false;
}
function deleteNote(element) {
  const index = notes.indexOf(element);
  notes.splice(index, 1);
  localStorage.setItem("notes", JSON.stringify(notes));
  renderNotes(notes);
  searchNotesInput.value = "";
  inputCheckboxCompleted.checked = false;
}

/* Buscar Notas(filtros) */
searchNotesInput.addEventListener("keyup", () => {
  //console.log("searchNotesInput.value", searchNotesInput.value);
  let filteredNotes = notes;

  if (inputCheckboxCompleted.checked) {
    //console.log("esta cehckeado");
    filteredNotes = notes.filter((note) => note.state);
    //console.log("filteredNotes", filteredNotes);
  }
  if (searchNotesInput.value.length === 0) {
    renderNotes(inputCheckboxCompleted.checked ? filteredNotes : notes);
  }

  filteredNotes = filteredNotes.filter((note) =>
    note.title.toLowerCase().includes(searchNotesInput.value.toLowerCase())
  );
  renderNotes(filteredNotes);
});

inputCheckboxCompleted.addEventListener("change", () => {
  //console.log("inputCheckboxCompleted", inputCheckboxCompleted.checked);
  let filteredNotes = notes;
  if (inputCheckboxCompleted.checked) {
    filteredNotes = notes.filter((note) => note.state);
  }
  if (searchNotesInput.value.length > 0) {
    filteredNotes = filteredNotes.filter((note) =>
      note.title.toLowerCase().includes(searchNotesInput.value.toLowerCase())
    );
  }
  renderNotes(filteredNotes);
});
