# MyAbout — shaxsiy portfolio

Mahalliy ishlaydigan, tashqi paket va CDN talab qilmaydigan sayt. Node.js 20+ kerak. `Abu` nomi faqat berilgan papka nomidan olingan vaqtinchalik ko‘rinadigan nom; uni almashtiring.

## Ishga tushirish

PowerShell:

```powershell
cd D:\Abu\Chatgpt\MyAbout
node server.mjs
```

Brauzer: http://127.0.0.1:4173

To‘xtatish: Ctrl+C. Boshqa port kerak bo‘lsa `$env:PORT=4180` ni ishga tushirishdan oldin yozing. Server faqat shu kompyuterda tinglaydi. Brauzerda HTML faylni ikki marta bosish o‘rniga serverdan foydalaning.

## Yig‘ish va tekshirish

```powershell
node --test tests/*.test.mjs
node build.mjs
node server.mjs --dist
```

`dist/` — statik hostingga yuklash uchun tayyor fayllar. Hostingda server.mjs dagi xavfsizlik sarlavhalarini ham sozlang. Sayt ushbu topshiriqda internetga joylanmagan.

## Ma’lumotlarni o‘zgartirish

`profile.js`: nom, monogramma, email, telefon, GitHub/Telegram/LinkedIn havolalari, loyiha havolalari. Havolalar to‘liq `https://` shaklida bo‘lsin. Bo‘sh maydonlar tashrif buyuruvchiga mavjud kontakt sifatida ko‘rsatilmaydi.

Joylashuv uchun `location.city` va `location.country` ni to‘ldirib, `visible: true` qiling. Aniq uy manzilini kiritmang. **Barcha statik fayllar ommaviy:** `visible: false` faqat interfeysda yashiradi; maxfiy ma’lumotni faylning o‘ziga ham yozmang.

`content.js`: barcha Uzbek/Russian/English matnlar. Har bir tilning kalitlari bir xil. Qiziqishlar va o‘quv rejasi tasdiqlangan professional malaka sifatida berilmagan. Ish tajribasi, mukofot yoki raqamlar to‘qilmagan. Haqiqiy loyihalar tayyor bo‘lgach, ularning holati va havolalarini yangilang.

`style.css`: ranglar, masofalar va moslashuvchan dizayn. `app.js`: navigatsiya, filtrlash, dialoglar, forma. Hash havolalar statik hostingda qayta yo‘naltirish sozlamasisiz ishlaydi.

## Aloqa shakli qanday ishlaydi?

Serverga yuborish yoki xat yetkazish xizmati yo‘q. Majburiy maydonlar tekshiriladi, so‘ng foydalanuvchi xabarni UTF-8 `.txt` fayl sifatida yuklab olishi mumkin. `profile.email` sozlanganda `mailto:` havolasi pochta dasturida to‘ldirilgan xabarni ochadi; **yuborish foydalanuvchining pochta dasturida bajariladi**. Bu kompyuterda pochta dasturi sozlangan bo‘lishi kerak. Shakl yuborildi degan soxta xabar bermaydi. Haqiqiy server formasi kerak bo‘lsa, HTTPS endpoint, serverda tekshirish, tezlik cheklovi va spam himoyasi alohida qo‘shiladi; sirli kalitlarni frontendga yozmang.

## Maxfiylik va foydalanish qulayligi

Kuzatuv tizimi, tashqi shrift, analytics va tashqi so‘rovlar yo‘q. Faqat til va mavzu qurilma xotirasida saqlanadi. Shakl xabarlari saqlanmaydi. Shakldagi matn til yoki sahifa almashtirilganda yo‘qoladi. Klaviatura fokusi ko‘rinadi, dialoglar Escape bilan yopiladi, mobil menyuda ochilish holati e’lon qilinadi. Harakatni kamaytirish sozlamasi qo‘llanadi.

## Chegaralar

JARVIS va CyberLab uchun tashqi dastur funksiyalari yaratilmagan: ular portfolio ichidagi ochiq belgilangan demo konseptlar. Qaydlar boshlang‘ich qo‘llanma matnlari. Sayt egasining haqiqiy biografiyasi va kontaktlarini egasi kiritishi kerak.
