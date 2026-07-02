/**
 * Central funnel configuration.
 * Everything a non-developer might need to change lives here.
 */
export const CONFIG = {
  brand: {
    name: "Processes for Profits",
    shortName: "P4P",
    contactEmail: "shanks@processesforprofits.com",
    website: "https://processesforprofits.com",
  },

  offer: {
    /** Monthly client cap used for scarcity messaging. */
    spotsPerMonth: 10,
    /** Program length used in guarantee copy. */
    programLengthMonths: 3,
  },

  /**
   * Stripe Payment Link for the $1 booking-fee / spam filter.
   * Create it in Stripe Dashboard → Payment Links:
   *   - Product: "Strategy Call Booking Deposit" at $1.00 USD
   *   - After payment → redirect to: https://<your-domain>/book?paid=1
   * Then paste the link URL here.
   */
  stripePaymentLink: "REPLACE_WITH_STRIPE_PAYMENT_LINK",

  /** Calendly event used for the sales call. */
  calendlyUrl: "https://calendly.com/p-f-p/dfy-6to7figures",

  /**
   * Optional: webhook that receives every application as JSON
   * (Zapier / Make / GoHighLevel inbound webhook). Leave empty to disable.
   */
  applicationWebhookUrl: "",

  /**
   * Meta Pixel ID. Leave empty to disable tracking.
   * Events fired: PageView, ViewContent (landing), Lead (application
   * submitted), AddPaymentInfo (qualified → payment page), Purchase $1
   * (arrival on /book?paid=1), Schedule (Calendly booking confirmed).
   */
  metaPixelId: "",
} as const;
