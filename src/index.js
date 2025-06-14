import { createCard, deleteCard, handleLikeCard, handleDeleteCard } from './components/card.js';
import { openModal, closeModal, overlayClose } from './components/modal.js';
import { enableValidation, clearValidation } from './components/validation.js';
import './pages/index.css';
import { 
  getUserInfo, 
  getInitialCards, 
  updateUserProfile, 
  addNewCard, 
  deleteCardFromServer, 
  likeCard, 
  unlikeCard, 
  updateUserAvatar, 
  checkImageUrl 
} from './components/api.js';

const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
};

const elements = {
  cardTemplate: document.querySelector('#card-template').content,
  placesList: document.querySelector('.places__list'),
  editButton: document.querySelector('.profile__edit-button'),
  addButton: document.querySelector('.profile__add-button'),
  editPopup: document.querySelector('.popup_type_edit'),
  newCardPopup: document.querySelector('.popup_type_new-card'),
  closeButtons: document.querySelectorAll('.popup__close'),
  imagePopup: document.querySelector('.popup_type_image'),
  imagePopupImg: document.querySelector('.popup_type_image .popup__image'),
  imagePopupCaption: document.querySelector('.popup_type_image .popup__caption'),
  allPopups: document.querySelectorAll('.popup'),
  profileTitle: document.querySelector('.profile__title'),
  profileDescription: document.querySelector('.profile__description'),
  editForm: document.forms['edit-profile'],
  nameInput: document.querySelector('.popup__input_type_name'),
  jobInput: document.querySelector('.popup__input_type_description'),
  newCardForm: document.forms['new-place'],
  cardNameInput: document.querySelector('.popup__input_type_card-name'),
  cardLinkInput: document.querySelector('.popup__input_type_url'),
  avatarPopup: document.querySelector('.popup_type_avatar'),
  avatarForm: document.forms['avatar-form'],
  avatarInput: document.querySelector('.popup__input_type_avatar-url'),
  profileImage: document.querySelector('.profile__image')
};

let currentUserId = null;

function checkElements() {
  Object.entries(elements).forEach(([key, element]) => {
    if (!element && key !== 'allPopups' && key !== 'closeButtons') {
      console.error(`Элемент ${key} не найден`);
    }
  });
}

function renderInitialCards(cards, userId) {
  if (!elements.placesList) {
    console.error('Элемент placesList не найден');
    return;
  }
  
  elements.placesList.innerHTML = '';
  
  if (!cards || !Array.isArray(cards)) {
    console.error('Некорректные данные карточек:', cards);
    return;
  }
  
  cards.forEach(cardData => {
    try {
      const cardElement = createCard(
        cardData,
        handleDeleteCard,
        (likeButton, cardId, likeCount) => handleLikeCard(likeButton, cardId, likeCount, currentUserId),
        handleImageClick,
        elements.cardTemplate,
        currentUserId
      );
      
      if (cardElement) {
        elements.placesList.append(cardElement);
      }
    } catch (error) {
      console.error('Ошибка при создании карточки:', error, cardData);
    }
  });
}

function initModals() {
  elements.allPopups.forEach(popup => {
    popup.classList.add('popup_is-animated');
  });
}

function showError(formElement, message) {
  const errorElement = document.createElement('div');
  errorElement.className = 'popup__error popup__error_visible';
  errorElement.textContent = message;
  formElement.appendChild(errorElement);
  
  setTimeout(() => errorElement.remove(), 3000);
}

function handleButtonState(submitButton, isLoading, loadingText = 'Сохранение...') {
  if (isLoading) {
    submitButton.dataset.originalText = submitButton.textContent;
    submitButton.textContent = loadingText;
    submitButton.disabled = true;
  } else {
    submitButton.textContent = submitButton.dataset.originalText || submitButton.textContent;
    submitButton.disabled = false;
  }
}

async function handleEditFormSubmit(evt) {
  evt.preventDefault();
  const submitButton = evt.submitter;
  
  try {
    handleButtonState(submitButton, true, 'Сохранение...');
    
    const updatedUser = await updateUserProfile(
      elements.nameInput.value,
      elements.jobInput.value
    );
    
    elements.profileTitle.textContent = updatedUser.name;
    elements.profileDescription.textContent = updatedUser.about;
    closeModal(elements.editPopup);
  } catch (error) {
    console.error('Ошибка при обновлении профиля:', error);
    showError(evt.target, 'Не удалось сохранить изменения');
  } finally {
    handleButtonState(submitButton, false);
  }
}

