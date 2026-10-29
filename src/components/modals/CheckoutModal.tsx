import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { PaymentMethod, PaymentOrder } from '../../types';
import {
  X,
  CreditCard,
  Smartphone,
  Building2,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Clock,
  Copy,
  Check,
  UploadCloud,
  FileText,
  FileImage
} from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    checkoutSelectedPlan,
    plans,
    paymentConfig,
    createPaymentOrder,
    submitPaymentProof,
    user
  } = useApp();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('multicaixa_express');
  const [activeStep, setActiveStep] = useState<'instructions' | 'submit_proof' | 'pending_confirmation'>('instructions');

  // Created order state
  const [currentOrder, setCurrentOrder] = useState<PaymentOrder | null>(null);

  // Form fields for submitting proof
  const [transactionRef, setTransactionRef] = useState('');
  const [paymentDate, setPaymentDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [paidAmountKz, setPaidAmountKz] = useState<number>(0);
  const [userComment, setUserComment] = useState('');
  const [proofFileName, setProofFileName] = useState('');
  const [proofDataUrl, setProofDataUrl] = useState('');

  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Synchronize order creation when the modal opens or plan/method changes
  useEffect(() => {
    if (!isCheckoutOpen) {
      setCurrentOrder(null);
      setActiveStep('instructions');
      setProofFileName('');
      setProofDataUrl('');
      setTransactionRef('');
      setErrorMessage('');
      return;
    }

    const currentPlan = checkoutSelectedPlan || plans[1] || plans[0];
    if (!currentOrder || currentOrder.planId !== currentPlan.id) {
      const order = createPaymentOrder(currentPlan.id, paymentMethod);
      setCurrentOrder(order);
      setPaidAmountKz(order.amountKz);
    }
  }, [isCheckoutOpen, checkoutSelectedPlan, paymentMethod]);

  if (!isCheckoutOpen) return null;

  const currentPlan = checkoutSelectedPlan || plans[1] || plans[0]; // Default to Trimestral

  // Initialize or change order when user clicks a method button
  const handleProceedToInstructions = (method: PaymentMethod) => {
    setPaymentMethod(method);
    const order = createPaymentOrder(currentPlan.id, method);
    setCurrentOrder(order);
    setPaidAmountKz(order.amountKz);
    setActiveStep('instructions');
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('O ficheiro é demasiado grande. O limite máximo é de 5 MB.');
      return;
    }

    setProofFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setProofDataUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitProofForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentOrder) return;

    setErrorMessage('');
    setIsSubmitting(true);

    try {
      await submitPaymentProof(currentOrder.id, {
        transactionRef: transactionRef.trim(),
        paidAmountKz: Number(paidAmountKz) || currentOrder.amountKz,
        paymentDate,
        proofFileName: proofFileName || 'comprovativo_pagamento.pdf',
        proofDataUrl: proofDataUrl || undefined,
        userComment: userComment.trim()
      });

      setIsSubmitting(false);
      setActiveStep('pending_confirmation');
    } catch (err: any) {
      setErrorMessage('Ocorreu um erro ao submeter o comprovativo. Tenta novamente.');
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setActiveStep('instructions');
    setCurrentOrder(null);
    setProofFileName('');
    setProofDataUrl('');
    setTransactionRef('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#241C23] border border-rose-200 dark:border-[#493642] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative text-[#30232A] dark:text-[#FFF5F8] max-h-[92vh] overflow-y-auto">
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-rose-50 dark:hover:bg-[#30232D] text-neutral-400 hover:text-neutral-600 transition-colors"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Loading state if order is initializing */}
        {!currentOrder && (
          <div className="py-12 text-center space-y-3">
            <div className="w-8 h-8 border-3 border-[#A83260] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-[#796A72] dark:text-[#C8B8C1]">
              A gerar os detalhes de pagamento em Kwanzas...
            </p>
          </div>
        )}

        {/* STEP 1: PAYMENT INSTRUCTIONS (Section 14 Step 3) */}
        {activeStep === 'instructions' && currentOrder && (
          <div className="space-y-5 animate-in fade-in">
            <div className="text-center space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-rose-100 text-[#70213F] dark:bg-[#30232D] dark:text-[#E878A0] px-3 py-1 rounded-full">
                Instruções de Pagamento • Angola (Kz)
              </span>
              <h3 className="font-serif-accent font-bold text-2xl text-[#70213F] dark:text-[#FFF5F8] mt-1">
                Quase lá! Conclui o pagamento para ativares o teu plano.
              </h3>
              <p className="text-xs text-[#796A72] dark:text-[#C8B8C1]">
                Segue as instruções abaixo para transferir via Multicaixa Express ou banco.
              </p>
            </div>

            {/* Plan Summary Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-50 to-pink-50 dark:from-[#30232D] dark:to-[#241C23] border border-rose-200 dark:border-[#493642] flex items-center justify-between">
              <div>
                <span className="text-[11px] text-[#796A72] dark:text-[#C8B8C1] block">Plano Selecionado</span>
                <h4 className="font-bold text-base text-[#70213F] dark:text-[#FFF5F8]">{currentPlan.name}</h4>
                <span className="text-[11px] text-neutral-500">{currentPlan.billingPeriod}</span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-serif-accent font-extrabold text-[#70213F] dark:text-[#E878A0]">
                  {currentPlan.priceKz.toLocaleString('pt-AO')} Kz
                </span>
                <span className="block text-[10px] text-emerald-600 font-semibold">Preço Oficial em Angola</span>
              </div>
            </div>

            {/* Payment Method Selector Tabs */}
            <div className="flex rounded-2xl bg-neutral-100 dark:bg-[#1A1218] p-1 gap-1">
              <button
                type="button"
                onClick={() => handleProceedToInstructions('multicaixa_express')}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  paymentMethod === 'multicaixa_express'
                    ? 'bg-white dark:bg-[#30232D] text-[#70213F] dark:text-[#FFF5F8] shadow-sm'
                    : 'text-neutral-500 hover:text-neutral-700'
                }`}
              >
                <Smartphone className="w-4 h-4 text-[#A83260]" />
                <span>Multicaixa Express</span>
              </button>

              <button
                type="button"
                onClick={() => handleProceedToInstructions('transferencia')}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  paymentMethod === 'transferencia'
                    ? 'bg-white dark:bg-[#30232D] text-[#70213F] dark:text-[#FFF5F8] shadow-sm'
                    : 'text-neutral-500 hover:text-neutral-700'
                }`}
              >
                <Building2 className="w-4 h-4 text-[#A83260]" />
                <span>Transferência Bancária (IBAN)</span>
              </button>
            </div>

            {/* Configured Receiving Details Box */}
            <div className="p-4 rounded-2xl border-2 border-dashed border-rose-200 dark:border-[#493642] bg-[#FFFCFD] dark:bg-[#1A1218] space-y-3">
              {paymentMethod === 'multicaixa_express' ? (
                <>
                  <div className="flex items-center justify-between pb-2 border-b border-rose-100 dark:border-[#3D2C39]">
                    <div>
                      <span className="text-[11px] text-neutral-500 block">Número Recetor Multicaixa Express:</span>
                      <span className="font-mono font-bold text-base text-[#70213F] dark:text-[#E878A0]">
                        {paymentConfig.multicaixaNumber}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(paymentConfig.multicaixaNumber, 'mcx')}
                      className="px-3 py-1.5 rounded-xl border border-rose-200 dark:border-[#493642] text-xs font-semibold hover:bg-rose-50 flex items-center gap-1"
                    >
                      {copiedKey === 'mcx' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'mcx' ? 'Copiado!' : 'Copiar'}</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-neutral-500 block">Referência Única do Pagamento:</span>
                      <span className="font-mono font-bold text-base text-[#A83260] dark:text-[#FFF5F8]">
                        {currentOrder.paymentReference}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(currentOrder.paymentReference, 'ref')}
                      className="px-3 py-1.5 rounded-xl border border-rose-200 dark:border-[#493642] text-xs font-semibold hover:bg-rose-50 flex items-center gap-1"
                    >
                      {copiedKey === 'ref' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'ref' ? 'Copiado!' : 'Copiar'}</span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between pb-2 border-b border-rose-100 dark:border-[#3D2C39]">
                    <div>
                      <span className="text-[11px] text-neutral-500 block">IBAN Oficial para Transferência:</span>
                      <span className="font-mono font-bold text-xs sm:text-sm text-[#70213F] dark:text-[#E878A0] break-all">
                        {paymentConfig.iban}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(paymentConfig.iban, 'iban')}
                      className="px-3 py-1.5 rounded-xl border border-rose-200 dark:border-[#493642] text-xs font-semibold hover:bg-rose-50 flex items-center gap-1 shrink-0 ml-2"
                    >
                      {copiedKey === 'iban' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'iban' ? 'Copiado!' : 'Copiar'}</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-neutral-500 block">Referência da Transferência:</span>
                      <span className="font-mono font-bold text-base text-[#A83260] dark:text-[#FFF5F8]">
                        {currentOrder.paymentReference}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(currentOrder.paymentReference, 'ref2')}
                      className="px-3 py-1.5 rounded-xl border border-rose-200 dark:border-[#493642] text-xs font-semibold hover:bg-rose-50 flex items-center gap-1"
                    >
                      {copiedKey === 'ref2' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'ref2' ? 'Copiado!' : 'Copiar'}</span>
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Instruction Steps */}
            <ol className="text-xs text-[#796A72] dark:text-[#C8B8C1] space-y-1.5 pl-4 list-decimal leading-relaxed">
              <li>Abre a tua aplicação <strong>Multicaixa Express</strong> ou vai a um ATM/Banco em Angola.</li>
              <li>Transfere o valor exato de <strong>{currentPlan.priceKz.toLocaleString('pt-AO')} Kz</strong> para o número ou IBAN indicado acima.</li>
              <li>Insere o código <strong>{currentOrder.paymentReference}</strong> na descrição da transferência.</li>
              <li>Guarda o talão ou comprovativo e clica no botão abaixo para submeter.</li>
            </ol>

            {/* Advance to Step 5 (Submit Proof) */}
            <button
              type="button"
              onClick={() => setActiveStep('submit_proof')}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#70213F] via-[#A83260] to-[#70213F] text-white font-bold text-xs sm:text-sm shadow-xl shadow-rose-900/20 hover:opacity-95 transition-all flex items-center justify-center gap-2"
            >
              <span>Já efetuei o pagamento • Enviar Comprovativo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 2: CONFIRMATION FORM & PROOF UPLOAD (Section 14 Step 5) */}
        {activeStep === 'submit_proof' && currentOrder && (
          <form onSubmit={handleSubmitProofForm} className="space-y-4 animate-in fade-in">
            <div className="text-center space-y-1">
              <h3 className="font-serif-accent font-bold text-xl text-[#70213F] dark:text-[#FFF5F8]">
                Enviar Comprovativo de Pagamento
              </h3>
              <p className="text-xs text-[#796A72] dark:text-[#C8B8C1]">
                Preenche os dados da transação para que a administração possa conferir e aprovar o teu plano.
              </p>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold mb-1">Referência da Encomenda</label>
                <input
                  type="text"
                  readOnly
                  value={currentOrder.paymentReference}
                  className="w-full px-3 py-2 rounded-xl border border-rose-200 dark:border-[#493642] bg-neutral-100 dark:bg-[#1A1218] text-xs font-mono font-bold text-[#70213F] dark:text-[#E878A0]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Método Utilizado</label>
                <input
                  type="text"
                  readOnly
                  value={paymentMethod === 'multicaixa_express' ? 'Multicaixa Express' : 'Transferência Bancária'}
                  className="w-full px-3 py-2 rounded-xl border border-rose-200 dark:border-[#493642] bg-neutral-100 dark:bg-[#1A1218] text-xs font-semibold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold mb-1">ID da Transação / Talão (Opcional)</label>
                <input
                  type="text"
                  value={transactionRef}
                  onChange={e => setTransactionRef(e.target.value)}
                  placeholder="Ex: MCX-20261028-0912"
                  className="w-full px-3 py-2 rounded-xl border border-rose-200 dark:border-[#493642] bg-[#FFFCFD] dark:bg-[#171317] text-xs focus:border-[#A83260]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Valor Pago (Kz)</label>
                <input
                  type="number"
                  required
                  value={paidAmountKz}
                  onChange={e => setPaidAmountKz(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-rose-200 dark:border-[#493642] bg-[#FFFCFD] dark:bg-[#171317] text-xs font-bold focus:border-[#A83260]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Data do Pagamento</label>
              <input
                type="date"
                required
                value={paymentDate}
                onChange={e => setPaymentDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-rose-200 dark:border-[#493642] bg-[#FFFCFD] dark:bg-[#171317] text-xs focus:border-[#A83260]"
              />
            </div>

            {/* Proof Upload Area */}
            <div>
              <label className="block text-xs font-semibold mb-1">
                Comprovativo ou Foto do Talão (Imagem ou PDF)
              </label>
              <div className="border-2 border-dashed border-rose-200 dark:border-[#493642] rounded-2xl p-4 text-center hover:bg-rose-50/50 dark:hover:bg-[#30232D]/30 transition-colors relative">
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <UploadCloud className="w-8 h-8 text-[#A83260] dark:text-[#E878A0] mx-auto mb-1.5" />
                <p className="text-xs font-semibold text-[#70213F] dark:text-[#FFF5F8]">
                  {proofFileName ? proofFileName : 'Clica para anexar o talão do Multicaixa ou transferência'}
                </p>
                <p className="text-[10px] text-neutral-400 mt-0.5">PNG, JPG ou PDF até 5MB</p>
              </div>

              {/* Image Preview if available */}
              {proofDataUrl && (
                <div className="mt-2 p-2 bg-neutral-50 dark:bg-[#1A1218] rounded-xl flex items-center gap-2 border border-rose-100 dark:border-[#493642]">
                  <FileImage className="w-5 h-5 text-[#A83260]" />
                  <span className="text-xs font-medium truncate flex-1">{proofFileName}</span>
                  <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">Anexado</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Comentário ou Notas Adicionais (Opcional)</label>
              <textarea
                rows={2}
                value={userComment}
                onChange={e => setUserComment(e.target.value)}
                placeholder="Ex: Transferência feita pelo telemóvel da minha irmã..."
                className="w-full px-3 py-2 rounded-xl border border-rose-200 dark:border-[#493642] bg-[#FFFCFD] dark:bg-[#171317] text-xs focus:border-[#A83260]"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveStep('instructions')}
                className="py-3 px-4 rounded-xl border border-neutral-300 dark:border-[#493642] text-xs font-semibold text-neutral-600 dark:text-neutral-300 flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Voltar</span>
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#70213F] to-[#A83260] text-white font-bold text-xs shadow-md shadow-rose-900/20 hover:opacity-95 transition-opacity flex items-center justify-center gap-1.5"
              >
                {isSubmitting ? (
                  <span>A enviar comprovativo...</span>
                ) : (
                  <>
                    <span>Enviar comprovativo para aprovação</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: PENDING CONFIRMATION SCREEN (Section 14 Step 7) */}
        {activeStep === 'pending_confirmation' && currentOrder && (
          <div className="py-6 text-center space-y-5 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 flex items-center justify-center mx-auto shadow-md">
              <Clock className="w-9 h-9 animate-pulse" />
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-amber-100 text-amber-900 dark:bg-amber-900/60 dark:text-amber-200 px-3 py-1 rounded-full">
                Pendente de aprovação
              </span>
              <h3 className="font-serif-accent font-bold text-2xl text-[#70213F] dark:text-[#FFF5F8]">
                Recebemos o teu pedido de confirmação.
              </h3>
              <p className="text-xs text-[#796A72] dark:text-[#C8B8C1] max-w-sm mx-auto leading-relaxed">
                Vamos verificar o pagamento. O teu plano será ativado depois da aprovação pelo administrador.
              </p>
            </div>

            {/* Auditable Order Summary Receipt Card */}
            <div className="bg-[#F8E7ED]/70 dark:bg-[#30232D] p-4 rounded-2xl text-left text-xs space-y-2 border border-rose-200 dark:border-[#493642]">
              <div className="flex justify-between py-1 border-b border-rose-200/50 dark:border-[#493642]">
                <span className="text-neutral-500">Referência Única:</span>
                <span className="font-mono font-bold text-[#70213F] dark:text-[#E878A0]">{currentOrder.paymentReference}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-rose-200/50 dark:border-[#493642]">
                <span className="text-neutral-500">Plano Solicitado:</span>
                <span className="font-bold">{currentOrder.planName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-rose-200/50 dark:border-[#493642]">
                <span className="text-neutral-500">Montante Submetido:</span>
                <span className="font-bold">{currentOrder.amountKz.toLocaleString('pt-AO')} Kz</span>
              </div>
              <div className="flex justify-between py-1 border-b border-rose-200/50 dark:border-[#493642]">
                <span className="text-neutral-500">Método de Envio:</span>
                <span className="font-semibold capitalize">{currentOrder.method.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-neutral-500">Estado Atual:</span>
                <span className="text-amber-700 dark:text-amber-300 font-extrabold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  Aguardando Validação Manual
                </span>
              </div>
            </div>

            <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
              Podes acompanhar o estado no teu perfil ou no menu de planos. Assim que o pagamento for aprovado pelo administrador, o acesso total será desbloqueado.
            </p>

            <button
              type="button"
              onClick={handleClose}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#70213F] to-[#A83260] text-white font-bold text-xs shadow-md shadow-rose-900/20"
            >
              Entendido • Fechar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
