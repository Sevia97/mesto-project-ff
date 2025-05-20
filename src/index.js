import {
  createCard,
  deleteCard,
  handleLikeCard
} from './components/card.js';

import { initialCards } from './components/initialCards.js';

import {   
  openModal, 
  closeModal,
  overlayClose
} from './components/modal.js';

import './pages/index.css';

// DOM узлы
const cardTemplate = document.querySelector('#card-template').content;
const placesList = document.querySelector('.places__list');
const editButton = document.querySelector('.profile__edit-button');
const addButton = document.querySelector('.profile__add-button');
const editPopup = document.querySelector('.popup_type_edit');
const newCardPopup = document.querySelector('.popup_type_new-card');
const closeButtons = document.querySelectorAll('.popup__close');
const imagePopup = document.querySelector('.popup_type_image');
const imagePopupImg = imagePopup.querySelector('.popup__image');
const imagePopupCaption = imagePopup.querySelector('.popup__caption');
const allPopups = document.querySelectorAll('.popup');

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
    handleImageClick,
    cardTemplate
  );
  placesList.append(cardElement);
});

// Инициализация попапов
function initModals() {
  allPopups.forEach(popup => {
    popup.classList.add('popup_is-animated');
  })
};
initModals();


// Функция открытия попапа с изображением
function handleImageClick(evt) {
  imagePopupImg.src = evt.target.src;
  imagePopupImg.alt = evt.target.alt;
  imagePopupCaption.textContent = evt.target.alt;
  openModal(imagePopup);
};

// Открытие попапов
editButton.addEventListener('click', function() {
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;
  openModal(editPopup);
});
addButton.addEventListener('click', () => openModal(newCardPopup));

// Закртыие попапов при клике на крести и оверлей
closeButtons.forEach(button => {
  button.addEventListener('click', () => {
    const popup = button.closest('.popup');
    closeModal(popup);
  });
});
overlayClose(allPopups);

// Обработчик редактирования профиля
function handleEditFormSubmit(evt) {
  evt.preventDefault();
  profileTitle.textContent = nameInput.value;
  profileDescription.textContent = jobInput.value;
  closeModal(editPopup);
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
    handleImageClick,
    cardTemplate
  );
  placesList.prepend(cardElement);

  closeModal(newCardPopup);
  newCardForm.reset();
};
newCardForm.addEventListener('submit', handleNewCardSubmit);
