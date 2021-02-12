const main = () => {
    fetchQuotes()
    formListener()
    listenForClick()
}

const fetchQuotes = () => {
    fetch('http://localhost:3000/quotes?_embed=likes')
    .then(resp => resp.json())
    .then(quotes => quotes.forEach(quote => renderQuote(quote)))
}

// Render page w/ quotes w/ a fetch('http://localhost:3000/quotes?_embed=likes')
    // li class quote-card
    // blockquote class blockquote
    // p class mb-0
    // footer class blockquote-footer
    // br
    // button class btn-success Likes: <span>0</span></button>
    // delete button class btn-danger
    // end blockquote
    // end li

const renderQuote = (quote) => {
    const ul = document.getElementById('quote-list')
    const li = document.createElement('li')
    li.className = "quote-card"
    li.id = quote.id 

    const blkquote = document.createElement('BLOCKQUOTE')
    blkquote.className = "blockquote"

    const p = document.createElement('p')
    p.className = "mb-0"
    p.innerText = quote.quote

    const footer = document.createElement('footer')
    footer.className = "blockquote-footer"
    footer.innerText = quote.author

    const br = document.createElement('br')
    
    const likeBtn = document.createElement('button')
    likeBtn.className = "btn-success"
    likeBtn.dataset.id = quote.id 
    likeBtn.innerText = "Likes: "

    const span = document.createElement('span')
    span.innerText = quote.likes.length 
    

    const deleteBtn = document.createElement('button')
    deleteBtn.className = "btn-danger"
    deleteBtn.innerText = "Delete"
    deleteBtn.dataset.id = quote.id 
   

    likeBtn.append(span)
    blkquote.append(p, footer, br, likeBtn, deleteBtn)
    li.append(blkquote)
    ul.append(li)
}


// Submit Form creates a new quote & adds to list w/o a refresh. 
    // Display quote from backend update - pessimistic rendering
    // scrap the data into an newObj
    // send a POST request w/ newObj
    // render the return on the page

const formListener = () => {
    const form = document.getElementById('new-quote-form')
    
    form.addEventListener('submit', function(event) {
        event.preventDefault()
        
        const newQuote = {
            quote: event.target[0].value, 
            author: event.target[1].value
        }

        const requestObj = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(newQuote)
          }

          fetch('http://localhost:3000/quotes', requestObj)
          .then(resp => resp.json())
          .then(quote => {
            event.target.reset()

            const updatedQuote = {
                ...quote,
                likes: []
            }
              renderQuote(updatedQuote)
            
            })
    })
}


// On Click Delete button, removes quote from API & page w/o refresh
    // send a DELETE request w/ ID
    // remove from API & page

const listenForClick = () => {
    const list = document.getElementById('quote-list')
    list.addEventListener('click', function(event){
        if (event.target.className === 'btn-danger') {
            deleteQuote(event)
        } 
        else if (event.target.className == 'btn-success') {
            updateLike(event)
        }
    })
}

const deleteQuote = (event) => {
    const quoteId = event.target.dataset.id

    fetch(`http://localhost:3000/quotes/${quoteId}`, { method: 'DELETE' })
    .then(event.target.parentNode.parentNode.remove())
    
}

// On Click Like btn, creates a like for the quote.
// Updates API & displays on page w/o refresh.
    // POST to fetch('http://localhost:3000/likes')
    // body request JSON object w/ key of quoteID as integer value
    // use quoteId to create a like for quote 5
    // if quoteId is a string the index page will not include the like you like on any quote
    // BONUS: add a createdAt key to your object to track when the like was created

const updateLike = (event) => {
    const likeId = parseInt(event.target.dataset.id)

    const newLike = {
        quoteId: likeId
    }

    const requestObj = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newLike)
      }

      fetch('http://localhost:3000/likes', requestObj)
      .then(resp => resp.json())
      .then(event.target.firstElementChild.innerText = parseInt(event.target.firstElementChild.innerText, 10) + 1)

}


main()
