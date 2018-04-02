const renderItems = async () => {
  const items = await fetchAllItems()
  items.map(item => renderItemCard(item))
}

const fetchAllItems = async () => {
  const items = await fetch('/api/v1/items')

  if ( items.status === 200 ) {
    return await items.json()
  } else {
    throw new Error('could not get items')
  }
}

const addItem = async event => {
  event.preventDefault()

  const itemInput = document.querySelector('.item-input')

  const newItem = { item_name: itemInput.value, packed: false }
  const posted = await postItemFetch(newItem)
  renderItemCard(posted)
}

const postItemFetch = async item => {
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
  const isChecked = packed ? "checked" : "unchecked" 
    
  itemCard.innerHTML = `
    <div>
    <h2>${item_name}</h2>
      <button
        class="delete-btn"
        name="${id}"
        onclick="deleteItem(event)"
      >Delete</button>
    </div>
    <input 
      type="checkbox"
      class="toggle-packed"
      value=${isChecked}
      >Packed</input>
  `

  const togglePacked = itemCard.querySelector('.toggle-packed')

  togglePacked.addEventListener('click', () => togglePackedValue({id, packed}))
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


const deleteItemFetch = async id => {
  console.log(id)
  const deleted = await fetch(`/api/v1/items/${id}`, {
      method: "DELETE"
  })
  if ( deleted.status === 200 ) {
    return await deleted.json()
  } else {
    throw new Error('could not delete item')
  }
}

const togglePackedValue = ({ id, packed }) => {

}

document.onload = renderItems()
