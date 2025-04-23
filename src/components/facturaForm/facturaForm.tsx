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
        regimen: '',
        usoCfdi: '',
        motivo: '',
        metodoPago: '',
        persona: 'fisica',
        objetoImpuesto: '',
        calle: '',
        numero: '',
        colonia: '',
        ciudad: '',
        municipio: '',
        estado: '',
        codigoPostal: '',
    });

    useEffect(() => {
        if (facturaExistente) {
            setForm(facturaExistente);
        }
    }, [facturaExistente]);

    const [errores, setErrores] = useState<{ [key: string]: string }>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const validarFormulario = () => {
        const nuevosErrores: { [key: string]: string } = {};

        if (!form.razon.trim()) nuevosErrores.razon = 'La razón social es obligatoria.';
        if (!form.rfc.match(/^([A-ZÑ&]{3,4}\d{6}[A-Z\d]{3})$/i)) nuevosErrores.rfc = 'RFC inválido.';
        if (!form.regimen) nuevosErrores.regimen = 'Selecciona un régimen fiscal.';
        if (!form.usoCfdi) nuevosErrores.usoCfdi = 'Selecciona el uso de CFDI.';
        if (!form.metodoPago) nuevosErrores.metodoPago = 'Selecciona el método de pago.';
        if (!form.motivo.trim()) nuevosErrores.motivo = 'El motivo del régimen fiscal es obligatorio.';
        if (!form.objetoImpuesto) nuevosErrores.objetoImpuesto = 'Selecciona el objeto de impuesto.';
        if (!form.calle.trim()) nuevosErrores.calle = 'La calle es obligatoria.';
        if (!form.numero.trim()) nuevosErrores.numero = 'El número es obligatorio.';
        if (!form.codigoPostal.match(/^\d{5}$/)) nuevosErrores.codigoPostal = 'Código postal inválido.';
        if (!form.colonia.trim()) nuevosErrores.colonia = 'La colonia es obligatoria.';
        if (!form.ciudad.trim()) nuevosErrores.ciudad = 'La ciudad es obligatoria.';
        if (!form.estado.trim()) nuevosErrores.estado = 'El estado es obligatorio.';

        return nuevosErrores;
    };

    const handleGuardar = () => {
        const nuevosErrores = validarFormulario();
    
        if (Object.keys(nuevosErrores).length === 0) {
            onGuardar(form);
            // Resetear formulario después de guardar
            setForm({
                rfc: '',
                razon: '',
                regimen: '',
                usoCfdi: '',
                motivo: '',
                metodoPago: '',
                persona: 'fisica',
                objetoImpuesto: '',
                calle: '',
                numero: '',
                colonia: '',
                ciudad: '',
                municipio: '',
                estado: '',
                codigoPostal: '',
            });
            setErrores({});
            onClose(); // cerrar modal
        } else {
            setErrores(nuevosErrores);
        }
    };
    

    const handleCancelar = () => {
        setForm({
            rfc: '',
            razon: '',
            regimen: '',
            usoCfdi: '',
            motivo: '',
            metodoPago: '',
            persona: 'fisica',
            objetoImpuesto: '',
            calle: '',
            numero: '',
            colonia: '',
            ciudad: '',
            municipio: '',
            estado: '',
            codigoPostal: '',
        });
        setErrores({});
        onClose();
    };

    return (
        <IonModal isOpen={isOpen} onDidDismiss={onClose} className="modal-factura">
            <h2>Datos de facturación</h2>

            <div className="factura-section">
                <h3>Datos personales</h3>

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
                        <option value="fisica">Persona Física</option>
                        <option value="moral">Persona Moral</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Régimen Fiscal</label>
                    <select name="regimen" value={form.regimen} onChange={handleChange}>
                        <option value="">Seleccionar</option>
                        <option value="fisica">Persona Física</option>
                        <option value="moral">Persona Moral</option>
                    </select>
                    {errores.regimen && <span className="error-msg">{errores.regimen}</span>}
                </div>

                <div className="form-group">
                    <label>Uso de CFDI</label>
                    <select name="usoCfdi" value={form.usoCfdi} onChange={handleChange}>
                        <option value="">Seleccionar</option>
                        <option value="gastos">Gastos</option>
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

                <div className="form-group">
                    <label>Motivo régimen fiscal</label>
                    <input name="motivo" value={form.motivo} onChange={handleChange} />
                    {errores.motivo && <span className="error-msg">{errores.motivo}</span>}
                </div>

                <div className="form-group">
                    <label>Objeto de impuesto</label>
                    <select name="objetoImpuesto" value={form.objetoImpuesto} onChange={handleChange}>
                        <option value="">Seleccionar</option>
                        <option value="01">01 - No objeto de impuesto</option>
                        <option value="02">02 - Sí objeto de impuesto</option>
                        <option value="03">03 - Sí objeto, no obligado</option>
                    </select>
                    {errores.objetoImpuesto && <span className="error-msg">{errores.objetoImpuesto}</span>}
                </div>
            </div>

            <div className="factura-section">
                <h3>Dirección de facturación</h3>

                <div className="form-group">
                    <label>Calle</label>
                    <input name="calle" value={form.calle} onChange={handleChange} />
                    {errores.calle && <span className="error-msg">{errores.calle}</span>}
                </div>

                <div className="form-group">
                    <label>Número</label>
                    <input name="numero" value={form.numero} onChange={handleChange} />
                    {errores.numero && <span className="error-msg">{errores.numero}</span>}
                </div>

                <div className="form-group">
                    <label>Código Postal</label>
                    <input name="codigoPostal" value={form.codigoPostal} onChange={handleChange} />
                    {errores.codigoPostal && <span className="error-msg">{errores.codigoPostal}</span>}
                </div>

                <div className="form-group">
                    <label>Colonia</label>
                    <input name="colonia" value={form.colonia} onChange={handleChange} />
                    {errores.colonia && <span className="error-msg">{errores.colonia}</span>}
                </div>

                <div className="form-group">
                    <label>Ciudad</label>
                    <input name="ciudad" value={form.ciudad} onChange={handleChange} />
                    {errores.ciudad && <span className="error-msg">{errores.ciudad}</span>}
                </div>

                <div className="form-group">
                    <label>Estado</label>
                    <input name="estado" value={form.estado} onChange={handleChange} />
                    {errores.estado && <span className="error-msg">{errores.estado}</span>}
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
