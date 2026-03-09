"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Image from "next/image"
import Link from "next/link"
import { X } from "lucide-react"

gsap.registerPlugin(ScrollTrigger)

const TOS_CONTENT = `# Terms of Service

Last Updated: March 8, 2026

These Terms of Service ("Terms") govern your access to and use of the website, products, and services provided by Zenova MM ("Zenova MM," "Company," "we," "us," or "our"). By accessing or using the website, purchasing products, or using any of our services (collectively, the "Services"), you agree to be bound by these Terms and all policies referenced herein. If you do not agree to these Terms, you must not use the Services.

---

# IMPORTANT NOTICE REGARDING DISPUTE RESOLUTION

THESE TERMS CONTAIN A MANDATORY ARBITRATION AGREEMENT AND CLASS ACTION WAIVER.

BY USING THE SERVICES OR PURCHASING PRODUCTS FROM ZENOVA MM, YOU AGREE THAT ANY DISPUTE BETWEEN YOU AND ZENOVA MM WILL BE RESOLVED THROUGH INDIVIDUAL BINDING ARBITRATION AND NOT IN COURT, EXCEPT WHERE PROHIBITED BY LAW.

YOU ALSO WAIVE ANY RIGHT TO PARTICIPATE IN A CLASS ACTION OR REPRESENTATIVE PROCEEDING.

---

## 1. Eligibility

You must be at least sixteen (16) years old to purchase or use Zenova MM products. By using the Services, you represent that you meet this requirement or are using the Services with appropriate parental or guardian supervision where permitted by law.

You are responsible for ensuring that your purchase, possession, and use of Zenova MM products comply with all applicable local, state, and federal laws and regulations in your jurisdiction.

---

## 2. Company and Product Information

Zenova MM is a dietary supplement brand that sells energy supplements delivered through oral dissolvable strips.

Zenova MM products are manufactured in the United States by an independent third-party manufacturer specializing in oral dissolvable supplement strips. The manufacturing facility is NSF-certified and follows applicable Good Manufacturing Practices (GMP) for dietary supplements.

Zenova MM does not manufacture its own products.

We attempt to display product descriptions, images, and ingredient information accurately, but we do not warrant that all product information is complete, accurate, or error-free.

Zenova MM reserves the right to correct any errors and update product information at any time.

---

## 3. Health Disclaimer

Zenova MM products are dietary supplements.

The information provided through the Services is for informational purposes only and does not constitute medical advice.

You should consult a qualified healthcare professional before using any dietary supplement if you are pregnant or nursing, have a medical condition, are taking medication, are sensitive to caffeine or stimulants, or are unsure whether the product is appropriate for you.

Individual results may vary.

These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease.

---

## 4. Orders and Purchases

Zenova MM reserves the right to refuse or cancel any order, limit quantities purchased, restrict sales by geographic region or jurisdiction, discontinue products at any time, and correct pricing or product description errors.

If a product is listed with incorrect pricing or information, Zenova MM reserves the right to cancel the order or notify you of corrected information prior to shipment.

Offers for products are void where prohibited by law.

---

## 5. Payment Processing

Payments are processed by third-party payment processors including Stripe.

By submitting payment information, you represent that you are authorized to use the payment method, the payment information is accurate and current, and you authorize charges for the full purchase amount including applicable taxes and shipping fees.

Zenova MM is not responsible for errors, outages, or security incidents caused by third-party payment providers.

---

## 6. Personal Use Only

Zenova MM products are sold for personal use only.

You may not resell, redistribute, or commercially exploit Zenova MM products without prior written permission.

Zenova MM reserves the right to cancel orders that appear to be placed by resellers, distributors, or bulk purchasers intending to resell products.

---

## 7. Refund Policy

Zenova MM offers a limited risk-free purchase policy.

Customers may try up to three (3) strips from a purchased box. If the customer is not satisfied with the product, they may request a refund provided that no more than three strips were used, the customer contacts Zenova MM to request the refund, and the remaining product is returned to Zenova MM.

Customers are responsible for return shipping costs.

Shipping charges are non-refundable unless otherwise required by law.

Zenova MM reserves the right to deny refund requests that appear fraudulent, abusive, or inconsistent with this policy.

---

## 8. Shipping

Orders are processed within a reasonable timeframe after purchase.

Delivery times are estimates and may vary depending on shipping carriers.

Zenova MM is not responsible for delays caused by shipping carriers, weather events, customs delays, incorrect addresses provided by the customer, or circumstances beyond our control.

---

## 9. Promotional Communications

By providing your email address or phone number, you agree that Zenova MM may send transactional communications related to your orders.

If you opt in to marketing communications, you may receive promotional emails or SMS messages from Zenova MM.

You may unsubscribe at any time by following the instructions in the message.

Message and data rates may apply.

---

## 10. Acceptable Use

You agree to use Zenova MM products only as directed.

Zenova MM shall not be responsible for adverse effects resulting from misuse of the product, excessive consumption, combining the product with other stimulants or substances, or failure to follow instructions.

Use of Zenova MM products is at your own risk.

---

## 11. Prohibited Uses

You may not use the Services for unlawful purposes, violating laws or regulations, infringing intellectual property rights, distributing malware or malicious code, submitting false information, or interfering with website security.

Zenova MM may terminate access to the Services if these Terms are violated.

---

## 12. Intellectual Property

All content on the Zenova MM website including logos, product designs, text, graphics, and branding is the property of Zenova MM and is protected by intellectual property laws.

No content may be copied, reproduced, distributed, or modified without written permission.

---

## 13. Third-Party Services

The Services may include links to third-party services including payment processors, analytics providers, or shipping services.

Zenova MM is not responsible for the policies or practices of third-party services.

---

## 14. Disclaimer of Warranties

THE SERVICES AND PRODUCTS ARE PROVIDED "AS IS" AND "AS AVAILABLE."

ZENOVA MM DISCLAIMS ALL WARRANTIES INCLUDING BUT NOT LIMITED TO MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.

ZENOVA MM DOES NOT GUARANTEE THAT THE SERVICES WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE.

---

## 15. Limitation of Liability

TO THE MAXIMUM EXTENT PERMITTED BY LAW, ZENOVA MM AND ITS AFFILIATES SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, CONSEQUENTIAL, SPECIAL, OR PUNITIVE DAMAGES ARISING FROM USE OF THE SERVICES OR PRODUCTS.

ZENOVA MM'S TOTAL LIABILITY FOR ANY CLAIM SHALL NOT EXCEED THE AMOUNT PAID FOR THE PRODUCT GIVING RISE TO THE CLAIM.

---

## 16. Indemnification

You agree to indemnify and hold harmless Zenova MM and its owners, officers, employees, contractors, and affiliates from any claims, damages, liabilities, or expenses arising from misuse of Zenova MM products, violation of these Terms, violation of applicable laws, or infringement of third-party rights.

---

## 17. Arbitration Agreement

Any dispute arising from these Terms or the Services shall be resolved through binding arbitration administered by the American Arbitration Association (AAA) under its consumer arbitration rules.

Claims may be brought in small claims court if eligible.

---

## 18. Class Action Waiver

You agree that disputes will be resolved only on an individual basis and not as part of a class action.

---

## 19. Jury Trial Waiver

You waive the right to a jury trial for disputes arising from the Services.

---

## 20. Governing Law

These Terms are governed by the laws of the State of New York.

---

## 21. Force Majeure

Zenova MM shall not be liable for delays or failure to perform obligations due to events beyond reasonable control including natural disasters, supply disruptions, labor disputes, government actions, or internet outages.

---

## 22. Severability

If any provision of these Terms is found unenforceable, the remaining provisions remain in full effect.

---

## 23. Waiver

Failure to enforce any provision does not constitute a waiver of that provision.

---

## 24. Assignment

Zenova MM may assign or transfer these Terms without restriction. Users may not assign rights under these Terms without written consent.

---

## 25. Entire Agreement

These Terms together with the Privacy Policy and other referenced policies constitute the entire agreement between you and Zenova MM regarding the Services.

---

## 26. Changes to Terms

Zenova MM may update these Terms at any time. Updated versions will be posted on the website.

Continued use of the Services after updates constitutes acceptance of the revised Terms.

---

## 27. California Consumer Notice

Under California Civil Code Section 1789.3, California users may contact the Complaint Assistance Unit of the Division of Consumer Services of the California Department of Consumer Affairs at 1625 N. Market Blvd., Suite N 112, Sacramento, CA 95834, Phone: (800) 952-5210.

---

## 28. Contact Information

Zenova MM
officialzenovastrips@gmail.com
New York, United States`

