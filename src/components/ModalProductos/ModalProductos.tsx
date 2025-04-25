// components/ModalProductos.tsx
import React from 'react';
import { IonModal } from '@ionic/react';
import './ModalProductos.css';

interface Producto {
  nombre: string;
  cantidad: string;
  precio: number;
  img: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  productos: Producto[];
}
// ModalProductos.tsx
const ModalProductos: React.FC<Props> = ({ isOpen, onClose, productos }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-productos">
      <div className="modal-contenido">
        <h3 className="modal-titulo">Lista de productos</h3>
        <ul className="lista-productos">
          {productos.map((prod, i) => (
            <li key={i} className="producto-item">
              <img src={prod.img} alt={prod.nombre} />
              <div className="producto-info">
                <span>{prod.nombre} - {prod.cantidad}</span>
                <strong>${prod.precio.toFixed(2)}</strong>
              </div>
            </li>
          ))}
        </ul>
        <div className="boton-centro">
          <button className="btn-subir" onClick={onClose}>Listo</button>
        </div>
      </div>
    </div>
  );
};

export default ModalProductos;
