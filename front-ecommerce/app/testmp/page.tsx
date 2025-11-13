import {redirect} from "next/navigation";

import api from "@/app/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

// Queremos que esta página sea estática, nos encargaremos de revalidar los datos cuando agreguemos un nuevo mensaje
export const dynamic = "force-static";

export default async function HomePage() {
  const messages = await api.message.list();

  async function add(formData: FormData) {
    "use server";

    const message = formData.get("text") as string;
    const url = await api.message.submit(message);

    redirect(url);
  }

  return (
    <section className="grid gap-8">
      <form action={add}>
        <Textarea name="text" placeholder="Hola perro" rows={3} className="" />
        <Button type="submit">Enviar</Button>
      </form>
      <ul>
        {messages.map((message) => (
          <li key={message.id}>{message.text}</li>
        ))}
      </ul>
    </section>
  );
}