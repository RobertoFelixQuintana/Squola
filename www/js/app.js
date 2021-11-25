
const $$ = Dom7;

//Inicializar app
const app = new Framework7({
  root: '#app', // App Root Element
  name: 'framework7-core-tab-view', // App Name
  theme: 'auto', // Automatic Theme Detection

  data: function () {
    return {
      // App Root Data
    };
  },
  methods: {
    // App Root Methods
  },
  routes: routes, // App Routes
});

const threadsList = document.querySelector('.threads');
const signedInLinks = document.querySelectorAll('.signed-in');
const signedOutLinks = document.querySelectorAll('.signed-out');

const setUpUI = (user) => {
  if (user) {
    // Toggle UI Elements
    signedInLinks.forEach(item => item.style.display = 'inline');
    signedOutLinks.forEach(item => item.style.display = 'none');
  } else {
    // Toggle UI Elements
    signedInLinks.forEach(item => item.style.display = 'none');
    signedOutLinks.forEach(item => item.style.display = 'inline');
  }
}

// Upload Thread/Comment Image to Firebase Storage
const uploadImage = (folder, element, id, thread) => {
  let file = document.querySelector(element).files[0];
  console.log(file);
  if (file != undefined) {
    const ref = firebase.storage().ref(folder);
    const name = id + '.pdf';
    const metadata = { contentType: file.type };

    ref.child(name).put(file, metadata)
      .then(snapshot => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (progress == 100) {
          (folder == 'threads/') ? getThreads() : setUpComments(thread);
          app.dialog.close();
        }
      }).catch(error => console.log(error));
  } else setUpComments(thread);
}

// Delete Thread/Comment Image
const deleteImage = (folder, id) => {
  const ref = firebase.storage().ref(folder).child(id + '.pdf');
  // Delete the file
  ref.delete();
}

// Create New Thread
const newThread = () => {
  const createThreadForm = document.querySelector('#create-thread-form');
  const createThreadBtn = document.querySelector('#create-thread');

  createThreadBtn.addEventListener('click', () => {
    if (app.input.validate('#title') &&
      app.input.validate('#description') &&
      app.input.validate('#thread-img-upload')) {
      createThreadBtn.classList.add('disabled');
      db.collection('threads').add({
        user: firebase.auth().currentUser.uid,
        email: firebase.auth().currentUser.email,
        title: createThreadForm['title'].value,
        description: createThreadForm['description'].value,
        created: firebase.firestore.Timestamp.now()
      }).then(doc => {
        uploadImage('threads/', '#thread-img-upload', doc.id);
        createThreadForm.reset();
      });
    }
  });
}
  //Funcion search
  function Search() {
    // Declare variables
    var input,input2, filter, ul, li, b, i, txtValue;
    var cont=0;


    input = document.getElementById('buscador');    
    filter = input.value.toUpperCase();
    ul = document.getElementById("buscadorUl");
    ul2 = document.getElementById("buscadorUl2");
    ul2.innerHTML=`
    <div id="avisoUl" class="display">
      <h1 class="text-align-center">No hay estudiantes</h1>
    </div> `;
    input2 = document.getElementById('avisoUl');
    li = ul.getElementsByTagName('li');
    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < li.length; i++) {
      b = li[i].getElementsByTagName("b")[0];
      txtValue = b.textContent || b.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        li[i].style.display = "";
      } else {
        li[i].style.display = "none";
      } 
      if(li[i].style.display ==""){
        cont -=1;
      }else{
        cont +=1;
      }
    }
    console.log('cont',cont);
    console.log('length',li.length);
    if(cont!=li.length){
        input2.classList.add('display');
    }else{
      ul2.innerHTML=`
        <div id="avisoUl" class="item-inner">
          <h1 class="text-align-center">No hay estudiantes</h1>
        </div> `;
    }
 
  }
  

// Setting Up The Threads
const setUpThreads = (data) => {
  let count = 0;
  let html = "";
  data.forEach((doc) => {
    const thread = doc.data();
    let email = thread.email.split("@");
    let username = email[0];
    const li = `
      <li class="thread item-inner" id="${thread.user}">
          <a href="/thread/${doc.id}/" data-thread-id="${doc.id}" data-thread-name="${thread.title}" class="item-link thread-details">
            <div class="item-content "> 
              <div class="item-media item-block prior padding justify-content-center">
                <img src='assets/pdf.png' alt="pdf" class="lazy lazy-fade-in" height="60"/>
              </div>
              <div class="item-cell padding-left">
                  <div class="item-row">
                    <div id="titleBuscar" class="item-title"><b>${thread.title}</b>  
                      <div id="username" class="display-inline"><span><b>Publicado por: </b></span><u>${username}</u></div>
                    </div>
                    <div class="item-text">
                      ${thread.description}
                    </div>
                    <div class="H align-self-center color-theme-red">
                      <a href="#" class="delete-thread-dialog" data-thread-id="${doc.id}"><i class="icon f7-icons size-36">trash_circle_fill</i></a>
                    </div>
                  </div>
              </div> 
            </div>
          </a> 
      </li> `;
    html += li;
    count++;
  });
  threadsList.innerHTML =
    count == 0 ? noContent("No hay tareas", "Sube tu primer tarea!") : html;

  deleteOption(".thread", ".H");
};

