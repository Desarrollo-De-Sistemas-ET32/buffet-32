import { MercadoPagoConfig, Preference } from "mercadopago";
import { readFileSync, writeFileSync } from "fs";

export const mercadopago = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
});

const DB_PATH = "messages.json";

const api = {
  message: {
    list: async (): Promise<{ id: string; text: string }[]> => {
      try {
        const content = readFileSync(DB_PATH, "utf-8");
        return JSON.parse(content);
      } catch (error) {
        // If the file doesn't exist, return an empty array
        if ((error as { code: string }).code === 'ENOENT') {
          return [];
        } else {
          throw error;
        }
      }
    },
    submit: async (text: string): Promise<string> => {
      const preference = await new Preference(mercadopago).create({
        body: {
          items: [
            {
              id: "message",
              unit_price: 100,
              quantity: 1,
              title: "Mensaje de muro",
            },
          ],
          metadata: {
            text,
          },
        },
      });

      return preference.init_point!;
    },
    add: async (message: { id: string; text: string }): Promise<void> => {
      const messages = await api.message.list();
      messages.push(message);
      writeFileSync(DB_PATH, JSON.stringify(messages, null, 2), "utf-8");
    },
  },
};

export default api;