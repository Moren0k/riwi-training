import { MercadoPagoConfig, Preference } from "mercadopago";
import { NextApiRequest, NextApiResponse } from "next";
import { IPlan } from "@/mock/product";

const client = new MercadoPagoConfig({
    accessToken: process.env.NEXT_ACCESS_TOKEN!,
});

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Método no permitido" });
    }

    try {
        const plan: IPlan = req.body.product;

        if (!plan) {
            return res.status(400).json({ message: "Producto no enviado" });
        }

        const URL = "http://localhost:3000";

        const preference = new Preference(client);

        const response = await preference.create({
            body: {
                items: [
                    {
                        id: String(plan.id),
                        title: plan.name,
                        unit_price: Number(plan.price),
                        quantity: 1,
                        currency_id: 'COP'
                    },
                ],
                auto_return: "approved",
                back_urls: {
                    success: `${URL}?status=success`,
                    failure: `${URL}?status=failure`,
                },
                notification_url: `${URL}/api/notifications`,
            },
        });

        return res.status(200).json({
            url: response.init_point,
        });
    } catch (error: any) {
        console.error("MercadoPago error:", error);
        return res.status(500).json({
            message: "Error creando preferencia",
            error: error.message,
        });
    }
}