// Setting History User
const setUpHistory= () => {

  db.collection('threads')
    .get()
    .then((snapshot) => {  
      let count = 0;
      let html = '';        
      let tarea;    
      const historyList= document.querySelector('.history');
      const noHistory = document.querySelector('.noContentHistory');

      console.log('snap',snapshot);
      snapshot.docs.forEach((doc) => {
        
        const thread = doc.data();
        if(firebase.auth().currentUser.uid==thread.user){
          tarea=true;
          const title= thread.title;
          const description = thread.description;
          const created= thread.created;
          const fecha=new Date(created.seconds*1000)
          noHistory.classList.remove('noContentHistory');
          noHistory.classList.remove('text-align-center');
          noHistory.classList.add('display');
          const li = `
          <li class="item-content">
                <div class="item-inner"> 
                  <div class="item-cell">
                      <div class="item-row">
                        <div class="item-title"><b>Titulo de la tarea: ${title}</b>  
                      </div>
                      </div>
                      <div class="item-row">
                        <div class="item-text">
                          Descripcion de la tarea: ${description}
                        </div>
                      </div>
                      <div class="item-row">
                        <div class="item-text">
                        Fecha de subidad de la tarea: ${fecha}
                        </div>
                      </div>
                  </div> 
                </div>
          </li> `;
        html += li;
        count++;
        }else{
          tarea=false;
          noHistory.classList.remove('display');
          noHistory.classList.add('noContentHistory');
          noHistory.classList.remove('text-align-center');
        }
      });
    historyList.innerHTML = count==0 ? tarea=false : html;
    });
}

// Setting Up The Thread Details
const setUpThreadDetails = (id) => {
  db.collection('threads')
    .where(firebase.firestore.FieldPath.documentId(), "==", id)
    .get()
    .then((snapshot) => {
      snapshot.docs.forEach((doc) => {
        const thread = doc.data();
        document.getElementById("thread-title").innerText = thread.title;
        document.getElementById("thread-description").innerText = thread.description;
      });
    });
}

// Add New Comment
const newComment = (id) => {
  $$(document).on('click', '#add-comment', function () {
    const addCommentForm = document.querySelector('#add-comment-form');
    const addCommentBtn = document.querySelector('#add-comment');

    if (app.input.validate('#description')) {
      addCommentBtn.classList.add('disabled');
      db.collection('comments').add({
        thread: id,
        user: firebase.auth().currentUser.uid,
        email: firebase.auth().currentUser.email,
        text: addCommentForm['description'].value,
        added: firebase.firestore.Timestamp.now(),
      }).then((doc) => {
        app.dialog.close();
        addCommentForm.reset();
      });
    }
  });
}

// Setting Up The Comments
const setUpComments = (id) => {
  db.collection('comments')
    .orderBy('added', 'asc')
    .get()
    .then(snapshot => {
      const commentsList = document.querySelector('.comments');
      let count = 0;
      let html = '';
      snapshot.docs.forEach(doc => {
        const comment = doc.data();
        let email = comment.email.split('@');
        let username = email[0];
        var options = {weekday: "long", year: "numeric", month: "long", day: "numeric"};
        if (id == comment.thread) {
          const li = `
          <div class="card demo-card-header-pic comment" id="${comment.user}">
            <div class="card-content card-content-padding">
              <img id="${doc.id}-img" src="./assets/comments-icon.png" class="float-left lazy lazy-fade-in enlarge-image" width="40" height="40"/>
              <p class="item-subtitle" id="comment-description">${comment.text}</p>
            </div>
            <p class="date" id="comment-date">${comment.added.toDate().toLocaleDateString("es-ES",options)}, ${username} <span id="trash-icon"> <i class="icon f7-icons size-22 color-red delete-comment-dialog" data-thread-id="${comment.thread}" data-comment-id="${doc.id}">trash</i></span></p>
          </div>`;
          html += li;
          count++;
        }
      });
      commentsList.innerHTML = (count == 0)
        ? noContent('Sin comentarios', 'Agrega uno para ser el primero!')
        : html;

      deleteOption('.comment', '#trash-icon');
    });
}


// Displaying Modal to Enlarge Image
$$(document).on('click', '.enlarge-image', function () {
  const newCommentBtn = document.querySelector('#new-comment');
  const modal = document.querySelector('#enlarge-image');
  const modalImage = document.querySelector('#modal-image');
  const span = document.getElementsByClassName('close')[0];

  newCommentBtn.classList.add('display');
  modal.style.display = "block";
  modalImage.src = this.src;

  span.onclick = () => {
    modal.style.display = "none";
    newCommentBtn.classList.remove('display');
  }
});

