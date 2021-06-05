// Variable Initialization
const openFormBtn = document.getElementById("openform"),
      closeFormBtn = document.getElementById("closeform"),
      form = document.getElementById("newBookForm"),
      booksDiv = document.getElementById("books")


function Book(title, author, pages) {
  this.title = title
  this.author = author
  this.pages = pages
}

async function renderBooks() {
  booksDiv.innerHTML = ''

  let bookLibrary = await getBooks()

  // If readStatuses not stored intialize the cookie with all false statuses
  if (!localStorage.getItem("readStatuses")) {
    let statuses = {}
    bookLibrary.forEach(book => {
      statuses[book.id] = false
    })

    localStorage.setItem("readStatuses", JSON.stringify(statuses))
  }

  bookLibrary.forEach(book => {
    const newBookDiv = document.createElement('div')

    newBookDiv.setAttribute("class","book")

    // getting read status from localStorage
    const currentBook = booksDiv.appendChild(newBookDiv)

    const titleP = currentBook.appendChild(document.createElement('p'))
    titleP.innerHTML = book.title

    const authorP = currentBook.appendChild(document.createElement('p'))
    authorP.innerHTML = book.author

    const pagesP = currentBook.appendChild(document.createElement('p'))
    pagesP.innerHTML = book.pages

    const readP = currentBook.appendChild(document.createElement('p'))
    if (getReadStatus(book.id)) {
      readP.innerHTML = "You have read this book"
    }
    else {
      readP.innerHTML = "You have not read this book"
    }

    const readButton = currentBook.appendChild(document.createElement('button'))
    readButton.innerHTML = "Toggle Read Status"
    readButton.addEventListener('click', function() {
      updateReadStatus(book.id, (!getReadStatus(book.id)))
    })
  }) 
    
  
}


form.addEventListener("submit", async (event) => {
  event.preventDefault()
  
  let formElements = event.target.elements
  newBook = new Book(
    formElements.title.value,
    formElements.author.value,
    formElements.pages.value,
  )

  pushBook(newBook)

  document.getElementById("form").style.display = "none"

  renderBooks()
})

openFormBtn.onclick = function() {
  document.getElementById("form").style.display = "block"
}
closeFormBtn.onclick = function() {
  document.getElementById("form").style.display = "none"
}

window.addEventListener('click', (event) => {
  if (event.target === document.getElementById('form')) {
    document.getElementById("form").style.display = "none"
  }
})




// New stuff for Firebase

const db = firebase.firestore();


function pushBook(book) {
  db.collection("books").add({
    title: book.title,
    author: book.author,
    pages: book.pages,
  })
  .then(docRef => {
    console.log("Document written with ID: ", docRef.id)
  })
  .catch(error => {
    console.error("Error adding document: ", error)
  })
}

async function getBooks() {
  let bookLibrary = []
  await db.collection("books").get()
  .then(query => {
    query.forEach(doc => {
      let book = doc.data()
      book.id = doc.id
      bookLibrary.push(book)
    })
  })
  return bookLibrary
}

// Storing read status in localStorage, based on ID from db
function updateReadStatus(bookID, bool) {
  let statuses = JSON.parse(localStorage.getItem("readStatuses"))
  statuses[bookID] = bool
  localStorage.setItem("readStatuses", JSON.stringify(statuses))
  renderBooks()
}

function getReadStatus(bookID) {
  let statuses = JSON.parse(localStorage.getItem("readStatuses"))
  if (statuses[bookID]) {
    return statuses[bookID]
  } else {
    return false
  }
}

renderBooks();

// sandbox