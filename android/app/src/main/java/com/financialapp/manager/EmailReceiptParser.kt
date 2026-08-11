package com.financialapp.manager

import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

/**
 * Dedicated Pure Backend Email Receipt Parser Engine
 * Processes raw email text dynamically using universal regex pattern matching.
 * Handles English & Indonesian Bank Receipts (myBCA, Mandiri, BRI, BNI, GoPay, ShopeePay, Google, etc.).
 * All receipts are automatically categorized as "Purchases".
 */
data class ParsedEmailReceipt(
    val merchant: String,
    val amount: Long,
    val category: String = "Purchases",
    val transactionDate: String,
    val rawSubject: String = "",
    val isExpense: Boolean = true
)

object EmailReceiptParser {

    private val PROMO_KEYWORDS = listOf(
        "Aktifkan", "Notifikasi", "eSign", "PDF", "Faster", "Discount", "Promo", "Voucher", 
        "Cashback", "Penawaran", "Undangan", "Update", "Newsletter", "Fitur", "Rekomendasi",
        "&rsaquo;", "&amp;", "&quot;", "Gratis", "Syarat", "Ketentuan", "Kupon", "Hadiah"
    )

    fun parse(rawText: String, emailSubject: String = ""): ParsedEmailReceipt {
        val fullText = "$emailSubject\n$rawText".trim()

        // 1. Strict Anti-Promo Guard: Skip marketing & notification emails
        for (kw in PROMO_KEYWORDS) {
            if (emailSubject.contains(kw, ignoreCase = true) || rawText.take(200).contains(kw, ignoreCase = true)) {
                return ParsedEmailReceipt(merchant = "", amount = 0L, category = "Purchases", transactionDate = "")
            }
        }
        
        var merchant = extractMerchant(fullText)
        val amount = extractAmount(fullText)
        val dateStr = extractDate(fullText)

        // Validate merchant string - must not contain HTML entities or promo keywords
        for (kw in PROMO_KEYWORDS) {
            if (merchant.contains(kw, ignoreCase = true)) {
                merchant = ""
                break
            }
        }

        if (amount <= 100L && !fullText.contains("Rp 0", ignoreCase = true)) {
            return ParsedEmailReceipt(merchant = "", amount = 0L, category = "Purchases", transactionDate = "")
        }

        return ParsedEmailReceipt(
            merchant = merchant,
            amount = amount,
            category = "Purchases",
            transactionDate = dateStr,
            rawSubject = emailSubject
        )
    }

