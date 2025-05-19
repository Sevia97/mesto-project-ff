const allPopups = document.querySelectorAll('.popup');

// Функция открытия попапа
function openPopup(popup) {
  popup.classList.add('popup_is-animated');
  setTimeout(() => {
    popup.classList.add('popup_is-opened');
    document.addEventListener('keydown', handleEscClose);
  }, 10);
};

// Функция закрытия попапа
function closePopup(popup) {
  popup.classList.remove('popup_is-opened');
  setTimeout(() => {
    popup.classList.remove('popup_is-animated');
    document.removeEventListener('keydown', handleEscClose);
  }, 600);
};

// Функция закрытия по Esc
function handleEscClose(evt) {
  if (evt.key === 'Escape') {
    const openedPopup = document.querySelector('.popup_is-opened');
    closePopup(openedPopup);
  }
};

// Закрытие по клику на оверлей
allPopups.forEach(popup => {
  popup.addEventListener('mousedown', (evt) => {
    if (evt.target === popup) {
      closePopup(popup);
    }
  });
});

export {
  openPopup,
  closePopup,
  handleEscClose,
};
