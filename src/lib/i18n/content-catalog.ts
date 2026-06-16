import { translations, type TranslationKey } from "./translations";

/**
 * Catalog mapping every translation key to:
 * - friendly Arabic label (what the user sees in the dashboard)
 * - the page/section it belongs to
 *
 * Adding a new key in translations.ts? Add it here too with a label,
 * otherwise it falls under "غير مصنّف".
 */

export type ContentGroupId =
  | "brand"
  | "nav"
  | "home"
  | "about"
  | "services"
  | "contact"
  | "follow"
  | "footer"
  | "common"
  | "offers"
  | "wa"
  | "language";

export const GROUP_LABELS: Record<ContentGroupId, string> = {
  brand: "العلامة التجارية",
  nav: "قائمة التنقل",
  home: "الصفحة الرئيسية",
  about: "من نحن",
  services: "صفحة الخدمات",
  contact: "تواصل معنا",
  follow: "تابعنا",
  footer: "الفوتر",
  common: "نصوص عامة (أزرار/تسميات)",
  offers: "العروض",
  wa: "رسائل واتساب",
  language: "زر اللغة",
};

export const GROUP_ORDER: ContentGroupId[] = [
  "home",
  "about",
  "services",
  "contact",
  "follow",
  "nav",
  "footer",
  "common",
  "offers",
  "wa",
  "brand",
  "language",
];

export const FIELD_LABELS: Partial<Record<TranslationKey, string>> = {
  // Brand
  "brand.name": "اسم العلامة التجارية",
  "brand.tagline": "وصف مختصر للعلامة",
  // Nav
  "nav.home": "رابط: الرئيسية",
  "nav.services": "رابط: الخدمات",
  "nav.shop": "رابط: المتجر",
  "nav.about": "رابط: من نحن",
  "nav.contact": "رابط: تواصل معنا",
  "nav.bookWhatsapp": "زر: احجز عبر واتساب",
  // Common
  "common.viewAll": "زر: عرض الكل",
  "common.bookNow": "زر: احجز الآن",
  "common.contactUs": "زر: تواصل معنا",
  "common.learnMore": "زر: اعرف المزيد",
  "common.details": "زر: تفاصيل",
  "common.whatsapp": "تسمية: واتساب",
  "common.call": "تسمية: اتصال",
  "common.location": "تسمية: الموقع",
  "common.workingHours": "تسمية: ساعات العمل",
  "common.chooseBranch": "تسمية: اختر الفرع",
  "common.chooseBranchToBook": "تسمية: اختر الفرع للحجز",
  "common.loading": "نص: جاري التحميل",
  "common.getToKnow": "تسمية: تعرف علينا",
  "common.followUs": "تسمية: تابعنا",
  "common.followOnInstagram": "زر: تابعنا على إنستغرام",
  "common.followOnTiktok": "زر: تابعنا على تيك توك",
  "common.close": "زر: إغلاق",
  // Home — Hero
  "home.hero.titleLead": "البطل: السطر الأول",
  "home.hero.titleAccent": "البطل: السطر الثاني (مميّز)",
  "home.hero.subtitle": "البطل: النص التوضيحي",
  // Home — Services section
  "home.services.title": "قسم الخدمات: العنوان",
  "home.services.subtitle": "قسم الخدمات: العنوان الفرعي",
  // Home — Offers section
  "home.offers.title": "قسم العروض: العنوان",
  "home.offers.subtitle": "قسم العروض: العنوان الفرعي",
  // Home — Why us
  "home.why.titleLead": "قسم لماذا نحن: السطر الأول",
  "home.why.titleAccent": "قسم لماذا نحن: السطر الثاني (مميّز)",
  "home.why.subtitle": "قسم لماذا نحن: العنوان الفرعي",
  "home.why.feature1.title": "ميزة 1: العنوان",
  "home.why.feature1.desc": "ميزة 1: الوصف",
  "home.why.feature2.title": "ميزة 2: العنوان",
  "home.why.feature2.desc": "ميزة 2: الوصف",
  "home.why.feature3.title": "ميزة 3: العنوان",
  "home.why.feature3.desc": "ميزة 3: الوصف",
  "home.why.feature4.title": "ميزة 4: العنوان",
  "home.why.feature4.desc": "ميزة 4: الوصف",
  // Home — Branches
  "home.branches.titleLead": "قسم الفروع: السطر الأول",
  "home.branches.titleAccent": "قسم الفروع: السطر الثاني (مميّز)",
  "home.branches.subtitle": "قسم الفروع: العنوان الفرعي",
  "home.badge.why": "شارة: لماذا نحن",
  "home.badge.branches": "شارة: الفروع",
  // Services
  "services.badge": "شارة الصفحة",
  "services.title": "عنوان الصفحة",
  "services.subtitle": "العنوان الفرعي للصفحة",
  "services.cta.title": "صندوق الدعوة: العنوان",
  "services.cta.subtitle": "صندوق الدعوة: النص",
  // About
  "about.badge": "شارة الصفحة",
  "about.title": "عنوان الصفحة",
  "about.subtitle": "العنوان الفرعي",
  "about.story.title": "قصتنا: العنوان",
  "about.story.body": "قصتنا: النص",
  "about.vision.title": "رؤيتنا: العنوان",
  "about.vision.body": "رؤيتنا: النص",
  "about.mission.title": "مهمتنا: العنوان",
  "about.mission.body": "مهمتنا: النص",
  "about.values.title": "قيمنا: عنوان القسم",
  "about.values.v1.title": "قيمة 1: العنوان",
  "about.values.v1.desc": "قيمة 1: الوصف",
  "about.values.v2.title": "قيمة 2: العنوان",
  "about.values.v2.desc": "قيمة 2: الوصف",
  "about.values.v3.title": "قيمة 3: العنوان",
  "about.values.v3.desc": "قيمة 3: الوصف",
  "about.values.v4.title": "قيمة 4: العنوان",
  "about.values.v4.desc": "قيمة 4: الوصف",
  // Contact
  "contact.badge": "شارة الصفحة",
  "contact.title": "عنوان الصفحة",
  "contact.subtitle": "العنوان الفرعي",
  "contact.preferWhatsapp": "ملاحظة تفضيل واتساب",
  "contact.address": "تسمية: العنوان",
  "contact.phone": "تسمية: الهاتف",
  "contact.whatsapp": "تسمية: واتساب",
  "contact.hours": "تسمية: ساعات العمل",
  "contact.openMaps": "زر: افتح في الخرائط",
  // Follow
  "follow.badge": "شارة القسم",
  "follow.title": "عنوان القسم",
  "follow.subtitle": "النص الفرعي للقسم",
  // WhatsApp
  "wa.defaultMsg": "رسالة افتراضية عامة",
  "wa.serviceMsg": "رسالة حجز خدمة",
  "wa.offerMsg": "رسالة استفسار عن عرض",
  "wa.chooseBranchTitle": "عنوان مربع اختيار الفرع",
  // Offer card
  "offer.endsIn": "العداد: ينتهي العرض خلال",
  "offer.ended": "العداد: انتهى العرض",
  "offer.days": "تسمية: يوم",
  "offer.hours": "تسمية: ساعة",
  "offer.minutes": "تسمية: دقيقة",
  "offer.seconds": "تسمية: ثانية",
  "offer.badgeTop": "شارة العرض: السطر الأول",
  "offer.badgeBottom": "شارة العرض: السطر الثاني",
  "offer.trustTitle": "بطاقة الثقة: العنوان",
  "offer.trustDesc": "بطاقة الثقة: الوصف",
  // Footer
  "footer.quickLinks": "عنوان: روابط سريعة",
  "footer.branches": "عنوان: فروعنا",
  "footer.contact": "عنوان: تواصل",
  "footer.rights": "نص الحقوق",
  // Language
  "lang.toggle": "زر تبديل اللغة",
};

