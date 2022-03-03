const quotesUL = document.getElementById('quote-list')
const quotesForm = document.querySelector("#new-quote-form")


function turnQuoteToHTML(quote){
    let quoteLi = document.createElement("li")
    quoteLi.className = "quote-card" 
    
    quoteLi.innerHTML = `<blockquote class="blockquote">
    <p class="mb-0">${quote.quote}</p>
    <footer class="blockquote-footer">${quote.author}</footer>
    <br>
    <button class='btn-success'>Likes: <span>${quote.likes.length}</span></button>
    <button class='btn-danger'>Delete</button>
    </blockquote>`
    
    quotesUL.append(quoteLi)
    
    
    let likeButton = quoteLi.querySelector(".btn-success")
    likeButton.addEventListener("click", () => {
        
        fetch(`http://localhost:3000/likes`, {
            method: "POST", 
            headers: {
                "content-type": "application/json",
                "accept": "application/json"
            },
            body: JSON.stringify({
                quoteId: quote.id
            })
        }) // end of fetch
        .then(r => r.json())
        .then((likeObj) => {
            quote.likes.push(likeObj)
            let span = quoteLi.querySelector("span")
            span.innerText = quote.likes.length
        })
        
    }) // end of addEventListener
    
    let deleteButton = quoteLi.querySelector(".btn-danger")
    deleteButton.addEventListener("click", () => {
        fetch(`http://localhost:3000/quotes/${quote.id}`, {
            method: "DELETE"
        }) // end of fetch
        .then(r => r.json())
        .then((respObj) => {
            quoteLi.remove()
        })
    })
    
}

fetch(`http://localhost:3000/quotes?_embed=likes`)
.then(res => res.json())
.then((quotesArr) => {
    quotesArr.forEach((quote) => {
        turnQuoteToHTML(quote)
    })
})


quotesForm.addEventListener("submit", (e) => {
    e.preventDefault()
    let newAuthor = e.target["author"].value
    let newQuote = e.target["new-quote"].value

    fetch(`http://localhost:3000/quotes`, {
        method: "POST", 
        headers: {
            "content-type": "application/json",
            "accept": "application/json"
        },
        body: JSON.stringify({
            quote: newQuote,
            author: newAuthor
        })
    })
    .then(res => res.json())
    .then((quote) => {
        quote.likes = []
        turnQuoteToHTML(quote)
    })
})