const REFUND_CONTENT = `# Refund Policy

Zenova offers a risk-free purchase policy.

Customers may try up to 3 strips from their box. If you are not satisfied with the product, you may request a refund provided that:

• No more than 3 strips have been used
• The remaining product is returned
• The customer pays return shipping

Refunds apply only to the product purchase price. Shipping costs are non-refundable.

To request a refund, please visit our contact page and describe your issue.`

const PRIVACY_CONTENT = `# Privacy Policy

Last Updated: March 8, 2026

Zenova MM ("Zenova MM," "we," "us," or "our") respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard personal information when you access our website, purchase our products, or otherwise interact with our services (collectively, the "Services").

By using our Services, you consent to the collection and use of your information as described in this Privacy Policy.

---

## 1. Information We Collect

We collect personal information that you voluntarily provide when interacting with our Services.

This information may include your name, email address, phone number, shipping address, products purchased, order details, transaction history, and payment information.

Payments are processed through third-party payment processors such as Stripe. Zenova MM does not store complete credit card or payment details on our servers.

---

## 2. Marketing and Promotional Communications

During checkout or other interactions with our Services, you may be given the option to opt in to receive promotional communications from Zenova MM.

If you choose to opt in, we may send you promotional emails, promotional text messages (SMS), product announcements, discount offers, and company updates.

Providing your contact information for marketing communications is optional and not required to make a purchase.

You may opt out at any time by clicking the unsubscribe link in emails or by replying STOP to SMS messages.

Standard message and data rates may apply depending on your mobile carrier.

---

## 3. Automatically Collected Information

When you visit our website, certain technical information may be collected automatically through cookies or similar technologies.

This information may include your IP address, browser type and version, device type, pages visited, time spent on pages, and referring website.

This information helps us improve website functionality and understand how visitors interact with our Services.

---

## 4. Cookies and Tracking Technologies

Our website may use cookies and similar technologies to operate the website, remember user preferences, analyze website traffic, and improve user experience.

Cookies are small data files stored on your device.

You may disable cookies through your browser settings, though doing so may affect certain features of the website.

---

## 5. How We Use Your Information

We may use personal information for purposes including processing and fulfilling orders, communicating with customers about orders, sending promotional communications when you opt in, improving our products and website, analyzing website performance, preventing fraud or unauthorized transactions, and complying with legal obligations.

---

## 6. Sharing of Personal Information

Zenova MM does not sell personal information.

We may share personal information with trusted service providers that assist us in operating our business, such as providers that help us process payments, deliver marketing communications, host website infrastructure, and analyze website performance.

These providers may access personal information only as necessary to perform services on our behalf.

We may also disclose personal information if required to comply with legal obligations, respond to lawful government requests, or protect the rights or safety of Zenova MM or others.

---

## 7. Data Retention

We retain personal information only for as long as necessary to fulfill orders, provide services, comply with legal obligations, resolve disputes, and enforce our policies.

When personal information is no longer required, we will securely delete or anonymize it.

---

## 8. Data Security

Zenova MM maintains administrative, technical, and physical safeguards designed to protect personal information from unauthorized access, disclosure, or misuse.

However, no internet transmission or electronic storage system can be guaranteed to be completely secure.

---

## 9. Children's Privacy

Our Services are not directed toward children under the age of 13.

We do not knowingly collect personal information from children under 13. If we become aware that personal information from a child has been collected, we will delete it.

Parents or guardians who believe their child has provided personal information may contact us.

---

## 10. Third-Party Services

Our website may use or link to third-party services including payment processors, analytics tools, and marketing providers.

These third parties operate under their own privacy policies, and Zenova MM is not responsible for their practices.

---

## 11. California Privacy Rights

Residents of California may have certain rights under the California Consumer Privacy Act (CCPA) and California Privacy Rights Act (CPRA), including the right to request access to personal information collected about them, the right to request deletion of personal information, the right to correct inaccurate personal information, and the right to opt out of the sale of personal information.

Zenova MM does not sell personal information.

California residents may contact us to exercise privacy rights using the contact information below.

---

## 12. International Data Transfers

Zenova MM operates in the United States.

Information collected through our Services may be processed and stored in the United States or other jurisdictions where data protection laws may differ from those in your country.

By using our Services, you consent to such transfers.

---

## 13. Changes to This Privacy Policy

We may update this Privacy Policy periodically.

Updated versions will be posted on our website with the revised "Last Updated" date.

Your continued use of the Services after changes are posted constitutes acceptance of the updated policy.

---

## 14. Contact Information

Zenova MM
officialzenovastrips@gmail.com
New York, United States`

