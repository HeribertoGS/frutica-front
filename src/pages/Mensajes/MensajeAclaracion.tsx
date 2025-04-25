import React, { useState } from 'react';
import { IonPage, IonContent } from '@ionic/react';
import FruticaLayout from '../../components/Layout/FruticaLayout';
import './MensajesAclaracion.css';
import { starOutline } from 'ionicons/icons';
import { IonIcon } from '@ionic/react';

const MensajeAclaracion: React.FC = () => {
  const [comentario, setComentario] = useState('');
  const [calificacion, setCalificacion] = useState(0);

  const handleEnviar = () => {
    if (comentario.trim()) {
      alert('Mensaje enviado correctamente ✅');
      setComentario('');
    } else {
      alert('Escribe un comentario antes de enviar.');
    }
  };

  return (
    <IonPage>
      <FruticaLayout>
        <IonContent className="ion-padding mensaje-container">
          <h2 className="titulo-mensaje">Aclaraciones y comentarios</h2>

          <div className="card-mensaje">
            <p><strong>Pedido:</strong> #0612</p>
            <img src="src/assets/img/preparacion.png" alt="imagen pedido" className="mensaje-img" />
            <p><strong>Fecha de pedido:</strong> 03 de enero del 2025</p>
            <p><strong>Fecha de entrega:</strong> 05 de enero del 2025</p>
          </div>


          <div className="estrellas-container">
  {[1, 2, 3, 4, 5].map((i) => (
    <span
      key={i}
      className={`estrella ${i <= calificacion ? 'activa' : ''}`}
      onClick={() => setCalificacion(i)}
    >
      ★
    </span>
  ))}
</div>

<div className="comentario-input-container">
  <textarea
    className="comentario-input"
    placeholder="Escribe tu comentario..."
  ></textarea>
  <button className="icono-enviar">
    <i className="fas fa-paper-plane"></i>
  </button>
</div>

<div className="mensajes-grid">
  <div className="card-mensaje">
    <h4>Respuestas</h4>
    <p>Aún no tienes comentarios...</p>
  </div>

  <div className="card-mensaje">
    <h4>Dudas y aclaraciones</h4>
    <p><strong>Números de contacto</strong></p>
    <p>
      Teléfono 1: 951 1234567
      <img src="https://cdn-icons-png.flaticon.com/512/220/220236.png" alt="WhatsApp" className="contact-icon" />
      <img src="https://cdn-icons-png.flaticon.com/512/483/483947.png" alt="Teléfono" className="contact-icon" />
    </p>
    <p>
      Teléfono 2: 53 43455667
      <img src="https://cdn-icons-png.flaticon.com/512/483/483947.png" alt="Teléfono" className="contact-icon" />
    </p>

    <p><strong>Correo electrónico</strong></p>
    <p>
      gijon.sanchez501@gmail.com
      <img src="https://cdn-icons-png.flaticon.com/512/732/732200.png" alt="Gmail" className="contact-icon" />
    </p>
  </div>
</div>
        </IonContent>
      </FruticaLayout>
    </IonPage>
  );
};

export default MensajeAclaracion;
