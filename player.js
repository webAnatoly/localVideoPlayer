const localFileVideoPlayer = () => {
  const URL = window.URL || window.webkitURL;
  const videoNode = document.querySelector('video');
  const subTrackElem = document.querySelector('#subTrack');
  const message = document.querySelector('.playerContainer > .playerContainer__message');
  const lastPlayedFileHolder = document.querySelector('.lastPlayedFile');

  const setVideoInCenter = () => {
    /* Нужно вычислить серидину окна браузера и с учетом этих координат
    проскроллить горизонтальную и вертикальную прокрутки после загрузки страницы
    чтобы видео-фрейм оказался в середине экрана.
    Но пока что просто прокручиваем видео в цент относительно документа.
    */

    /* Вызов через setTimeout для того, чтобы функция scrollTo
    вызывалась после того как применятся css стили */
    setTimeout(() => { window.scrollTo(1400, 700); }, 0);
  };

  const addPlayedFileNameToLocalStorage = (fileName) => {
    window.localStorage.setItem('lastPlayedFile', fileName);
  };

  function playSelectedFile() {
    let videoFile;
    let subFile;
    setVideoInCenter();
    /* Взять только первые два файла из загруженных пользователем.
    Предпологается, что один из них видео файл, другой субтитры. */
    for (let i = 0; i < this.files.length; i += 1) {
      const canPlay = videoNode.canPlayType(this.files[i].type);
      if (canPlay === 'maybe') {
        videoFile = this.files[i];
        message.innerHTML = `Now play: <span class="emphasized">${videoFile.name}</span>`;
        addPlayedFileNameToLocalStorage(videoFile.name);
      }
      if (canPlay === '') { subFile = this.files[i]; }
      if (i > 1) { break; }
    }

    if (videoFile) {
      const videoFileURL = URL.createObjectURL(videoFile);

      if (subFile) {
        subTrackElem.src = URL.createObjectURL(subFile);
      }
      videoNode.src = videoFileURL;
      /* для Firefoxe. Воспроизвести видео сразу после загрузки файла пользователем */
      videoNode.addEventListener('loadeddata', () => {
        videoNode.play();
      });
    }
    return null;
  }
  const inputNode = document.querySelector('input');
  inputNode.addEventListener('change', playSelectedFile, false);

  const pauseByClick = (event) => {
    if (event.target.tagName === 'VIDEO') {
      const video = event.target;
      const { paused } = video;
      if (!paused) {
        video.pause();
      } else {
        video.play();
      }
    }
  };

  /* Пауза при нажатии пробела и перемотка при нажатии стрелок */
  const handleKeyDown = (event) => {
    event.preventDefault();
    switch (event.code) {
      case 'Space': {
        const { paused } = videoNode;
        if (!paused) {
          videoNode.pause();
        } else {
          videoNode.play();
        }
        break;
      }
      case 'ArrowRight':
        videoNode.currentTime += 4;
        break;
      case 'ArrowLeft':
        videoNode.currentTime -= 4;
        break;
      default:
        return null;
    }
    return null;
  };
  videoNode.addEventListener('click', pauseByClick, false);
  document.addEventListener('keydown', handleKeyDown, false);

  window.onload = setVideoInCenter();

  // скрыть(показать) элементы управления
  const toggleControlsButton = document.querySelector('.playerContainer__hideControlsButton');
  const toggleControlsHandler = () => {
    if (!videoNode.controls) {
      videoNode.controls = true;
      toggleControlsButton.innerHTML = 'HideControls';
    } else {
      videoNode.controls = false;
      toggleControlsButton.innerHTML = 'ShowControls';
    }
  };
  toggleControlsButton.addEventListener('click', toggleControlsHandler);

  const showLastPlayedFile = () => {
    const lastPlayedFile = window.localStorage.getItem('lastPlayedFile');
    if (lastPlayedFile) {
      lastPlayedFileHolder.innerHTML = lastPlayedFile;
    }
  };
  window.addEventListener('load', showLastPlayedFile);
};

localFileVideoPlayer();
