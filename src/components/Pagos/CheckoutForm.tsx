import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import './Checkout.css';

const CheckoutForm: React.FC<{ clientSecret: string }> = ({ clientSecret }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setMensaje(null);

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement)!,
      },
    });

    if (error) {
      console.error('❌ Error en pago:', error.message);
      setMensaje('Error al procesar el pago. Intenta de nuevo.');
    } else if (paymentIntent?.status === 'succeeded') {
      console.log('✅ Pago exitoso');
      setMensaje('✅ ¡Pago realizado correctamente!');
      // Aquí podrías hacer un redirect automático si quieres
      // history.push('/pedidos') por ejemplo
    } else {
      setMensaje('Algo salió raro. Intenta nuevamente.');
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="stripe-form">
      <div className="stripe-card">
        <CardElement options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#32325d',
              '::placeholder': { color: '#a0aec0' },
            },
            invalid: { color: '#fa755a' },
          },
        }} />
      </div>

      <button className="btn-verdee" type="submit" disabled={!stripe || isProcessing}>
        {isProcessing ? 'Procesando...' : 'Pagar ahora'}
      </button>

      {mensaje && (
        <div className="stripe-mensaje">
          {mensaje}
        </div>
      )}
    </form>
  );
};

export default CheckoutForm;
