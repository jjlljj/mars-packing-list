const addItem = async event => {
  event.preventDefault()

  const itemInput = document.querySelector('.item-input')

  const newItem = { item_name: itemInput.value, packed: false }
  const posted = await postItem(newItem)
  console.log(posted)
  renderItemCard(posted)

}

const postItem = async item => {
  const posted = await fetch('/api/v1/items', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item)
  })
  if ( posted.status === 201 ) {
    return await posted.json()
  } else {
    throw new Error('could not add item')
  }
}


const renderItemCard = ({ id, item_name, packed }) => {
  const marsCardSection = document.querySelector('.mars-cards-section')
  const itemCard = document.createElement('div')
  itemCard.setAttribute('class', `item${id} item-card`) 

  itemCard.innerHTML = `
    <h2>${item_name}</h2>
    <button
      class="delete-btn"
      name="${id}"
      onclick="deleteItem(event)"
    >Delete</button>
    <input 
      type="checkbox"
      class="toggle-packed"
      >Packed</input>
  `
  marsCardSection.appendChild(itemCard)
}

const deleteItem = event => {
  event.preventDefault()
  const id = event.target.name

  deleteItemCard(id)
  deleteItemFetch(id)
}

const deleteItemCard = id => {
  const itemCard = document.querySelector(`.item${id}`)
  const marsCardSection = document.querySelector('.mars-cards-section')

  marsCardSection.removeChild(itemCard)
}


const deleteItemFetch = id => {

}
