import {   
  initialCards,
  createCard,
  deleteCard,
  handleLikeCard
} from './components/scripts/cards.js';

import {   
  openPopup,
  closePopup,
  handleEscClose,
} from './components/scripts/modal.js';

import './pages/index.css';

// DOM узлы
const cardTemplate = document.querySelector('#card-template').content;
const placesList = document.querySelector('.places__list');
const editButton = document.querySelector('.profile__edit-button');
const addButton = document.querySelector('.profile__add-button');
const editPopup = document.querySelector('.popup_type_edit');
const newCardPopup = document.querySelector('.popup_type_new-card');
const imagePopup = document.querySelector('.popup_type_image');
const closeButtons = document.querySelectorAll('.popup__close');

// Элементы профиля
const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
// Форма редактирования профиля
const editForm = document.forms['edit-profile'];
const nameInput = editForm.querySelector('.popup__input_type_name');
const jobInput = editForm.querySelector('.popup__input_type_description');
// Форма добавления карточки
const newCardForm = document.forms['new-place'];
const cardNameInput = newCardForm.querySelector('.popup__input_type_card-name');
const cardLinkInput = newCardForm.querySelector('.popup__input_type_url');

// Вывод карточки на страницу
initialCards.forEach(cardData => {
  const cardElement = createCard(
    cardData, 
    deleteCard, 
    handleLikeCard, 
    handleImageClick
  );
  placesList.append(cardElement);
});

// Функция открытия попапа с изображением
function handleImageClick(evt) {
  const imagePopupImg = imagePopup.querySelector('.popup__image');
  const imagePopupCaption = imagePopup.querySelector('.popup__caption');
  
  imagePopupImg.src = evt.target.src;
  imagePopupImg.alt = evt.target.alt;
  imagePopupCaption.textContent = evt.target.alt;
  
  openPopup(imagePopup);
};

// Открытие попапов
editButton.addEventListener('click', () => openPopup(editPopup));
addButton.addEventListener('click', () => openPopup(newCardPopup));

// Открытие попапа редактирования профиля
editButton.addEventListener('click', () => {
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;
  openPopup(editPopup);
});

// Закрытие по крестику
closeButtons.forEach(button => {
  button.addEventListener('click', () => {
    const popup = button.closest('.popup');
    closePopup(popup);
  });
});

// Обработчик редактирования профиля
function handleEditFormSubmit(evt) {
  evt.preventDefault();
  const newName = nameInput.value;
  const newDescription = jobInput.value;
  profileTitle.textContent = newName;
  profileDescription.textContent = newDescription;
  closePopup(editPopup);
};
editForm.addEventListener('submit', handleEditFormSubmit);

// Обработчик формы добавления карточки
function handleNewCardSubmit(evt) {
  evt.preventDefault();
  const newCardData = {
    name: cardNameInput.value,
    link: cardLinkInput.value
  };
  const cardElement = createCard(
    newCardData, 
    deleteCard, 
    handleLikeCard, 
    handleImageClick
  );
  placesList.prepend(cardElement);

  closePopup(newCardPopup);
  newCardForm.reset();
};
newCardForm.addEventListener('submit', handleNewCardSubmit);