export function getGroupForKey(key: string): ContentGroupId {
  const prefix = key.split(".")[0];
  if (prefix === "offer") return "offers";
  if ((GROUP_ORDER as readonly string[]).includes(prefix)) return prefix as ContentGroupId;
  if (prefix === "lang") return "language";
  return "common";
}

export type ContentField = {
  key: TranslationKey;
  label: string;
  group: ContentGroupId;
  defaultAr: string;
  defaultEn: string;
};

export function getAllFields(): ContentField[] {
  const arDict = translations.ar as Record<string, string>;
  const enDict = translations.en as Record<string, string>;
  const keys = Object.keys(arDict) as TranslationKey[];
  return keys.map((k) => ({
    key: k,
    label: FIELD_LABELS[k] ?? (k as string),
    group: getGroupForKey(k as string),
    defaultAr: arDict[k] ?? "",
    defaultEn: enDict[k] ?? "",
  }));
}

export function groupFields(fields: ContentField[]) {
  const map = new Map<ContentGroupId, ContentField[]>();
  for (const g of GROUP_ORDER) map.set(g, []);
  for (const f of fields) {
    const arr = map.get(f.group) ?? [];
    arr.push(f);
    map.set(f.group, arr);
  }
  return Array.from(map.entries())
    .filter(([, arr]) => arr.length > 0)
    .map(([g, arr]) => ({ group: g, label: GROUP_LABELS[g], fields: arr }));
}
