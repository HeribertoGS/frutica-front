import React, { useState } from 'react';
import './MetodosPago.css';
import {
  IonPage,
  IonContent,
  IonButton,
  IonInput,
  IonLabel,
  IonItem,
  IonCheckbox,
  IonIcon,
  IonCard,
  IonCardContent
} from '@ionic/react';
import { cardOutline, cashOutline, documentOutline, copyOutline } from 'ionicons/icons';

const MetodosPago: React.FC = () => {
  const [metodo, setMetodo] = useState<string>('');
  const [tarjeta, setTarjeta] = useState({ nombre: '', numero: '', vencimiento: '', cvv: '' });

  const copiarCuenta = () => {
    navigator.clipboard.writeText('4907 6836 6802 9654');
  };

  return (
    <IonPage>
      <IonContent className="metodopago-wrapper" fullscreen>
        <div className="metodopago-container">
          <IonCard className="metodopago-card-container">
            <IonCardContent>
              <h2 className="metodopago-titulo">Métodos de Pago</h2>

              {/* Efectivo */}
              <div
                className={`metodopago-card ${metodo === 'efectivo' ? 'activo' : ''}`}
                onClick={() => setMetodo('efectivo')}
              >
                <div className="metodopago-info">
                  <IonIcon icon={cashOutline} className="metodopago-icon" />
                  <span className="metodopago-nombre">Efectivo</span>
                  <IonCheckbox checked={metodo === 'efectivo'} />
                </div>
              </div>

              {/* Transferencia */}
              <div
                className={`metodopago-card ${metodo === 'transferencia' ? 'activo' : ''}`}
                onClick={() => setMetodo('transferencia')}
              >
                <div className="metodopago-info">
                  <IonIcon icon={documentOutline} className="metodopago-icon" />
                  <span className="metodopago-nombre">Transferencia</span>
                  <IonCheckbox checked={metodo === 'transferencia'} />
                </div>

                {metodo === 'transferencia' && (
                  <div className="metodopago-detalles">
                    <p>
                      <strong>Número de cuenta:</strong> 4907 6836 6802 9654
                      <IonIcon
                        icon={copyOutline}
                        onClick={copiarCuenta}
                        className="copiar-icon"
                      />
                    </p>
                    <p>
                      <strong>Propietario:</strong> Frutica
                    </p>
                  </div>
                )}
              </div>

              {/* Tarjeta */}
              <div
                className={`metodopago-card ${metodo === 'tarjeta' ? 'activo' : ''}`}
                onClick={() => setMetodo('tarjeta')}
              >
                <div className="metodopago-info">
                  <IonIcon icon={cardOutline} className="metodopago-icon" />
                  <span className="metodopago-nombre">Tarjeta</span>
                  <IonCheckbox checked={metodo === 'tarjeta'} />
                </div>

                {metodo === 'tarjeta' && (
                  <div className="metodopago-form">
                    <IonItem>
                      <IonLabel position="stacked">Nombre en la tarjeta</IonLabel>
                      <IonInput
                        value={tarjeta.nombre}
                        onIonChange={(e) => setTarjeta({ ...tarjeta, nombre: e.detail.value! })}
                      />
                    </IonItem>
                    <IonItem>
                      <IonLabel position="stacked">Número de tarjeta</IonLabel>
                      <IonInput
                        type="number"
                        value={tarjeta.numero}
                        onIonChange={(e) => setTarjeta({ ...tarjeta, numero: e.detail.value! })}
                      />
                    </IonItem>
                    <IonItem>
                      <IonLabel position="stacked">Vencimiento</IonLabel>
                      <IonInput
                        placeholder="MM/AA"
                        value={tarjeta.vencimiento}
                        onIonChange={(e) => setTarjeta({ ...tarjeta, vencimiento: e.detail.value! })}
                      />
                    </IonItem>
                    <IonItem>
                      <IonLabel position="stacked">CVV</IonLabel>
                      <IonInput
                        type="number"
                        value={tarjeta.cvv}
                        onIonChange={(e) => setTarjeta({ ...tarjeta, cvv: e.detail.value! })}
                      />
                    </IonItem>
                  </div>
                )}
              </div>

              <IonButton expand="block" className="metodopago-boton">
                Seleccionar
              </IonButton>
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default MetodosPago;
