import { Shippo } from "shippo"

const shippo = new Shippo({ apiKeyHeader: process.env.SHIPPO_API_KEY! })

export interface OrderData {
    toName: string
    toStreet1: string
    toCity: string
    toState: string
    toZip: string
    toCountry: string
    toEmail: string
    toPhone?: string
    quantity?: number
    productName?: string
}

export interface ShipmentResult {
    trackingNumber: string
    trackingUrl: string
    labelUrl: string
    carrier: string
    service: string
}

export async function purchaseShippingLabel(order: OrderData): Promise<ShipmentResult> {
    const qty = Math.max(1, Math.min(3, order.quantity ?? 1))
    const shipment = await shippo.shipments.create({
        addressFrom: {
            name: process.env.SHIPPO_FROM_NAME!,
            street1: process.env.SHIPPO_FROM_STREET1!,
            city: process.env.SHIPPO_FROM_CITY!,
            state: process.env.SHIPPO_FROM_STATE!,
            zip: process.env.SHIPPO_FROM_ZIP!,
            country: "US",
            phone: process.env.SHIPPO_FROM_PHONE,
            email: process.env.SHIPPO_FROM_EMAIL,
        },
        addressTo: {
            name: order.toName,
            street1: order.toStreet1,
            city: order.toCity,
            state: order.toState,
            zip: order.toZip,
            country: order.toCountry,
            email: order.toEmail,
            phone: order.toPhone,
        },
        parcels: [
            {
                length: "9",
                width: "6",
                height: "1",
                distanceUnit: "in",
                weight: String(0.08 * qty),
                massUnit: "lb",
            },
        ],
        async: false,
        metadata: `${order.productName ?? "Focus"} × ${qty}`,
        extra: {
            reference1: `${order.productName ?? "Focus"} x${qty}`,
        },
    })

    const rates = shipment.rates ?? []
    if (rates.length === 0) {
        throw new Error("No shipping rates returned for this shipment")
    }

    // Pick the cheapest available rate
    const cheapestRate = rates
        .filter((r) => r.objectId && parseFloat(r.amount ?? "999") > 0)
        .sort((a, b) => parseFloat(a.amount ?? "0") - parseFloat(b.amount ?? "0"))[0]

    if (!cheapestRate?.objectId) {
        throw new Error("Could not determine a valid shipping rate")
    }

    const transaction = await shippo.transactions.create({
        rate: cheapestRate.objectId,
        labelFileType: "PDF_4x6",
        async: false,
    })

    if (transaction.status !== "SUCCESS") {
        throw new Error(`Label purchase failed: ${transaction.messages?.map((m) => m.text).join(", ")}`)
    }

    return {
        trackingNumber: transaction.trackingNumber ?? "",
        trackingUrl: transaction.trackingUrlProvider ?? "",
        labelUrl: transaction.labelUrl ?? "",
        carrier: cheapestRate.provider ?? "",
        service: cheapestRate.servicelevel?.name ?? "",
    }
}
