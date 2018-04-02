const addItem = event => {
  event.preventDefault()

  const itemInput = document.querySelector('.item-input')

  const newItem = { item_name: itemInput.value, packed: false }
  console.log(newItem)

}

const renderCard = item => {

}
