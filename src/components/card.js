// Функция создания карточки
function createCard(cardData, deleteCard, likeCard, openImagePopup, cardTemplate) {
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true);
  const cardImage = cardElement.querySelector('.card__image');
  const deleteButton = cardElement.querySelector('.card__delete-button');
  const cardTitle = cardElement.querySelector('.card__title');
  const likeButton = cardElement.querySelector('.card__like-button');

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;

  deleteButton.addEventListener('click', () => deleteCard(cardElement));
  likeButton.addEventListener('click', likeCard);
  cardImage.addEventListener('click', openImagePopup);

  return cardElement;
};

// Функция удаления карточки
function deleteCard(cardElement) {
  cardElement.remove();
};

// Функция обработки лайка
function handleLikeCard(evt) {
  evt.target.classList.toggle('card__like-button_is-active');
};

export {
  createCard,
  deleteCard,
  handleLikeCard
};