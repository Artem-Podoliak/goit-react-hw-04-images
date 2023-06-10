import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { IconContext } from 'react-icons';
import { MdClose } from 'react-icons/md';
import { Overlay, ModalContainer, CloseButton, LargeImg } from './Modal.styled';

const modalRoot = document.getElementById('modal-root');

const Modal = ({ largeImageURL, alt, onClose }) => {
  useEffect(() => {
    const onKeyDown = e => {
      if (e.code === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onClose]);

  const onBackdropClick = e => {
    if (e.currentTarget === e.target) {
      onClose();
    }
  };

  return createPortal(
    <Overlay onClick={onBackdropClick}>
      <ModalContainer>
        <CloseButton type="button" onClick={onClose}>
          <IconContext.Provider value={{ size: '2.5em' }}>
            <MdClose />
          </IconContext.Provider>
        </CloseButton>
        <LargeImg src={largeImageURL} alt={alt} />
      </ModalContainer>
    </Overlay>,
    modalRoot
  );
};

export default Modal;

Modal.propTypes = {
  largeImageURL: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};
