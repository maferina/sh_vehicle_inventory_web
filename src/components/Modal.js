import React from 'react';
import PropTypes from 'prop-types';
import '../styles/Modal.css';

const Modal = ({ show, message, onClose, children, form, images, confirmDelete, cancelDelete }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className={
          form ? 'modal-form' : 
          images ? 'modal-images' : 
          confirmDelete && cancelDelete ? 'modal-content' : 
          'modal-message'
        } 
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close-button" onClick={onClose}>×</button>

        {form ? (
          <>
            {children}
          </>
        ) : images ? (
          <>
            {children}
          </>
        ) : confirmDelete && cancelDelete ? (
          <>
            <h2>Confirmación de Eliminación</h2>
            <p>{message}</p>
            <div className="modal-buttons">
              <button className="mcancel-button" onClick={cancelDelete}>Cancelar</button>
              <button className="delete-button" onClick={confirmDelete}>Eliminar</button>
            </div>
          </>
        ) : (
          <>
            <h2>Mensaje</h2>
            <p>{message}</p>
          </>
        )}
      </div>
    </div>
  );
};

Modal.propTypes = {
  show: PropTypes.bool.isRequired,
  message: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node,
  form: PropTypes.bool,
  images: PropTypes.bool,
  confirmDelete: PropTypes.func,
  cancelDelete: PropTypes.func,
};

export default Modal;