// Show Delete For Content Creator
const deleteOption = (element, content) => {
  const elements = document.querySelectorAll(element);

  auth.onAuthStateChanged(user => {
    if (user) {
      for (let i = 0; i < elements.length; i++) {
        if (elements[i].id == firebase.auth().currentUser.uid)
          elements[i].querySelector(content).classList.remove('display');
        else elements[i].querySelector(content).classList.add('display');
      }
    } else {
      for (let i = 0; i < elements.length; i++)
        elements[i].querySelector(content).classList.add('display');
    }
  });
}

// Delete A Comment or A Thread
const deleteContent = (collection, id) => {
  let toDelete = db.collection(collection).where(firebase.firestore.FieldPath.documentId(), '==', id);
  toDelete.get().then(snapshot => {
    snapshot.forEach(doc => {
      const data = doc.data();
      if (firebase.auth().currentUser.uid == data.user) {
        doc.ref.delete().then(() => {
          (collection == 'threads') ? getThreads() : setUpComments(data.thread);
        });
      }
    });
  });
}

// Display Text When There Is No Thread/Comment Added
const noContent = (title, text) => {
  return `
    <div class="card-content card-content-padding text-align-center">
      <div class="item-title"><b>${title}</b></div>    
      <p class="item-subtitle" id="text">${text}</p>
    </div>
  `;
}

// Event Listeners
// Reload Home
$$(document).on('click', '.back-link', function () {
  $$(document).on('page:init', '.page[data-name="home"]', function () {
    window.location.reload();
  });
});
// Reload Home NavLinks
$$(document).on('click', '.home', function () {
  $$(document).on('page:init', '.page[data-name="home"]', function () {
    window.location.reload();
  });
});

// Get Data for Thread Details Page
$$(document).on('click', '.thread-details', function () {
  const id = $$(this).data('thread-id');
  setUpThreadDetails(id);
  setUpComments(id);
  newComment(id);  
});

// Pop Up With Swipe To Close
const loginSwipeToClosePopup = app.popup.create({
  el: '.login-popup',
  swipeToClose: true,
});

// Dialogs 
// Open a Dialog For Adding a New Thread
$$('.new-thread-dialog').on('click', function () {

  app.dialog.create({
    content: `' <div class="page-content login-screen-content"> <div class="title">Nueva Tarea</div> <form class="list" id="create-thread-form"> <div class="list" id="dialog-list"> <ul> <li class="item-content item-input"> <div class="item-inner"> <div class="item-input-wrap"> <input type="text" id="title" name="title" placeholder="Titulo de Tarea" required validate/> </div> </div> </li> <li class="item-content item-input"> <div class="item-inner"> <div class="item-input-wrap"> <textarea id="description" name="description" placeholder="Descripcion" required validate></textarea> </div> </div> </li> <li class="item-content item-input"> <input class="list-button" type="file" accept="application/pdf" id="thread-img-upload" required validate> </li> </ul>  <div class="row display-flex justify-content-center margin-top"> <a class="button" id="create-thread" href="#">Subir Tarea</a> <a class="button" id="cancel-thread" href="#">Cancelar</a> </div> </form> </div>'`,
    cssClass: 'dialog'
  }).open();
  newThread();
});
//Open history user
$$('.new-history-content').on('click', function () {
  setUpHistory();
});

// Close The Thread Dialog
$$(document).on('click', '#cancel-thread', function () {
  app.dialog.close();
});

// Open a Dialog For Adding a New Comment
$$(document).on('click', '.new-comment-dialog', function () {
  app.dialog.create({
    content: '<div class="page-content login-screen-content"> <div class="title">Agregar Comentario</div> <form class="list" id="add-comment-form"> <div class="list" id="dialog-list"> <ul> <li class="item-content item-input"> <div class="item-inner"> <div class="item-input-wrap"> <textarea id="description" name="description" placeholder="Escribe tu comentario" required validate></textarea> </div> </div> </li> <li class="item-content item-input"> <div class="item-inner"> </li> </ul> </div> <div class="row display-flex justify-content-center"> <a class="button" id="add-comment" href="#">Enviar</a>  <a class="button" id="cancel-comment" href="#">Cancelar</a></div> </form> </div>',
    cssClass: 'dialog'
  }).open();
});

// Close The Comment Dialog
$$(document).on('click', '#cancel-comment', function () {
  app.dialog.close();
});

// Confirmation Dialog For Deleting a Thread
$$(document).on('click', '.delete-thread-dialog', function () {
  let id = $$(this).data('thread-id');
  app.dialog.confirm('¿Esta seguro de borrar esta tarea?', '', function () {
    deleteContent('threads', id);
    deleteImage('threads/', id);
  });
});

// Confirmation Dialog For Deleting a Comment
$$(document).on('click', '.delete-comment-dialog', function () {
  let thread = $$(this).data('thread-id');
  let id = $$(this).data('comment-id');
  let image = $$(this).data('comment-img');
  app.dialog.confirm('Esta seguro de borrar este comentario?', '', function () {
    deleteContent('comments', id);
    (image == 'true') ? deleteImage('comments/', id) : setUpComments(thread);
  });
});