function renderLegal(content: string) {
  return content.split("\n").map((line, i) => {
    if (line.startsWith("# ")) {
      return <h1 key={i} className="text-lg font-black text-white tracking-tight mt-6 mb-2 first:mt-0">{line.slice(2)}</h1>
    }
    if (line.startsWith("## ")) {
      return <h2 key={i} className="text-sm font-bold text-white/70 mt-6 mb-1">{line.slice(3)}</h2>
    }
    if (line === "---") {
      return <hr key={i} className="border-white/8 my-4" />
    }
    if (line.trim() === "") {
      return <div key={i} className="h-1" />
    }
    return <p key={i} className="text-sm text-white/40 leading-relaxed">{line}</p>
  })
}

function LegalModal({ title, content, onClose }: { title: string; content: string; onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    document.addEventListener("keydown", handler)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", handler)
      document.body.style.overflow = ""
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative flex flex-col w-full max-w-2xl max-h-[82vh] rounded-2xl border border-white/8 bg-[#0a0a0a] shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/8 flex-shrink-0">
          <h2 className="font-black text-white tracking-tight">{title}</h2>
          <button
            onClick={onClose}
            className="text-white/30 hover:text-white transition-colors duration-150"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        </div>
        {/* Scrollable content */}
        <div className="overflow-y-auto px-6 py-6 flex-1">
          {renderLegal(content)}
        </div>
      </div>
    </div>
  )
}

export default function FooterSection() {
  const [modal, setModal] = useState<"tos" | "privacy" | "refund" | null>(null)
  const footerRef = useRef<HTMLElement>(null)
  const logoRef = useRef<HTMLAnchorElement>(null)
  const socialRef = useRef<HTMLDivElement>(null)
  const copyrightRef = useRef<HTMLSpanElement>(null)
  const legalRef = useRef<HTMLDivElement>(null)

  const closeModal = useCallback(() => setModal(null), [])

  useEffect(() => {
    const footer = footerRef.current
    if (!footer) return

    const elements = [
      logoRef.current,
      socialRef.current,
      copyrightRef.current,
      legalRef.current,
    ].filter(Boolean) as Element[]

    gsap.set(elements, { y: 40, opacity: 0 })

    const timer = setTimeout(() => {
      const st = ScrollTrigger.create({
        trigger: footer,
        start: "top 95%",
        onEnter: () => {
          gsap.to(elements, {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.12,
            ease: "power3.out",
          })
        },
        onLeaveBack: () => {
          gsap.to(elements, {
            y: 40,
            opacity: 0,
            duration: 0.4,
            stagger: 0.08,
            ease: "power2.in",
          })
        },
      })

      return () => st.kill()
    }, 300)

    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      <footer ref={footerRef} className="border-t border-white/5 bg-black py-16 md:py-28">
        <div className="mx-auto max-w-5xl px-6">
          <Link
            ref={logoRef}
            href="/"
            aria-label="go home"
            className="mx-auto block size-fit"
          >
            <Image
              src="/logoinvert.png"
              alt="Zenova Strips"
              width={120}
              height={52}
              style={{ height: "42px", width: "auto" }}
            />
          </Link>

          <div ref={socialRef} className="my-8 flex flex-wrap justify-center gap-6 text-sm">
            <Link href="https://www.instagram.com/zenovastrips/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-white/30 hover:text-white/70 block transition-colors duration-150">
              <svg className="size-6" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                <path fill="currentColor" d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4zm9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3" />
              </svg>
            </Link>
            <Link href="#" target="_blank" rel="noopener noreferrer" aria-label="Amazon" className="text-white/30 hover:text-white/70 block transition-colors duration-150">
              <svg className="size-6" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                <path fill="currentColor" d="M15.93 17.09c-.16.31-.41.57-.74.77c-3.28 2.01-7.72 1.59-10.76-.45c-1.57-1.06-2.77-2.57-3.43-4.33c-.17-.46.18-.73.55-.41c1.74 1.47 3.67 2.64 5.77 3.3c2.09.66 4.28.73 6.4.19c.55-.14 1.07-.33 1.58-.57c.54-.23.9.22.63.5M17.5 14.5c-.44-.56-2.89-.27-3.99-.13c-.33.04-.38-.25-.08-.46c1.95-1.37 5.16-1 5.53-.5c.37.5-.1 3.74-1.93 5.3c-.28.24-.55.11-.42-.2c.41-1.02 1.33-3.45.89-4.01" />
              </svg>
            </Link>
            <Link href="https://www.tiktok.com/@zenova.strips" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="text-white/30 hover:text-white/70 block transition-colors duration-150">
              <svg className="size-6" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                <path fill="currentColor" d="M16.6 5.82s.51.5 0 0A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6c0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64c0 3.33 2.76 5.7 5.69 5.7c3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.24-1.48" />
              </svg>
            </Link>
          </div>

          <span ref={copyrightRef} className="block text-center text-xs font-medium tracking-widest text-white/20">
            © {new Date().getFullYear()} Zenova Strips, All rights reserved
          </span>

          <div ref={legalRef} className="mt-4 flex justify-center gap-6">
            <button
              onClick={() => setModal("tos")}
              className="text-xs text-white/20 hover:text-white/50 transition-colors duration-150 tracking-wide"
            >
              Terms of Service
            </button>
            <button
              onClick={() => setModal("privacy")}
              className="text-xs text-white/20 hover:text-white/50 transition-colors duration-150 tracking-wide"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => setModal("refund")}
              className="text-xs text-white/20 hover:text-white/50 transition-colors duration-150 tracking-wide"
            >
              Refund Policy
            </button>
          </div>
        </div>
      </footer>

      {modal && (
        <LegalModal
          title={modal === "tos" ? "Terms of Service" : modal === "privacy" ? "Privacy Policy" : "Refund Policy"}
          content={modal === "tos" ? TOS_CONTENT : modal === "privacy" ? PRIVACY_CONTENT : REFUND_CONTENT}
          onClose={closeModal}
        />
      )}
    </>
  )
}
