import { readFileSync, writeFileSync } from "node:fs";

import { MercadoPagoConfig, Preference } from "mercadopago";

interface Message {
  id: number;
  text: string;
}

export const mercadopago = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! });

const api = {
  message: {
    async list(): Promise<Message[]> {
      // Leemos el archivo de la base de datos de los mensajes
      const db = readFileSync("db/message.db");

      // Devolvemos los datos como un array de objetos
      return JSON.parse(db.toString());
    },
    async add(message: Message): Promise<void> {
      // Obtenemos los mensajes
      const db = await api.message.list();

      // Si ya existe un mensaje con ese id, lanzamos un error
      if (db.some((_message) => _message.id === message.id)) {
        throw new Error("Message already added");
      }

      // Agregamos el nuevo mensaje
      const draft = db.concat(message);

      // Guardamos los datos
      writeFileSync("db/message.db", JSON.stringify(draft, null, 2));
    },
    async submit(text: Message["text"]) {
      // Creamos la preferencia incluyendo el precio, titulo y metadata. La información de `items` es standard de Mercado Pago. La información que nosotros necesitamos para nuestra DB debería vivir en `metadata`.
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

      // Devolvemos el init point (url de pago) para que el usuario pueda pagar
      return preference.init_point!;
    },
  },
  cart: {
    async submit(cartItems: { product: { _id: string; name: string; price: number; description: string; images: string[]; discount: number; }, quantity: number }[], shippingData: { firstName: string; lastName: string; email: string; phone: string; dni: string; course: string; division: string }, user_id: string, appliedCoupon?: { code: string; discount: number } | null) {
      // Map cart items to MercadoPago items
      console.log(user_id, 'userIdapi');
      console.log(appliedCoupon, 'appliedCoupon in api');
      
      // Helper function to calculate discounted price
      const getDiscountedPrice = (price: number, discount: number) => {
        return price * (1 - discount / 100);
      };
      
      // Calculate subtotal with product discounts applied
      const subtotalWithProductDiscounts = cartItems.reduce((sum, item) => {
        const originalPrice = item.product.price;
        const productDiscount = item.product.discount || 0;
        const discountedPrice = getDiscountedPrice(originalPrice, productDiscount);
        return sum + (discountedPrice * item.quantity);
      }, 0);
      
      // Apply coupon discount if exists
      const couponDiscount = appliedCoupon ? appliedCoupon.discount : 0;
      const totalWithAllDiscounts = subtotalWithProductDiscounts - couponDiscount;
      
      // If there's a coupon discount, we need to adjust the item prices proportionally
      let items;
      if (appliedCoupon && couponDiscount > 0) {
        const couponDiscountRatio = totalWithAllDiscounts / subtotalWithProductDiscounts;
        items = cartItems.map((item) => {
          const originalPrice = item.product.price;
          const productDiscount = item.product.discount || 0;
          const productDiscountedPrice = getDiscountedPrice(originalPrice, productDiscount);
          const finalPrice = +(productDiscountedPrice * couponDiscountRatio).toFixed(2);
          
          return {
            id: item.product._id,
            title: item.product.name,
            description: item.product.description,
            picture_url: item.product.images[0],
            unit_price: finalPrice,
            quantity: item.quantity,
            currency_id: "ARS",
          };
        });
      } else {
        items = cartItems.map((item) => {
          const originalPrice = item.product.price;
          const productDiscount = item.product.discount || 0;
          const discountedPrice = getDiscountedPrice(originalPrice, productDiscount);
          
          return {
            id: item.product._id,
            title: item.product.name,
            description: item.product.description,
            picture_url: item.product.images[0],
            unit_price: discountedPrice,
            quantity: item.quantity,
            currency_id: "ARS",
          };
        });
      }
      
      // Create preference
      const metadata = {
        cart: cartItems.map((item) => ({ id: item.product._id, quantity: item.quantity })),
        shippingData,
        user_id,
        couponCode: appliedCoupon ? appliedCoupon.code : null,
      };
      
      console.log('Creating preference with metadata:', metadata);
      console.log('Applied coupon being sent:', appliedCoupon);
      console.log('Subtotal with product discounts:', subtotalWithProductDiscounts);
      console.log('Total with all discounts:', totalWithAllDiscounts);
      
      const preference = await new Preference(mercadopago).create({
        body: {
          items,
          metadata,
          additional_info: JSON.stringify({ shippingData, appliedCoupon }),
          back_urls: {
            success: "https://snackly.site/profile",
            failure: "https://snackly.site/failure_payment",
            pending: "https://snackly.site/pending_payment",
          },
          // back_urls: {
          //   success: "https://p2j0t6n6-3000.brs.devtunnels.ms/success_payment",
          //   failure: "https://p2j0t6n6-3000.brs.devtunnels.ms/failure_payment",
          //   pending: "https://p2j0t6n6-3000.brs.devtunnels.ms/pending_payment",
          // },
          auto_return: "approved",
        },
      });
      return preference.init_point!;
    },
  },
};

export default api;
