document.getElementById('error-message').style.display = 'none';

const searchBook=()=>{
    const searchField =document.getElementById('search-field')
    const searchText =searchField.value;
     searchField.value='';
    document.getElementById('error-message').style.display = 'none';
    if (searchText == '') {
        // please write something to display
        document.getElementById('error-message').style.display = 'block';
    }
    else {
        const url =`https://openlibrary.org/search.json?q=${searchText}`;
     fetch(url)
     .then(res=>res.json())
     .then(data=>displayBooks(data.docs))
      .catch(error=>displayError(error));
    }
}
 const displayError = error => {
    document.getElementById('error-message').style.display = 'block';
} 






    const displayBooks = docs=>{
        //  console.log(docs) 
        const displayBooksName =document.getElementById('book-details')
         displayBooksName.innerText=docs.length
        if(docs.length==0){
            alert('book is not found')
        } 
        const totalResult = document.getElementById('totalResult')
    totalResult.innerText = docs.length
    document.getElementById('error-message').style.display = 'none';






         docs.slice(0,20).forEach(doc=>{ 



     console.log(doc)
     const div =document.createElement('div')
        div.classList.add('col')
        div.innerHTML=`
        <div class="card">
        <img class="card-img-top" src="https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg" alt="Card image cap">
          <div class="card-body">
            <h5 class="card-title"> BOOK Name :${doc.title}</h5>
            <p class="card-text"> Author Name:${doc.author_name[0]}</p>
             <p class="card-text"> Publisher:${doc.publisher[0]}</p> 
            <p class="card-text">First Publisher:${doc.first_publish_year}</p>
            
          </div>
        </div>
        `
            ;
       displayBooksName.appendChild(div);

         })
        } 



    

