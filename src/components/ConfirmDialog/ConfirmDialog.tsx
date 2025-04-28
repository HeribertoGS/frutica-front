import React from 'react';
import './ConfirmDialog.css';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  mensaje: string;
  detalle?: string;
  textoConfirmar?: string;
  textoCancelar?: string;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  mensaje,
  detalle,
  textoConfirmar = 'Confirmar',
  textoCancelar = 'Cancelar'
}) => {
  if (!isOpen) return null;

  return (
    <div className="confirm-overlay">
      <div className="confirm-box">
        <h3>{mensaje}</h3>
        {detalle && <p>{detalle}</p>}
        <div className="confirm-buttons">
          <button className="btn-amarillo" onClick={onClose}>{textoCancelar}</button>
          <button className="btn-confirmar" onClick={onConfirm}>{textoConfirmar}</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;