    private fun extractMerchant(fullText: String): String {
        if (fullText.isBlank()) return ""

        // 1. myBCA English & Indonesian QRIS / Transfer / Payment ("Payment to : Dapoer Clara NP - Food")
        val paymentToMatch = Regex("""Payment to\s*:\s*([^\n\r]+)""", RegexOption.IGNORE_CASE).find(fullText)
        if (paymentToMatch != null && paymentToMatch.groupValues.size > 1) {
            val merchantStr = paymentToMatch.groupValues[1].trim()
            if (merchantStr.isNotBlank()) return merchantStr
        }

        // 2. Mandiri Top-up (PLN Prabayar, ShopeePay, GoPay, DANA, OVO, etc.)
        if (fullText.contains("Top-up Berhasil", ignoreCase = true) || fullText.contains("Nominal Top-up", ignoreCase = true)) {
            val providerMatch = Regex("""Penyedia Jasa\s*:\s*([A-Za-z0-9\s]+)|Penyedia Jasa\s+([A-Za-z0-9\s]+)""", RegexOption.IGNORE_CASE).find(fullText)
            if (providerMatch != null) {
                val candidate = providerMatch.groupValues.firstOrNull { it.isNotBlank() && !it.contains("Penyedia", ignoreCase = true) }
                if (!candidate.isNullOrBlank()) {
                    return candidate.replace("****", "").trim()
                }
            }
        }

        // 3. Mandiri QRIS / Pembayaran Berhasil (Penerima field)
        if (fullText.contains("Pembayaran Berhasil", ignoreCase = true) || fullText.contains("Penerima", ignoreCase = true)) {
            val penerimaMatch = Regex("""Penerima\s*:\s*([^\n\r,]+)|Penerima\s+([^\n\r,]+)""", RegexOption.IGNORE_CASE).find(fullText)
            if (penerimaMatch != null) {
                var rawMerchant = penerimaMatch.groupValues.lastOrNull { it.isNotBlank() }?.trim() ?: ""
                rawMerchant = rawMerchant
                    .replace(Regex("""\s+-\s+ID.*""", RegexOption.IGNORE_CASE), "")
                    .replace(Regex("""\s+Jakarta.*""", RegexOption.IGNORE_CASE), "")
                    .replace(Regex("""\s+Tanggal.*""", RegexOption.IGNORE_CASE), "")
                    .replace(Regex("""\s+Jam.*""", RegexOption.IGNORE_CASE), "")
                    .trim()
                if (rawMerchant.isNotBlank() && !rawMerchant.contains("Halo", ignoreCase = true)) {
                    return rawMerchant
                }
            }
        }

        // 4. Google Play & Google One Subscriptions / Purchases
        if (fullText.contains("Google Play", ignoreCase = true) || fullText.contains("Google Digital", ignoreCase = true) || fullText.contains("Google LLC", ignoreCase = true)) {
            val googleItemMatch = Regex("""Google AI Pro[^\n\r]*|Google One[^\n\r]*""", RegexOption.IGNORE_CASE).find(fullText)
            if (googleItemMatch != null && googleItemMatch.value.isNotBlank()) {
                val item = googleItemMatch.value.trim()
                return "Google Play (${item})"
            }
            return "Google Play"
        }

        // 5. Tokopedia / Shopee / E-Commerce Purchase Receipts Only
        if (fullText.contains("Pembayaran Berhasil", ignoreCase = true) || fullText.contains("Rincian Pembayaran", ignoreCase = true)) {
            if (fullText.contains("Tokopedia", ignoreCase = true)) return "Tokopedia"
            if (fullText.contains("Shopee", ignoreCase = true)) return "Shopee"
        }

        // 6. Mamikos Rent / Protection
        if (fullText.contains("Mamikos", ignoreCase = true) || fullText.contains("Bina Dana Arta", ignoreCase = true)) {
            return "Mamikos"
        }

        // 7. Grab E-Receipt
        if (fullText.contains("Grab", ignoreCase = true) || fullText.contains("GrabFood", ignoreCase = true)) {
            val grabMatch = Regex("""(?:Pesanan Dari|Merchant|Restoran|Diterbitkan oleh Pengemudi)\s*[\n\r:]*\s*([^\n\r]+)""", RegexOption.IGNORE_CASE).find(fullText)
            if (grabMatch != null && grabMatch.groupValues.size > 1) {
                return grabMatch.groupValues[1].trim()
            }
            return "GrabFood"
        }

        // 8. BCA Journal / Beneficiary / Transfer
        if (fullText.contains("BCA", ignoreCase = true) || fullText.contains("myBCA", ignoreCase = true)) {
            val bcaRemarksMatch = Regex("""Remarks\s*[\n\r:]*\s*([^\n\r]+)""", RegexOption.IGNORE_CASE).find(fullText)
            val bcaBeneficiaryMatch = Regex("""Beneficiary Name\s*[\n\r:]*\s*([^\n\r]+)""", RegexOption.IGNORE_CASE).find(fullText)
            val remarkStr = bcaRemarksMatch?.groupValues?.getOrNull(1)?.trim() ?: ""
            val nameStr = bcaBeneficiaryMatch?.groupValues?.getOrNull(1)?.trim() ?: ""
            if (remarkStr.isNotEmpty()) return remarkStr
            if (nameStr.isNotEmpty()) return nameStr
        }

        return ""
    }

