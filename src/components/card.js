import { deleteCardFromServer, likeCard, unlikeCard } from './api.js';

export function deleteCard(cardElement, cardId) {
  return deleteCardFromServer(cardId)
    .then(() => {
      cardElement.remove();
    })
    .catch(error => {
      console.error('Ошибка при удалении карточки:', error);
      throw error;
    });
}

export function handleDeleteCard(element, id) {
  return deleteCard(element, id).catch(console.error);
}

export function handleLikeCard(likeButton, cardId, likeCountElement, currentUserId) {
  const isLiked = likeButton.classList.contains('card__like-button_is-active');
  const likePromise = isLiked ? unlikeCard(cardId) : likeCard(cardId);
  
  likeButton.disabled = true;
  
  return likePromise
    .then(updatedCard => {
      likeCountElement.textContent = updatedCard.likes.length;
      likeButton.classList.toggle('card__like-button_is-active', 
        updatedCard.likes.some(user => user._id === currentUserId));
    })
    .catch(error => {
      console.error('Ошибка при обновлении лайка:', error);
      throw error;
    })
    .finally(() => {
      likeButton.disabled = false;
    });
}

export function createCard(cardData, deleteCallback, likeCallback, openImageCallback, template, currentUserId) {
  if (!cardData || !cardData._id) {
    console.error('Некорректные данные карточки');
    return null;
  }
  
  const cardElement = template.querySelector('.card').cloneNode(true);
  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const deleteButton = cardElement.querySelector('.card__delete-button');
  const likeButton = cardElement.querySelector('.card__like-button');
  const likeCount = cardElement.querySelector('.card__like-count');

  // Заполняем данные карточки
  cardImage.src = cardData.link || '';
  cardImage.alt = cardData.name || 'Фотография места';
  cardTitle.textContent = cardData.name || 'Без названия';
  likeCount.textContent = cardData.likes?.length || 0;

  // Обработчики событий
  cardImage.addEventListener('click', () => openImageCallback(cardData));
  likeButton.addEventListener('click', () => likeCallback(likeButton, cardData._id, likeCount, currentUserId));

  // Настройка кнопки удаления
  if (cardData.owner && cardData.owner._id === currentUserId) {
    deleteButton.style.display = 'block';
    deleteButton.addEventListener('click', (e) => {
      e.stopPropagation();
      deleteCallback(cardElement, cardData._id);
    });
  } else {
    deleteButton.style.display = 'none';
  }

  // Проверка лайков
  if (cardData.likes?.some(user => user._id === currentUserId)) {
    likeButton.classList.add('card__like-button_is-active');
  }

  return cardElement;
}