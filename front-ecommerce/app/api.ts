import { MercadoPagoConfig, Payment } from 'mercadopago';
import { promises as fs } from 'fs';
import path from 'path';

const dbPath = path.resolve(process.cwd(), 'db.json');

async function readDb() {
  try {
    const data = await fs.readFile(dbPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // @ts-ignore
    if (error.code === 'ENOENT') {
      return { messages: [] };
    }
    throw error;
  }
}

async function writeDb(data: any) {
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2));
}

export const client = new MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN! });

const api = {
  message: {
    list: async () => {
      const db = await readDb();
      return db.messages;
    },
    add: async (message: { text: string, id: number }) => {
      const db = await readDb();
      db.messages.push(message);
      await writeDb(db);
    },
    async buy(data: {amount: number; email: string; installments: number; token: string}) {
      // Creamos el pago con los datos del formulario
      const payment = await new Payment(client).create({
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

export default api;
