import { useState, useEffect } from 'react';
import { useLocation } from 'react-router';
import PasoSeleccionEntrega from './PasoSeleccionEntrega';
import PasoFechaHoraDireccion from './PasoFechaHoraDireccion';
import PasoMetodoPago from './PasoMetodoPago';
import PasoRevisarConfirmar from './PasoRevisarConfirmar';
import FruticaLayout from '../../components/Layout/FruticaLayout';

const Compra: React.FC = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const pasoInicial = parseInt(query.get('paso') || '1', 10);

  const [paso, setPaso] = useState(pasoInicial);
  const [tipoEntrega, setTipoEntrega] = useState<string | null>(null);

  const pedidoActual = {
    id: 1,
    estado: 'pendiente',
    estadoPago: 'pendiente',
    metodoPago: 'Efectivo',
    total: 645,
    tipoEntrega: 'Pasar a recoger',
    fechaPedido: '05 de enero del 2025',
    direccion: 'C. Gambusinos #8, Capulálpam, Oaxaca',
    productos: [
      { nombre: 'Mandarina', cantidad: '10 kg', precio: 145, img: 'https://frutimag.com/mandarina.png' },
      { nombre: 'Tomate', cantidad: '5 kg', precio: 100, img: 'https://frutimag.com/tomate.png' },
    ],
  };

  const handleBack = () => {
    setPaso(p => p - 1);
  };

  useEffect(() => {
    const tipoGuardado = localStorage.getItem('tipo_entrega');
    setTipoEntrega(tipoGuardado);

    if (tipoGuardado && pasoInicial === 1) {
      setPaso(2);
    }
  }, []);

  return (
    <FruticaLayout>
      {paso === 1 && !tipoEntrega && <PasoSeleccionEntrega onNext={() => setPaso(2)} />}
      {paso === 2 && <PasoFechaHoraDireccion onNext={() => setPaso(3)} onBack={handleBack} />}
      {paso === 3 && <PasoMetodoPago onNext={() => setPaso(4)} onBack={handleBack} />}
      {paso === 4 && <PasoRevisarConfirmar onBack={handleBack} pedido={pedidoActual} />}
    </FruticaLayout>
  );
};
export default Compra;
