// Variable Initialization
const openFormBtn = document.getElementById("openform"),
      closeFormBtn = document.getElementById("closeform"),
      form = document.getElementById("newBookForm"),
      booksDiv = document.getElementById("books")


//
let bookLibrary = []

function Book(title, author, pages, read) {
  this.title = title
  this.author = author
  this.pages = pages
  this.read = read
}

Book.prototype.info = function() {
  var readStr
    if (this.read == true) {
      readStr = "you've read this"
    }
    else {
      readStr = "you have not read this yet"
    }
    console.log(
      this.title + " by " + this.author + ", " + this.pages + " pages, " + readStr
    )
}

const toggleRead = function(book) {
  if (book.read) {
    book.read = false
    console.log('read now false')
  }
  else {
    book.read = true
    console.log('read now true')
  }
  console.log(book)
  renderBooks()
}

const renderBooks = function() {
  booksDiv.innerHTML = ''

  for (let i = 0; i < bookLibrary.length; i++) {
    const newBookDiv = document.createElement('div')

    newBookDiv.setAttribute("class","book")
    
    const book = bookLibrary[i];
    const currentBook = booksDiv.appendChild(newBookDiv)

    const titleP = currentBook.appendChild(document.createElement('p'))
    titleP.innerHTML = book.title

    const authorP = currentBook.appendChild(document.createElement('p'))
    authorP.innerHTML = book.author

    const pagesP = currentBook.appendChild(document.createElement('p'))
    pagesP.innerHTML = book.pages

    const readP = currentBook.appendChild(document.createElement('p'))
    if (book.read) {
      readP.innerHTML = "You have read this book"
    }
    else {
      readP.innerHTML = "You have not read this book"
    }

    const readButton = currentBook.appendChild(document.createElement('button'))
    readButton.innerHTML = "Toggle Read Status"
    readButton.addEventListener('click', function() {toggleRead(book)})
  }
}


const theHobbit = new Book("The Hobbit", "J.R.R Tolkien", 295, true)

bookLibrary.push(theHobbit)



form.addEventListener("submit", (event) => {
  event.preventDefault()
  let readVar
  if (event.target.elements.read.checked) {
    readVar = true
  }
  else {
    readVar = false
  }
  let formElements = event.target.elements
  newBook = new Book(
    formElements.title.value,
    formElements.author.value,
    formElements.pages.value,
    readVar
  )

  bookLibrary.push(newBook)

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

renderBooks()