const isValidUrl = (inputElement) => {
  try {
    new URL(inputElement.value);
    return true;
  } catch (err) {
    return false;
  }
};

// Показать ошибку валидации
const showInputError = (formElement, inputElement, errorMessage, settings) => {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  if (!errorElement) {
    console.error(`Элемент ошибки для ${inputElement.id} не найден`);
    return;
  }
  
  inputElement.classList.add(settings.inputErrorClass);
  errorElement.textContent = errorMessage;
  errorElement.classList.add(settings.errorClass);
};

// Скрыть ошибку валидации
const hideInputError = (formElement, inputElement, settings) => {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  if (!errorElement) return;
  
  inputElement.classList.remove(settings.inputErrorClass);
  errorElement.textContent = '';
  errorElement.classList.remove(settings.errorClass);
};

// Проверка валидности текстового поля
const isValidTextInput = (inputElement) => {
  if (!inputElement.pattern) return true;
  
  const regex = new RegExp(inputElement.pattern);
  return regex.test(inputElement.value);
};

// Проверка валидности поля ввода
const checkInputValidity = (formElement, inputElement, settings) => {
  if (inputElement.validity.valueMissing) {
    showInputError(
      formElement,
      inputElement,
      inputElement.validationMessage,
      settings
    );
    return false;
  }

  if (inputElement.type === 'url' && !isValidUrl(inputElement)) {
    showInputError(
      formElement,
      inputElement,
      'Введите корректный URL',
      settings
    );
    return false;
  }

  if (inputElement.pattern && !isValidTextInput(inputElement)) {
    showInputError(
      formElement,
      inputElement,
      'Разрешены только латинские, кириллические буквы, знаки дефиса и пробелы',
      settings
    );
    return false;
  }

  if (!inputElement.validity.valid) {
    showInputError(
      formElement,
      inputElement,
      inputElement.validationMessage,
      settings
    );
    return false;
  }
  
  hideInputError(formElement, inputElement, settings);
  return true;
};

// Переключение состояния кнопки
const toggleButtonState = (inputList, buttonElement, settings) => {
  if (!buttonElement) return;
  
  const hasInvalidInput = inputList.some(inputElement => !inputElement.validity.valid);
  
  if (hasInvalidInput) {
    buttonElement.classList.add(settings.inactiveButtonClass);
    buttonElement.disabled = true;
  } else {
    buttonElement.classList.remove(settings.inactiveButtonClass);
    buttonElement.disabled = false;
  }
};

// Установка обработчиков событий для формы
const setEventListeners = (formElement, settings) => {
  const inputList = Array.from(formElement.querySelectorAll(settings.inputSelector));
  const buttonElement = formElement.querySelector(settings.submitButtonSelector);
  
  if (!buttonElement) return;

  toggleButtonState(inputList, buttonElement, settings);

  inputList.forEach((inputElement) => {
    inputElement.addEventListener('input', () => {
      checkInputValidity(formElement, inputElement, settings);
      toggleButtonState(inputList, buttonElement, settings);
    });
  });
};

// Включение валидации всех форм
export const enableValidation = (settings) => {
  const formList = Array.from(document.querySelectorAll(settings.formSelector));
  
  formList.forEach((formElement) => {
    setEventListeners(formElement, settings);
  });
};

// Очистка ошибок валидации формы
export const clearValidation = (formElement, settings) => {
  const inputList = Array.from(formElement.querySelectorAll(settings.inputSelector));
  const buttonElement = formElement.querySelector(settings.submitButtonSelector);
  
  if (!buttonElement) return;

  inputList.forEach((inputElement) => {
    hideInputError(formElement, inputElement, settings);
  });

  toggleButtonState([{ validity: { valid: false } }], buttonElement, settings);
};