async function handleNewCardSubmit(evt) {
  evt.preventDefault();
  const submitButton = evt.submitter;
  
  try {
    handleButtonState(submitButton, true, 'Сохранение...');
    
    const newCardData = {
      name: elements.cardNameInput.value,
      link: elements.cardLinkInput.value
    };

    const serverCardData = await addNewCard(newCardData.name, newCardData.link);
    serverCardData.owner = { _id: currentUserId };
    
    const cardElement = createCard(
      serverCardData, 
      handleDeleteCard,
      handleLikeCard,
      handleImageClick,
      elements.cardTemplate,
      currentUserId
    );
    
    if (cardElement) {
      elements.placesList.prepend(cardElement);
      closeModal(elements.newCardPopup);
      elements.newCardForm.reset();
    }
  } catch (error) {
    console.error('Ошибка при создании карточки:', error);
    showError(evt.target, 'Не удалось создать карточку');
  } finally {
    handleButtonState(submitButton, false);
  }
}

async function handleAvatarFormSubmit(evt) {
  evt.preventDefault();
  const submitButton = evt.submitter;
  
  try {
    handleButtonState(submitButton, true, 'Сохранение...');
    
    const newAvatarUrl = elements.avatarInput.value;
    const updatedUser = await updateUserAvatar(newAvatarUrl);
    if (elements.profileImage && updatedUser.avatar) {
      await new Promise((resolve, reject) => {
        const testImage = new Image();
        testImage.onload = () => {
          elements.profileImage.style.backgroundImage = `url('${updatedUser.avatar}')`;
          resolve();
        };
        testImage.onerror = () => {
          reject(new Error('Изображение не загружается'));
        };
        testImage.src = updatedUser.avatar;
      });
      
      closeModal(elements.avatarPopup);
    }
  } catch (error) {
    console.error('Ошибка при обновлении аватара:', error);
    showError(evt.target, error.message || 'Не удалось обновить аватар');
  } finally {
    handleButtonState(submitButton, false);
  }
}

function handleImageClick(cardData) {
  if (!elements.imagePopupImg || !elements.imagePopupCaption) return;
  
  elements.imagePopupImg.src = cardData.link;
  elements.imagePopupImg.alt = cardData.name;
  elements.imagePopupCaption.textContent = cardData.name;
  openModal(elements.imagePopup);
}

function setupEventListeners() {
  if (elements.editButton && elements.editPopup) {
    elements.editButton.addEventListener('click', () => {
      elements.nameInput.value = elements.profileTitle.textContent;
      elements.jobInput.value = elements.profileDescription.textContent;
      clearValidation(elements.editForm, validationConfig);
      openModal(elements.editPopup);
    });
  }

  if (elements.addButton && elements.newCardPopup) {
    elements.addButton.addEventListener('click', () => {
      elements.newCardForm.reset();
      clearValidation(elements.newCardForm, validationConfig);
      openModal(elements.newCardPopup);
    });
  }

  if (elements.profileImage) {
    elements.profileImage.addEventListener('click', () => {
      elements.avatarForm.reset();
      clearValidation(elements.avatarForm, validationConfig);
      openModal(elements.avatarPopup);
    });
  }

  elements.closeButtons.forEach(button => {
    button.addEventListener('click', () => {
      const popup = button.closest('.popup');
      if (popup) closeModal(popup);
    });
  });

  overlayClose(elements.allPopups);

  elements.editForm?.addEventListener('submit', handleEditFormSubmit);
  elements.newCardForm?.addEventListener('submit', handleNewCardSubmit);
  elements.avatarForm?.addEventListener('submit', handleAvatarFormSubmit);
}

async function initApp() {
  try {
    const [userData, cards] = await Promise.all([
      getUserInfo().catch(error => {
        console.error('Ошибка загрузки данных пользователя:', error);
        return null;
      }),
      getInitialCards().catch(error => {
        console.error('Ошибка загрузки карточек:', error);
        return [];
      })
    ]);
    
    if (!userData) {
      throw new Error('Не удалось загрузить данные пользователя');
    }
    
    currentUserId = userData._id;
    
    if (elements.profileTitle) {
      elements.profileTitle.textContent = userData.name || 'Жак-Ив Кусто';
    }
    
    if (elements.profileDescription) {
      elements.profileDescription.textContent = userData.about || 'Исследователь океана';
    }
    
    if (elements.profileImage && userData.avatar) {
      elements.profileImage.style.backgroundImage = `url('${userData.avatar}')`;
    }
    
    renderInitialCards(cards, currentUserId);
    checkElements();
    initModals();
    setupEventListeners();
    enableValidation(validationConfig);
    
  } catch (error) {
    console.error('Ошибка при инициализации приложения:', error);
    alert('Произошла ошибка при загрузке приложения. Пожалуйста, перезагрузите страницу.');
  }
}

document.addEventListener('DOMContentLoaded', initApp);