import React, { useState, useEffect } from 'react';
import { IonModal } from '@ionic/react';
import './facturaForm.css';

interface FacturaFormProps {
    isOpen: boolean;
    onClose: () => void;
    onGuardar: (datos: any) => void;
    facturaExistente?: any;
}

const FacturaForm: React.FC<FacturaFormProps> = ({ isOpen, onClose, onGuardar, facturaExistente }) => {
    const [form, setForm] = useState({
        rfc: '',
        razon: '',
        usoCfdi: '',
        metodoPago: '',
        persona: 'FISICA', // ← ¡default correcto!
    });

    const [errores, setErrores] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        if (facturaExistente) {
            setForm(facturaExistente);
        }
    }, [facturaExistente]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const validarFormulario = () => {
        const nuevosErrores: { [key: string]: string } = {};

        if (!form.razon.trim()) nuevosErrores.razon = 'La razón social es obligatoria.';
        if (!form.rfc.match(/^([A-ZÑ&]{3,4}\d{6}[A-Z\d]{3})$/i)) nuevosErrores.rfc = 'RFC inválido.';
        if (!form.usoCfdi) nuevosErrores.usoCfdi = 'Selecciona el uso de CFDI.';
        if (!form.metodoPago) nuevosErrores.metodoPago = 'Selecciona el método de pago.';

        return nuevosErrores;
    };

    const handleGuardar = () => {
        const nuevosErrores = validarFormulario();

        if (Object.keys(nuevosErrores).length === 0) {
            onGuardar(form);
            setForm({
                rfc: '',
                razon: '',
                usoCfdi: '',
                metodoPago: '',
                persona: 'FISICA',
            });
            setErrores({});
            onClose();
        } else {
            setErrores(nuevosErrores);
        }
    };

    const handleCancelar = () => {
        setForm({
            rfc: '',
            razon: '',
            usoCfdi: '',
            metodoPago: '',
            persona: 'FISICA',
        });
        setErrores({});
        onClose();
    };

    return (
        <IonModal isOpen={isOpen} onDidDismiss={onClose} className="modal-factura">
            <h2>Datos de facturación</h2>

            <div className="factura-section">
                <div className="form-group">
                    <label>Razón social</label>
                    <input name="razon" value={form.razon} onChange={handleChange} />
                    {errores.razon && <span className="error-msg">{errores.razon}</span>}
                </div>

                <div className="form-group">
                    <label>RFC</label>
                    <input name="rfc" value={form.rfc} onChange={handleChange} />
                    {errores.rfc && <span className="error-msg">{errores.rfc}</span>}
                </div>

                <div className="form-group">
                    <label>Tipo de persona</label>
                    <select name="persona" value={form.persona} onChange={handleChange}>
                        <option value="FISICA">Persona Física</option>
                        <option value="MORAL">Persona Moral</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Uso de CFDI</label>
                    <select name="usoCfdi" value={form.usoCfdi} onChange={handleChange}>
                        <option value="">Seleccionar</option>
                        <option value="G03">Gastos en general</option>
                        <option value="D01">Honorarios médicos</option>
                        <option value="I01">Construcciones</option>
                        {/* Puedes agregar más opciones reales de CFDI */}
                    </select>
                    {errores.usoCfdi && <span className="error-msg">{errores.usoCfdi}</span>}
                </div>

                <div className="form-group">
                    <label>Método de pago</label>
                    <select name="metodoPago" value={form.metodoPago} onChange={handleChange}>
                        <option value="">Seleccionar</option>
                        <option value="efectivo">Efectivo</option>
                        <option value="transferencia">Transferencia</option>
                        <option value="tarjeta">Tarjeta</option>
                    </select>
                    {errores.metodoPago && <span className="error-msg">{errores.metodoPago}</span>}
                </div>
            </div>

            <div className="botones-footer">
                <button className="boton-guardar" onClick={handleGuardar}>Guardar</button>
                <button className="boton-cancelar" onClick={handleCancelar}>Cancelar</button>
            </div>
        </IonModal>
    );
};

export default FacturaForm;