    private fun extractAmount(fullText: String): Long {
        if (fullText.isBlank()) return 0L

        // Explicitly check for trial / free / $0 / Rp 0 charged today
        if (Regex("""Today\s*:\s*Rp\s*0""", RegexOption.IGNORE_CASE).containsMatchIn(fullText) ||
            Regex("""Price[\s\S]*?Rp\s*0""", RegexOption.IGNORE_CASE).containsMatchIn(fullText) ||
            fullText.contains("Rp 0,00", ignoreCase = true) ||
            fullText.contains("Price: Rp 0", ignoreCase = true)) {
            return 0L
        }

        // Universal Amount Extraction Order:
        // 1. Check Total Payment / Total Transaksi / Total Pembayaran (myBCA, Mandiri, Admin Fee inclusive)
        // 2. Fallback to Nominal Transaksi / Nominal Top-up / Amount
        val amountPatterns = listOf(
            Regex("""Total Payment\s*[\n\r:]*\s*(?:IDR|Rp)?\s*([\d\.,]+)""", RegexOption.IGNORE_CASE),
            Regex("""Total Transaksi\s*[\n\r:]*\s*(?:IDR|Rp)?\s*([\d\.,]+)""", RegexOption.IGNORE_CASE),
            Regex("""Total Pembayaran\s*[\n\r:]*\s*(?:IDR|Rp)?\s*([\d\.,]+)""", RegexOption.IGNORE_CASE),
            Regex("""Total Bayar\s*[\n\r:]*\s*(?:IDR|Rp)?\s*([\d\.,]+)""", RegexOption.IGNORE_CASE),
            Regex("""TOTAL\s*[\n\r:]*\s*(?:IDR|Rp)?\s*([\d\.,]+)""", RegexOption.IGNORE_CASE),
            Regex("""Nominal Transaksi\s*[\n\r:]*\s*(?:IDR|Rp)?\s*([\d\.,]+)""", RegexOption.IGNORE_CASE),
            Regex("""Nominal Top-up\s*[\n\r:]*\s*(?:IDR|Rp)?\s*([\d\.,]+)""", RegexOption.IGNORE_CASE),
            Regex("""Nominal\s*[\n\r:]*\s*(?:IDR|Rp)?\s*([\d\.,]+)""", RegexOption.IGNORE_CASE),
            Regex("""Amount\s*[\n\r:]*\s*(?:IDR|Rp)?\s*([\d\.,]+)""", RegexOption.IGNORE_CASE)
        )

        for (pattern in amountPatterns) {
            val match = pattern.find(fullText)
            if (match != null && match.groupValues.size > 1) {
                val rawAmtStr = match.groupValues[1].trim()
                val cleanedNumber = if (rawAmtStr.contains(",")) {
                    rawAmtStr.split(",")[0].replace(".", "").replace(" ", "")
                } else if (rawAmtStr.count { it == '.' } == 1 && rawAmtStr.split(".")[1].length == 2) {
                    rawAmtStr.replace(".", "").replace(" ", "")
                } else {
                    rawAmtStr.replace(".", "").replace(",", "").replace(" ", "")
                }
                val parsedVal = cleanedNumber.toLongOrNull()
                if (parsedVal != null && parsedVal > 100) {
                    return parsedVal
                }
            }
        }

        return 0L
    }

    private fun extractDate(fullText: String): String {
        val datePatterns = listOf(
            Regex("""Transaction Date\s*:\s*([^\n\r]+)""", RegexOption.IGNORE_CASE),
            Regex("""Tanggal\s*:\s*([^\n\r]+)|Tanggal\s+([0-9]+\s+[A-Za-z]+\s+[0-9]+)""", RegexOption.IGNORE_CASE),
            Regex("""Date\s*:\s*([A-Za-z0-9\s,]+)""", RegexOption.IGNORE_CASE),
            Regex("""Order date\s*:\s*([A-Za-z0-9\s,]+)""", RegexOption.IGNORE_CASE),
            Regex("""([0-9]{1,2}\s+[A-Za-z]{3,9}\s+[0-9]{4})""")
        )

        for (pattern in datePatterns) {
            val match = pattern.find(fullText)
            if (match != null) {
                val candidate = match.groupValues.lastOrNull { it.isNotBlank() }?.trim() ?: ""
                if (candidate.isNotEmpty()) return candidate.take(15)
            }
        }

        val sdf = SimpleDateFormat("d MMM yyyy", Locale("id", "ID"))
        return sdf.format(Date())
    }
}
