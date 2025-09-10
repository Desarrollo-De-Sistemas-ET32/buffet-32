const api = {
  message: {
    async buy(data: {amount: number; email: string; installments: number; token: string}) {
      // Creamos el pago con los datos del formulario
      const payment = await new Payment(mercadopago).create({
        body: {
          payer: {
            email: data.email,
          },
          token: data.token,
          transaction_amount: data.amount,
          installments: data.installments,
        },
      });

      // Devolvemos el pago
      return payment;
    },
  },
};