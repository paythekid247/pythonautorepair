"use client";

import React, { useMemo, useRef, useState } from "react";

type PopularMake =
  | "Toyota"
  | "Honda"
  | "Ford"
  | "Chevrolet"
  | "Nissan"
  | "Hyundai"
  | "Kia"
  | "Jeep"
  | "Subaru"
  | "Volkswagen"
  | "BMW"
  | "Mercedes-Benz"
  | "Tesla"
  | "Other";

const POPULAR_MAKES: PopularMake[] = [
  "Toyota",
  "Honda",
  "Ford",
  "Chevrolet",
  "Nissan",
  "Hyundai",
  "Kia",
  "Jeep",
  "Subaru",
  "Volkswagen",
  "BMW",
  "Mercedes-Benz",
  "Tesla",
  "Other",
];

const POPULAR_MODELS_BY_MAKE: Record<Exclude<PopularMake, "Other">, string[]> = {
  Toyota: ["Camry", "Corolla", "RAV4", "Highlander", "Tacoma", "Tundra", "4Runner", "Prius", "Sienna", "Avalon"],
  Honda: ["Civic", "Accord", "CR-V", "HR-V", "Pilot", "Odyssey", "Ridgeline", "Fit", "Passport"],
  Ford: ["F-150", "Escape", "Explorer", "Edge", "Bronco", "Ranger", "Mustang", "Expedition", "Fusion"],
  Chevrolet: ["Silverado 1500", "Equinox", "Tahoe", "Suburban", "Traverse", "Malibu", "Colorado", "Camaro", "Blazer"],
  Nissan: ["Altima", "Sentra", "Rogue", "Pathfinder", "Murano", "Frontier", "Maxima", "Versa"],
  Hyundai: ["Elantra", "Sonata", "Tucson", "Santa Fe", "Kona", "Palisade", "Accent"],
  Kia: ["Forte", "K5", "Sportage", "Sorento", "Telluride", "Soul", "Rio"],
  Jeep: ["Wrangler", "Grand Cherokee", "Cherokee", "Compass", "Renegade", "Gladiator"],
  Subaru: ["Outback", "Forester", "Crosstrek", "Impreza", "Legacy", "Ascent", "WRX"],
  Volkswagen: ["Jetta", "Passat", "Tiguan", "Atlas", "Golf", "Taos"],
  BMW: ["3 Series", "5 Series", "X3", "X5", "X1", "4 Series", "7 Series"],
  "Mercedes-Benz": ["C-Class", "E-Class", "GLC", "GLE", "A-Class", "S-Class"],
  Tesla: ["Model 3", "Model Y", "Model S", "Model X", "Cybertruck"],
};

const YEARS: string[] = Array.from({ length: 28 }, (_, i) => String(new Date().getFullYear() - i));

type Lang = "en" | "es" | "ht" | "ru";

const I18N: Record<Lang, Record<string, string>> = {
  en: {
    tagline: "Step-by-step: VIN → photos → details → fast estimate range.",
    name_optional: "Name (optional)",
    phone_optional: "Phone (optional)",
    city_optional: "City/Zip (optional)",
    vehicle_ident: "Vehicle Identification",
    choose_one_way: "Choose one way to provide the VIN.",
    dont_know_vin: "Don’t know where to find the VIN?",
    scanner: "Scanner",
    next_to_vehicle: "Next to the vehicle?",
    album: "Album",
    reg_insurance_photo: "Registration/insurance photo?",
    type_vin: "Type VIN",
    manual_entry: "Manual entry",
    cant_access: "Can't access",
    the_vin: "the VIN?",
    working_reading: "Working… (reading VIN)",
    enter_vin_manually: "Enter VIN manually",
    vin_lookup: "VIN Lookup",
    vin_verified: "VIN verified",
    clear_start_over: "Clear and start over",
    vehicle_details: "Vehicle Details",
    select_year_make_model: "Select Year, Make, and Model.",
    i_can_scan: "I can scan the VIN",
    year: "Year",
    make: "Make",
    model: "Model",
    select: "Select",
    enter_model: "Enter model (example: CX-5, Silverado 2500HD, etc.)",
    vehicle_set_next_photos: "Vehicle set. Next: upload damage photos.",
    photos: "Photos",
    add_photos_damage: "Add photos of the damaged areas.",
    pictures: "Pictures",
    of_the_damages: "of the damages",
    upload: "Upload",
    from_album: "from album",
    clear: "Clear",
    photos_label: "photos",
    photo_label: "photo",
    selected: "selected",
    damage_details: "Damage Details",
    optional: "(optional)",
    add_notes_help: "If you want, add notes that help us estimate faster.",
    damage_placeholder: "Example: Front bumper cracked, hood bent, passenger headlight broken...",
    complete_vin_step: "Complete VIN Step",
    proceed_to_photos: "Proceed to Photos",
    python_fast_estimates: "Python Fast Estimates",
    sending: "Sending...",
    complete_vin_first: "Complete the VIN step first",
    add_damage_photos: "Add damage photos to continue",
    estimate_preliminary: "Estimates are preliminary and may change after inspection.",
    call: "Call",
    email: "Email",
    get_directions: "Get Directions",
    close: "Close",
    call_now: "Call Now",
    text: "Text",
    copy_number: "Copy Number",
    email_now: "Email Now",
    copy_email: "Copy Email",
    open_directions: "Open Directions",
    copy_address: "Copy Address",
    toast_copied: "copied",
    toast_copy_failed: "Copy failed",
    vin_places_title: "Where to find the VIN",
    vin_places_sub: "Most vehicles have the VIN in at least two places.",
    vin_place_1_title: "Windshield (driver side)",
    vin_place_1_body: "Look through the windshield at the dashboard corner on the driver side.",
    vin_place_2_title: "Driver door jamb sticker",
    vin_place_2_body: "Open the driver door and check the sticker on the pillar or door edge.",
    vin_place_3_title: "Documents",
    vin_place_3_body: "Registration, insurance card, or title often lists the VIN.",
    vin_place_4_title: "Engine bay / frame",
    vin_place_4_body: "Some vehicles have VIN stamps under the hood or near strut towers.",
    vin_scanner_title: "VIN Scanner",
    vin_scanner_sub: "Take a clear photo of the VIN.",
    take_vin_photo: "Take VIN Photo",
    reading: "Reading...",
    err_complete_vin_step: "Complete the VIN step first.",
    err_add_one_damage_photo: "Please add at least one damage photo first.",
    err_verify_vin_first: "Please verify the VIN first (scan/album/manual lookup).",
    err_select_ym_model: "Please select Year, Make, and Model.",
    err_estimate_failed: "Estimate failed.",
    err_vin_decode_failed: "VIN decode failed.",
    err_vin_17: "VIN must be 17 characters.",
    err_vin_scan_failed: "VIN scan failed.",
    err_vin_read_failed: "Could not read VIN from image.",
    err_something_wrong: "Something went wrong.",
  },
  es: {
    tagline: "Paso a paso: VIN → fotos → detalles opcionales → estimado rápido.",
    name_optional: "Nombre (opcional)",
    phone_optional: "Teléfono (opcional)",
    city_optional: "Ciudad/ZIP (opcional)",
    vehicle_ident: "Identificación del vehículo",
    choose_one_way: "Elige una forma de proporcionar el VIN.",
    dont_know_vin: "¿No sabes dónde encontrar el VIN?",
    scanner: "Escáner",
    next_to_vehicle: "¿Junto al vehículo?",
    album: "Álbum",
    reg_insurance_photo: "¿Foto de registro/seguro?",
    type_vin: "Escribir VIN",
    manual_entry: "Entrada manual",
    cant_access: "¿No puedes acceder",
    the_vin: "al VIN?",
    working_reading: "Trabajando… (leyendo VIN)",
    enter_vin_manually: "Ingresa el VIN manualmente",
    vin_lookup: "Buscar VIN",
    vin_verified: "VIN verificado",
    clear_start_over: "Borrar y empezar de nuevo",
    vehicle_details: "Detalles del vehículo",
    select_year_make_model: "Selecciona Año, Marca y Modelo.",
    i_can_scan: "Puedo escanear el VIN",
    year: "Año",
    make: "Marca",
    model: "Modelo",
    select: "Seleccionar",
    enter_model: "Ingresa el modelo (ej.: CX-5, Silverado 2500HD, etc.)",
    vehicle_set_next_photos: "Vehículo listo. Siguiente: sube fotos del daño.",
    photos: "Fotos",
    add_photos_damage: "Agrega fotos de las áreas dañadas.",
    pictures: "Fotos",
    of_the_damages: "del daño",
    upload: "Subir",
    from_album: "desde álbum",
    clear: "Borrar",
    photos_label: "fotos",
    photo_label: "foto",
    selected: "seleccionadas",
    damage_details: "Detalles del daño",
    optional: "(opcional)",
    add_notes_help: "Si quieres, agrega notas para estimar más rápido.",
    damage_placeholder: "Ej.: Parachoques delantero roto, capó doblado, faro del pasajero dañado...",
    complete_vin_step: "Completar paso de VIN",
    proceed_to_photos: "Ir a Fotos",
    python_fast_estimates: "Estimados Rápidos Python",
    sending: "Enviando...",
    complete_vin_first: "Completa el paso de VIN primero",
    add_damage_photos: "Agrega fotos del daño para continuar",
    estimate_preliminary: "Los estimados son preliminares y pueden cambiar tras la inspección.",
    call: "Llamar",
    email: "Correo",
    get_directions: "Cómo llegar",
    close: "Cerrar",
    call_now: "Llamar ahora",
    text: "Texto",
    copy_number: "Copiar número",
    email_now: "Enviar correo",
    copy_email: "Copiar correo",
    open_directions: "Abrir direcciones",
    copy_address: "Copiar dirección",
    toast_copied: "copiado",
    toast_copy_failed: "Error al copiar",
    vin_places_title: "Dónde encontrar el VIN",
    vin_places_sub: "La mayoría de los vehículos tienen el VIN en al menos dos lugares.",
    vin_place_1_title: "Parabrisas (lado conductor)",
    vin_place_1_body: "Mira por el parabrisas en la esquina del tablero del lado del conductor.",
    vin_place_2_title: "Etiqueta en el marco de la puerta",
    vin_place_2_body: "Abre la puerta del conductor y revisa la etiqueta en el pilar o borde.",
    vin_place_3_title: "Documentos",
    vin_place_3_body: "Registro, seguro o título suelen mostrar el VIN.",
    vin_place_4_title: "Bahía del motor / chasis",
    vin_place_4_body: "Algunos vehículos tienen el VIN estampado bajo el capó o cerca de torres.",
    vin_scanner_title: "Escáner de VIN",
    vin_scanner_sub: "Toma una foto clara del VIN.",
    take_vin_photo: "Tomar foto del VIN",
    reading: "Leyendo...",
    err_complete_vin_step: "Completa el paso de VIN primero.",
    err_add_one_damage_photo: "Agrega al menos 1 foto del daño.",
    err_verify_vin_first: "Verifica el VIN primero (escáner/álbum/escritura).",
    err_select_ym_model: "Selecciona Año, Marca y Modelo.",
    err_estimate_failed: "Falló el estimado.",
    err_vin_decode_failed: "Falló la lectura del VIN.",
    err_vin_17: "El VIN debe tener 17 caracteres.",
    err_vin_scan_failed: "Falló el escaneo del VIN.",
    err_vin_read_failed: "No se pudo leer el VIN de la imagen.",
    err_something_wrong: "Algo salió mal.",
  },
  ht: {
    tagline: "Pa etap: VIN → foto → detay opsyonèl → estimasyon rapid.",
    name_optional: "Non (opsyonèl)",
    phone_optional: "Telefòn (opsyonèl)",
    city_optional: "Vil / ZIP (opsyonèl)",
    vehicle_ident: "Idantifikasyon machin",
    choose_one_way: "Chwazi yon fason pou bay VIN nan.",
    dont_know_vin: "Ou pa konnen kote VIN lan ye?",
    scanner: "Eskanè",
    next_to_vehicle: "Bò kote machin nan?",
    album: "Albòm",
    reg_insurance_photo: "Foto enskripsyon/asirans?",
    type_vin: "Tape VIN",
    manual_entry: "Antre manyèl",
    cant_access: "Ou pa ka jwenn",
    the_vin: "VIN lan?",
    working_reading: "Ap travay… (ap li VIN)",
    enter_vin_manually: "Antre VIN manyèlman",
    vin_lookup: "Chèche VIN",
    vin_verified: "VIN verifye",
    clear_start_over: "Efase epi rekòmanse",
    vehicle_details: "Detay machin",
    select_year_make_model: "Chwazi Ane, Mak, ak Modèl.",
    i_can_scan: "Mwen ka eskanè VIN lan",
    year: "Ane",
    make: "Mak",
    model: "Modèl",
    select: "Chwazi",
    enter_model: "Antre modèl la (egzanp: CX-5, Silverado 2500HD, elatriye)",
    vehicle_set_next_photos: "Machin nan pare. Pwochen: mete foto domaj yo.",
    photos: "Foto",
    add_photos_damage: "Ajoute foto zòn ki domaje yo.",
    pictures: "Foto",
    of_the_damages: "domaj yo",
    upload: "Telechaje",
    from_album: "soti nan albòm",
    clear: "Netwaye",
    photos_label: "foto",
    photo_label: "foto",
    selected: "chwazi",
    damage_details: "Detay domaj",
    optional: "(opsyonèl)",
    add_notes_help: "Si ou vle, ajoute nòt pou ede nou estime pi vit.",
    damage_placeholder: "Egzanp: Bòmpè devan fann, kapo pliye, limyè devan pasaje kase...",
    complete_vin_step: "Fini etap VIN",
    proceed_to_photos: "Ale nan Foto",
    python_fast_estimates: "Estimasyon Rapid Python",
    sending: "Ap voye...",
    complete_vin_first: "Fini etap VIN an anvan",
    add_damage_photos: "Ajoute foto domaj pou kontinye",
    estimate_preliminary: "Estimasyon yo preliminè epi yo ka chanje apre enspeksyon.",
    call: "Rele",
    email: "Imèl",
    get_directions: "Jwenn direksyon",
    close: "Fèmen",
    call_now: "Rele kounye a",
    text: "Tèks",
    copy_number: "Kopi nimewo",
    email_now: "Voye imèl",
    copy_email: "Kopi imèl",
    open_directions: "Louvri direksyon",
    copy_address: "Kopi adrès",
    toast_copied: "kopye",
    toast_copy_failed: "Kopi echwe",
    vin_places_title: "Kote pou jwenn VIN lan",
    vin_places_sub: "Pifò machin gen VIN lan nan omwen de kote.",
    vin_place_1_title: "Vè devan (bò chofè)",
    vin_place_1_body: "Gade atravè vè devan an sou kwen tablodbò bò chofè a.",
    vin_place_2_title: "Etikèt sou pòt chofè",
    vin_place_2_body: "Louvri pòt chofè a epi gade etikèt sou poto a oswa bò pòt la.",
    vin_place_3_title: "Dokiman",
    vin_place_3_body: "Kat enskripsyon, asirans, oswa tit souvan gen VIN lan.",
    vin_place_4_title: "Anba kapo / chasi",
    vin_place_4_body: "Kèk machin gen VIN an anba kapo a oswa toupre pati ankadreman an.",
    vin_scanner_title: "Eskanè VIN",
    vin_scanner_sub: "Pran yon foto ki klè sou VIN lan.",
    take_vin_photo: "Pran foto VIN",
    reading: "Ap li...",
    err_complete_vin_step: "Fini etap VIN an anvan.",
    err_add_one_damage_photo: "Tanpri ajoute omwen 1 foto domaj.",
    err_verify_vin_first: "Tanpri verifye VIN lan anvan (eskanè/albòm/tape).",
    err_select_ym_model: "Tanpri chwazi Ane, Mak, ak Modèl.",
    err_estimate_failed: "Estimasyon an echwe.",
    err_vin_decode_failed: "Dekodaj VIN echwe.",
    err_vin_17: "VIN lan dwe gen 17 karaktè.",
    err_vin_scan_failed: "Eskanè VIN echwe.",
    err_vin_read_failed: "Nou pa t ka li VIN lan nan foto a.",
    err_something_wrong: "Gen yon pwoblèm.",
  },
  ru: {
    tagline: "Шаги: VIN → фото → (опционально) детали → быстрый диапазон оценки.",
    name_optional: "Имя (необязательно)",
    phone_optional: "Телефон (необязательно)",
    city_optional: "Город/ZIP (необязательно)",
    vehicle_ident: "Идентификация авто",
    choose_one_way: "Выберите способ указать VIN.",
    dont_know_vin: "Не знаете, где найти VIN?",
    scanner: "Сканер",
    next_to_vehicle: "Рядом с авто?",
    album: "Альбом",
    reg_insurance_photo: "Фото регистрации/страховки?",
    type_vin: "Ввести VIN",
    manual_entry: "Ручной ввод",
    cant_access: "Нет доступа",
    the_vin: "к VIN?",
    working_reading: "Обработка… (чтение VIN)",
    enter_vin_manually: "Введите VIN вручную",
    vin_lookup: "Проверить VIN",
    vin_verified: "VIN подтверждён",
    clear_start_over: "Очистить и начать заново",
    vehicle_details: "Данные автомобиля",
    select_year_make_model: "Выберите год, марку и модель.",
    i_can_scan: "Я могу отсканировать VIN",
    year: "Год",
    make: "Марка",
    model: "Модель",
    select: "Выбрать",
    enter_model: "Введите модель (пример: CX-5, Silverado 2500HD и т.д.)",
    vehicle_set_next_photos: "Авто выбрано. Далее: загрузите фото повреждений.",
    photos: "Фото",
    add_photos_damage: "Добавьте фото повреждённых зон.",
    pictures: "Снимки",
    of_the_damages: "повреждений",
    upload: "Загрузить",
    from_album: "из альбома",
    clear: "Очистить",
    photos_label: "фото",
    photo_label: "фото",
    selected: "выбрано",
    damage_details: "Детали повреждений",
    optional: "(необязательно)",
    add_notes_help: "Если хотите — добавьте заметки, чтобы мы оценили быстрее.",
    damage_placeholder: "Пример: треснул передний бампер, капот согнут, фара пассажира разбита...",
    complete_vin_step: "Завершить шаг VIN",
    proceed_to_photos: "Перейти к фото",
    python_fast_estimates: "Python Быстрая Оценка",
    sending: "Отправка...",
    complete_vin_first: "Сначала завершите шаг VIN",
    add_damage_photos: "Добавьте фото повреждений, чтобы продолжить",
    estimate_preliminary: "Оценка предварительная и может измениться после осмотра.",
    call: "Позвонить",
    email: "Email",
    get_directions: "Маршрут",
    close: "Закрыть",
    call_now: "Позвонить сейчас",
    text: "SMS",
    copy_number: "Скопировать номер",
    email_now: "Написать письмо",
    copy_email: "Скопировать email",
    open_directions: "Открыть маршрут",
    copy_address: "Скопировать адрес",
    toast_copied: "скопировано",
    toast_copy_failed: "Не удалось скопировать",
    vin_places_title: "Где найти VIN",
    vin_places_sub: "Обычно VIN указан как минимум в двух местах.",
    vin_place_1_title: "Лобовое стекло (сторона водителя)",
    vin_place_1_body: "Посмотрите через лобовое на угол торпедо со стороны водителя.",
    vin_place_2_title: "Наклейка на стойке двери водителя",
    vin_place_2_body: "Откройте дверь водителя и найдите наклейку на стойке или кромке.",
    vin_place_3_title: "Документы",
    vin_place_3_body: "Регистрация, страховка или title часто содержат VIN.",
    vin_place_4_title: "Под капотом / на раме",
    vin_place_4_body: "Иногда VIN выбит под капотом или рядом со стойками.",
    vin_scanner_title: "VIN Сканер",
    vin_scanner_sub: "Сделайте чёткое фото VIN.",
    take_vin_photo: "Сделать фото VIN",
    reading: "Чтение...",
    err_complete_vin_step: "Сначала завершите шаг VIN.",
    err_add_one_damage_photo: "Добавьте хотя бы 1 фото повреждений.",
    err_verify_vin_first: "Сначала подтвердите VIN (сканер/альбом/ввод).",
    err_select_ym_model: "Выберите год, марку и модель.",
    err_estimate_failed: "Ошибка оценки.",
    err_vin_decode_failed: "Ошибка декодирования VIN.",
    err_vin_17: "VIN должен быть 17 символов.",
    err_vin_scan_failed: "Ошибка сканирования VIN.",
    err_vin_read_failed: "Не удалось прочитать VIN с изображения.",
    err_something_wrong: "Что-то пошло не так.",
  },
};

function normalizeVin(raw: string) {
  return (raw || "").toUpperCase().replace(/[^A-Z0-9]/g, "").replace(/[IOQ]/g, "");
}

function clampText(s: string, max = 2000) {
  if (!s) return "";
  return s.length > max ? s.slice(0, max) + "…" : s;
}

async function safeCopy(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

function caseInsensitiveFind(options: string[], target: string) {
  const t = (target || "").trim().toLowerCase();
  if (!t) return null;
  return options.find((o) => o.toLowerCase() === t) ?? null;
}

async function safeJson<T>(res: Response): Promise<{ ok: boolean; status: number; data?: T; raw: string }> {
  const status = res.status;
  const raw = await res.text();
  if (!raw) return { ok: res.ok, status, raw: "" };
  try {
    const data = JSON.parse(raw) as T;
    return { ok: res.ok, status, data, raw };
  } catch {
    return { ok: false, status, raw };
  }
}

function RoundAction({
  title,
  subtitle,
  emoji,
  onClick,
  disabled,
  tone = "neutral",
}: {
  title: string;
  subtitle?: string;
  emoji: string;
  onClick: () => void;
  disabled?: boolean;
  tone?: "neutral" | "good" | "warn";
}) {
  const toneClass =
    tone === "good"
      ? "border-emerald-300/25 bg-emerald-500/10 hover:bg-emerald-500/15"
      : tone === "warn"
        ? "border-red-400/25 bg-red-500/10 hover:bg-red-500/15"
        : "border-emerald-200/15 bg-emerald-900/15 hover:bg-emerald-900/20";

  return (
    <button type="button" onClick={onClick} disabled={disabled} className="group flex flex-col items-center gap-2 disabled:opacity-60">
      <div
        className={[
          "relative grid h-16 w-16 place-items-center rounded-full border",
          toneClass,
          "shadow-[0_14px_28px_rgba(0,0,0,0.55)]",
          "ring-1 ring-white/10",
          "before:absolute before:inset-[-2px] before:rounded-full before:pointer-events-none",
          "before:bg-[conic-gradient(from_180deg,rgba(255,215,0,0.52),rgba(255,215,0,0.10),transparent_40%,rgba(255,215,0,0.30),transparent_70%,rgba(255,215,0,0.52))] before:opacity-80 before:blur-[0.6px]",
          "after:absolute after:inset-0 after:rounded-full after:pointer-events-none",
          "after:bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.22),transparent_55%)] after:opacity-80",
          "transition-transform duration-150",
          "group-hover:-translate-y-[1px] group-active:translate-y-[1px]",
        ].join(" ")}
      >
        <span className="text-xl">{emoji}</span>
        <div className="absolute inset-0 rounded-full shadow-[inset_0_1px_0_rgba(255,255,255,0.10)]" />
      </div>

      <div className="text-center">
        <div className="text-sm font-extrabold text-white/95 leading-tight">{title}</div>
        {subtitle ? <div className="mt-0.5 text-xs text-white/70 leading-tight">{subtitle}</div> : null}
      </div>
    </button>
  );
}

function GoldShineButton({
  children,
  onClick,
  disabled,
  variant = "primary",
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary";
}) {
  const base =
    "relative w-full rounded-2xl px-5 py-4 text-lg font-extrabold disabled:opacity-60 transition-transform duration-150 active:translate-y-[1px] outline-none";

  const surface =
    variant === "primary"
      ? "bg-[linear-gradient(135deg,rgba(255,215,0,0.34),rgba(255,255,255,0.10),rgba(255,215,0,0.22))] border border-yellow-300/45 hover:border-yellow-200/65"
      : "bg-emerald-950/30 border border-yellow-300/25 hover:border-yellow-200/40 hover:bg-emerald-950/40";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={[
        base,
        surface,
        "shadow-[0_14px_28px_rgba(0,0,0,0.55)]",
        "ring-1 ring-white/10",
        "after:absolute after:inset-[-2px] after:rounded-[18px] after:pointer-events-none",
        "after:bg-[conic-gradient(from_180deg,rgba(255,215,0,0.55),rgba(255,215,0,0.12),transparent_40%,rgba(255,215,0,0.32),transparent_70%,rgba(255,215,0,0.55))]",
        "after:opacity-85 after:blur-[1px]",
        "before:absolute before:inset-0 before:rounded-2xl before:pointer-events-none",
        "before:bg-[linear-gradient(110deg,transparent_0%,rgba(255,215,0,0.20)_35%,rgba(255,255,255,0.22)_50%,rgba(255,215,0,0.16)_65%,transparent_100%)]",
        "before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300",
      ].join(" ")}
    >
      <span className="relative z-10">{children}</span>
      <span className="absolute inset-0 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.10)]" />
    </button>
  );
}

export default function Page() {
  const BUSINESS_NAME = "Python Auto Repair";
  const BUSINESS_PHONE_PRETTY = "(561) 371-5673";
  const BUSINESS_PHONE_E164 = "+15613715673";
  const BUSINESS_EMAIL = "info@pythonautorepair.com";
  const BUSINESS_ADDRESS = "1114 NE 4th Ave, Fort Lauderdale, FL 33304";

  const [lang, setLang] = useState<Lang>("en");
  const t = (key: string) => I18N[lang]?.[key] ?? I18N.en[key] ?? key;

  const googleMapsLink = useMemo(
    () => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(BUSINESS_ADDRESS)}`,
    [BUSINESS_ADDRESS]
  );

  const [name, setName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [location, setLocation] = useState("");

  const [vin, setVin] = useState("");
  const [noVinAccess, setNoVinAccess] = useState(false);
  const [year, setYear] = useState("");
  const [make, setMake] = useState<PopularMake | "">("");

  const [modelChoice, setModelChoice] = useState<string>("");
  const [modelOther, setModelOther] = useState<string>("");

  const [showVinHelp, setShowVinHelp] = useState(false);
  const [showVinScanner, setShowVinScanner] = useState(false);
  const [vinBusy, setVinBusy] = useState(false);
  const [vinError, setVinError] = useState<string | null>(null);

  const [contactModal, setContactModal] = useState<null | "phone" | "email" | "address">(null);

  const [photos, setPhotos] = useState<File[]>([]);
  const [damageDescription, setDamageDescription] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  const [toast, setToast] = useState<string | null>(null);

  const [showManualVinInput, setShowManualVinInput] = useState(false);
  const [vinVerified, setVinVerified] = useState(false);

  const albumVinRef = useRef<HTMLInputElement | null>(null);
  const cameraVinRef = useRef<HTMLInputElement | null>(null);
  const cameraDamageRef = useRef<HTMLInputElement | null>(null);
  const uploadDamageRef = useRef<HTMLInputElement | null>(null);

  const modelOptions = useMemo(() => {
    if (!make || make === "Other") return ["Other"];
    const list = POPULAR_MODELS_BY_MAKE[make as Exclude<PopularMake, "Other">] || [];
    return [...list, "Other"];
  }, [make]);

  const selectedModel = useMemo(() => {
    if (!modelChoice) return "";
    if (modelChoice === "Other") return (modelOther || "").trim();
    return modelChoice;
  }, [modelChoice, modelOther]);

  const hasManualVehicle = useMemo(() => Boolean(year && make && selectedModel), [year, make, selectedModel]);
  const canUploadPhotos = useMemo(
    () => (!noVinAccess && vinVerified) || (noVinAccess && hasManualVehicle),
    [noVinAccess, vinVerified, hasManualVehicle]
  );

  const hasPhotos = useMemo(() => photos.length > 0, [photos]);

  function showToast(msg: string) {
    setToast(msg);
    window.setTimeout(() => setToast(null), 1600);
  }

  async function doCopy(text: string, label: string) {
    const ok = await safeCopy(text);
    showToast(ok ? `${label} ${t("toast_copied")}` : t("toast_copy_failed"));
  }

  function resetManualVehicleFields() {
    setYear("");
    setMake("");
    setModelChoice("");
    setModelOther("");
  }

  function setMakeAndPopularModel(decodedMake: string, decodedModel: string) {
    const matchedMake = POPULAR_MAKES.find((m) => m.toLowerCase() === decodedMake.toLowerCase()) || "Other";
    setMake(matchedMake as PopularMake);

    if (matchedMake && matchedMake !== "Other") {
      const opts = [...(POPULAR_MODELS_BY_MAKE[matchedMake as Exclude<PopularMake, "Other">] || []), "Other"];
      const found = caseInsensitiveFind(opts, decodedModel);
      if (found && found !== "Other") {
        setModelChoice(found);
        setModelOther("");
      } else {
        setModelChoice("Other");
        setModelOther(decodedModel || "");
      }
    } else {
      setModelChoice("Other");
      setModelOther(decodedModel || "");
    }
  }

  async function decodeVinAndPopulate(v: string) {
    const cleaned = normalizeVin(v);
    if (cleaned.length !== 17) throw new Error(t("err_vin_17"));

    const res = await fetch("/api/vin/decode", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vin: cleaned }),
    });

    const parsed = await safeJson<any>(res);
    if (!parsed.ok || !parsed.data?.ok) {
      const msg =
        parsed.data?.error ||
        (parsed.raw ? `(${parsed.status}) ${parsed.raw.slice(0, 180)}…` : `(${parsed.status}) ${t("err_vin_decode_failed")}`);
      throw new Error(msg);
    }

    const data = parsed.data;
    setVin(cleaned);
    setYear(String(data.year || ""));

    const decodedMake = String(data.make || "");
    const decodedModel = String(data.model || "");
    setMakeAndPopularModel(decodedMake, decodedModel);

    setVinVerified(true);
    setShowManualVinInput(false);
  }

  async function extractVinFromImage(file: File): Promise<string> {
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result).split(",")[1] || "");
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    const res = await fetch("/api/vin/extract", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        imageBase64: base64,
        mimeType: file.type || "image/jpeg",
      }),
    });

    const data = await res.json();
    if (!res.ok || !data?.ok) {
      throw new Error(data?.error || "Could not read VIN from image.");
    }

    const vin = normalizeVin(String(data.vin || ""));
    if (vin.length !== 17) {
      throw new Error("No VIN found in that photo. Try a clearer VIN close-up.");
    }

    return vin;
  }

  async function handleVinFromImage(file: File) {
    setVinError(null);
    setVinBusy(true);
    try {
      const extracted = await extractVinFromImage(file);
      await decodeVinAndPopulate(extracted);
      setNoVinAccess(false);
      setShowVinScanner(false);
    } catch (e: any) {
      setVinError(e?.message || t("err_vin_scan_failed"));
    } finally {
      setVinBusy(false);
    }
  }

  function goManualVehicle() {
    setNoVinAccess(true);
    setVinError(null);
    setVin("");
    setVinVerified(false);
    setShowManualVinInput(false);
    resetManualVehicleFields();
    setPhotos([]);
    setDamageDescription("");
  }

  function clearVinAndVehicle() {
    setVin("");
    setVinError(null);
    setNoVinAccess(false);
    setVinVerified(false);
    setShowManualVinInput(false);
    resetManualVehicleFields();
    setPhotos([]);
    setDamageDescription("");
  }

  async function submitEstimate() {
    setSubmitError(null);
    setResult(null);

    if (!canUploadPhotos) {
      setSubmitError(t("err_complete_vin_step"));
      return;
    }

    if (photos.length === 0) {
      setSubmitError(t("err_add_one_damage_photo"));
      return;
    }

    if (!noVinAccess) {
      if (!vinVerified) {
        setSubmitError(t("err_verify_vin_first"));
        return;
      }
    } else {
      if (!hasManualVehicle) {
        setSubmitError(t("err_select_ym_model"));
        return;
      }
    }

    setSubmitting(true);
    try {
      const payload = {
        name: name.trim() || undefined,
        phone: customerPhone.trim() || undefined,
        location: location.trim() || undefined,
        vin: !noVinAccess && vin ? normalizeVin(vin) : undefined,
        year: year || undefined,
        make: make || undefined,
        model: selectedModel || undefined,
        damageDescription: clampText(damageDescription, 2000) || undefined,
        photosCount: photos.length,
      };

      const res = await fetch("/api/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const parsed = await safeJson<any>(res);
      if (!parsed.ok || !parsed.data?.ok) {
        const msg =
          parsed.data?.error ||
          (parsed.raw ? `(${parsed.status}) ${parsed.raw.slice(0, 220)}…` : `(${parsed.status}) ${t("err_estimate_failed")}`);
        throw new Error(msg);
      }

      setResult(parsed.data);
    } catch (e: any) {
      setSubmitError(e?.message || t("err_something_wrong"));
    } finally {
      setSubmitting(false);
    }
  }

  function scrollTo(id: string) {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const heroMinHeight = "min-h-[280px] sm:min-h-[320px] lg:min-h-[360px]";

  const inputClass =
    "mt-2 w-full rounded-2xl border border-emerald-200/15 bg-emerald-950/55 px-4 py-3 text-white placeholder:text-white/35 outline-none focus:border-yellow-200/45 focus:ring-1 focus:ring-yellow-200/20";

  const selectClass =
    "mt-2 w-full rounded-2xl border border-emerald-200/15 bg-emerald-950/55 px-4 py-3 text-white outline-none focus:border-yellow-200/45 focus:ring-1 focus:ring-yellow-200/20";

  const panelClass =
    "mt-5 rounded-3xl border border-emerald-200/15 bg-emerald-950/35 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]";

  return (
    <main className="min-h-screen bg-[#040907] text-white">
      <div className="relative pb-28">
        <div className="absolute inset-0">
          <img src="/images/classic_car_1.jpg" alt="Classic car" className="h-full w-full object-cover object-center" />

          <div className="absolute inset-0 bg-black/18" />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,transparent_38%,rgba(0,0,0,0.62)_100%)]" />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_-12%_40%,rgba(16,185,129,0.28),transparent_55%),radial-gradient(circle_at_112%_45%,rgba(34,197,94,0.22),transparent_55%),radial-gradient(circle_at_50%_-20%,rgba(16,185,129,0.18),transparent_55%),radial-gradient(circle_at_50%_120%,rgba(34,197,94,0.14),transparent_60%)]" />
        </div>

        <div className="relative mx-auto max-w-5xl px-4 pt-10 sm:pt-14 [filter:drop-shadow(0_0_26px_rgba(16,185,129,0.20))_drop-shadow(0_0_72px_rgba(34,197,94,0.12))]">
          <div className={`${heroMinHeight} flex flex-col justify-center`}>
            <header className="flex flex-col items-center gap-5 text-center">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">{BUSINESS_NAME}</h1>

                <div className="ml-2 rounded-2xl border border-yellow-300/25 bg-black/55 px-3 py-2 text-xs text-white/85 backdrop-blur">
                  <select
                    value={lang}
                    onChange={(e) => setLang(e.target.value as Lang)}
                    className="bg-transparent outline-none"
                    aria-label="Language"
                  >
                    <option value="en">EN</option>
                    <option value="es">ES</option>
                    <option value="ht">HT</option>
                    <option value="ru">RU</option>
                  </select>
                </div>
              </div>

              <p className="max-w-2xl text-white/90">{t("tagline")}</p>
            </header>
          </div>

           {/* CARD */}
         <div className="mt-6 rounded-3xl border border-yellow-300/20 bg-black/80 p-5 backdrop-blur-md shadow-[0_18px_40px_rgba(0,0,0,0.65)] sm:p-7">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="text-sm text-white/75">{t("name_optional")}</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClass}
                  placeholder="John"
                  disabled={submitting}
                />
              </div>
              <div>
                <label className="text-sm text-white/75">{t("phone_optional")}</label>
                <input
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className={inputClass}
                  placeholder="+1 561..."
                  disabled={submitting}
                />
              </div>
              <div>
                <label className="text-sm text-white/75">{t("city_optional")}</label>
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className={inputClass}
                  placeholder="Fort Lauderdale, 33304"
                  disabled={submitting}
                />
              </div>
            </div>

            <div id="vin-section" className="mt-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold">{t("vehicle_ident")}</h2>
                  <p className="text-sm text-white/70">{t("choose_one_way")}</p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowVinHelp(true)}
                  className="text-sm underline text-white/70 hover:text-white"
                >
                  {t("dont_know_vin")}
                </button>
              </div>

              {!noVinAccess ? (
                <>
                  <div className={panelClass}>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                      <RoundAction
                        emoji="📷"
                        title={t("scanner")}
                        subtitle={t("next_to_vehicle")}
                        onClick={() => setShowVinScanner(true)}
                        disabled={vinBusy || submitting}
                        tone="good"
                      />

                      <input
                        ref={albumVinRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) handleVinFromImage(f);
                          e.currentTarget.value = "";
                        }}
                        disabled={vinBusy || submitting}
                      />
                      <RoundAction
                        emoji="🖼️"
                        title={t("album")}
                        subtitle={t("reg_insurance_photo")}
                        onClick={() => albumVinRef.current?.click()}
                        disabled={vinBusy || submitting}
                      />

                      <RoundAction
                        emoji="⌨️"
                        title={t("type_vin")}
                        subtitle={t("manual_entry")}
                        onClick={() => setShowManualVinInput((v) => !v)}
                        disabled={vinBusy || submitting}
                      />

                      <RoundAction
                        emoji="🚫"
                        title={t("cant_access")}
                        subtitle={t("the_vin")}
                        onClick={goManualVehicle}
                        disabled={vinBusy || submitting}
                        tone="warn"
                      />
                    </div>

                    {vinBusy ? <div className="mt-4 text-center text-sm text-white/75">{t("working_reading")}</div> : null}
                  </div>

                  {showManualVinInput ? (
                    <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                      <div className="sm:col-span-2">
                        <label className="text-sm text-white/75">{t("enter_vin_manually")}</label>
                        <input
                          id="vin-input"
                          value={vin}
                          onChange={(e) => setVin(e.target.value)}
                          className={`${inputClass} font-mono`}
                          placeholder="17 characters"
                          disabled={vinBusy || submitting}
                        />
                      </div>

                      <div className="sm:col-span-1 flex items-end">
                        <button
                          type="button"
                          onClick={async () => {
                            setVinError(null);
                            setVinBusy(true);
                            try {
                              await decodeVinAndPopulate(vin);
                              setNoVinAccess(false);
                              showToast(t("vin_verified"));
                              window.setTimeout(() => scrollTo("photos-section"), 250);
                            } catch (e: any) {
                              setVinError(e?.message || t("err_vin_decode_failed"));
                            } finally {
                              setVinBusy(false);
                            }
                          }}
                          className="w-full rounded-2xl border border-yellow-300/35 bg-[linear-gradient(135deg,rgba(255,215,0,0.26),rgba(255,255,255,0.08),rgba(255,215,0,0.18))] px-4 py-3 font-extrabold hover:border-yellow-200/55 disabled:opacity-60 shadow-[0_12px_24px_rgba(0,0,0,0.45)]"
                          disabled={vinBusy || submitting}
                        >
                          {t("vin_lookup")}
                        </button>
                      </div>
                    </div>
                  ) : null}

                  {vinError ? (
                    <div className="mt-3 rounded-xl border border-red-500/35 bg-red-500/10 p-3 text-sm text-red-200">
                      {vinError}
                    </div>
                  ) : null}

                  {vinVerified ? (
                    <div className="mt-3 rounded-xl border border-yellow-300/30 bg-yellow-500/10 p-3 text-sm text-yellow-100">
                      VIN: <span className="font-mono font-semibold">{normalizeVin(vin)}</span>
                      {year && make && selectedModel ? (
                        <div className="mt-1 text-white/85">
                          Vehicle: <b>{year} {make} {selectedModel}</b>
                        </div>
                      ) : null}
                      <button
                        type="button"
                        className="mt-2 text-sm underline text-white/75 hover:text-white"
                        onClick={clearVinAndVehicle}
                        disabled={vinBusy || submitting}
                      >
                        {t("clear_start_over")}
                      </button>
                    </div>
                  ) : null}
                </>
              ) : (
                <div className="mt-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-base font-bold">{t("vehicle_details")}</h3>
                      <p className="text-sm text-white/70">{t("select_year_make_model")}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setNoVinAccess(false);
                        setSubmitError(null);
                      }}
                      className="text-sm underline text-white/70 hover:text-white"
                      disabled={submitting || vinBusy}
                    >
                      {t("i_can_scan")}
                    </button>
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div>
                      <label className="text-sm text-white/75">{t("year")}</label>
                      <select
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        className={selectClass}
                        disabled={submitting}
                      >
                        <option value="">{t("select")}</option>
                        {YEARS.map((y) => (
                          <option key={y} value={y}>{y}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-sm text-white/75">{t("make")}</label>
                      <select
                        value={make}
                        onChange={(e) => {
                          const newMake = e.target.value as PopularMake;
                          setMake(newMake);
                          setModelChoice("");
                          setModelOther("");
                        }}
                        className={selectClass}
                        disabled={submitting}
                      >
                        <option value="">{t("select")}</option>
                        {POPULAR_MAKES.map((m) => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-sm text-white/75">{t("model")}</label>
                      <select
                        value={modelChoice}
                        onChange={(e) => {
                          const v = e.target.value;
                          setModelChoice(v);
                          if (v !== "Other") setModelOther("");
                        }}
                        className={selectClass}
                        disabled={submitting || !make}
                      >
                        <option value="">{t("select")}</option>
                        {modelOptions.map((m) => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>

                      {modelChoice === "Other" ? (
                        <input
                          value={modelOther}
                          onChange={(e) => setModelOther(e.target.value)}
                          className={inputClass}
                          placeholder={t("enter_model")}
                          disabled={submitting}
                        />
                      ) : null}
                    </div>
                  </div>

                  {hasManualVehicle ? (
                    <div className="mt-4 rounded-xl border border-yellow-300/30 bg-yellow-500/10 p-3 text-sm text-yellow-100">
                      {t("vehicle_set_next_photos")}
                    </div>
                  ) : null}
                </div>
              )}
            </div>

            {canUploadPhotos ? (
              <div id="photos-section" className="mt-7">
                <h2 className="text-lg font-bold">{t("photos")}</h2>
                <p className="text-sm text-white/70">{t("add_photos_damage")}</p>

                <div className="mt-4 rounded-3xl border border-emerald-200/15 bg-emerald-950/35 p-5">
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <input
                      ref={cameraDamageRef}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) setPhotos((prev) => [...prev, f]);
                        e.currentTarget.value = "";
                      }}
                      disabled={submitting}
                    />
                    <RoundAction
                      emoji="📸"
                      title={t("pictures")}
                      subtitle={t("of_the_damages")}
                      onClick={() => cameraDamageRef.current?.click()}
                      disabled={submitting}
                      tone="good"
                    />

                    <input
                      ref={uploadDamageRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        if (files.length) setPhotos((prev) => [...prev, ...files]);
                        e.currentTarget.value = "";
                      }}
                      disabled={submitting}
                    />
                    <RoundAction
                      emoji="🗂️"
                      title={t("upload")}
                      subtitle={t("from_album")}
                      onClick={() => uploadDamageRef.current?.click()}
                      disabled={submitting}
                    />

                    <RoundAction
                      emoji="🧹"
                      title={t("clear")}
                      subtitle={t("photos")}
                      onClick={() => setPhotos([])}
                      disabled={submitting || !photos.length}
                      tone="warn"
                    />

                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="text-sm font-extrabold text-white/95">{photos.length}</div>
                      <div className="text-xs text-white/70 leading-tight">
                        {photos.length} {photos.length === 1 ? t("photo_label") : t("photos_label")} {t("selected")}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {canUploadPhotos && hasPhotos ? (
              <div className="mt-7">
                <div className="flex items-baseline justify-between gap-3">
                  <h2 className="text-lg font-bold">{t("damage_details")}</h2>
                  <span className="text-xs text-white/65">{t("optional")}</span>
                </div>
                <p className="text-sm text-white/70">{t("add_notes_help")}</p>

                <textarea
                  value={damageDescription}
                  onChange={(e) => setDamageDescription(e.target.value)}
                  className="mt-3 w-full min-h-[120px] rounded-2xl border border-emerald-200/15 bg-emerald-950/55 px-4 py-3 text-white placeholder:text-white/35 outline-none focus:border-yellow-200/45 focus:ring-1 focus:ring-yellow-200/20"
                  placeholder={t("damage_placeholder")}
                  disabled={submitting}
                />
              </div>
            ) : null}

            <div className="mt-7">
              {!canUploadPhotos ? (
                <GoldShineButton
                  variant="secondary"
                  disabled={submitting || vinBusy}
                  onClick={() => {
                    setSubmitError(null);
                    showToast(t("complete_vin_first"));
                    scrollTo("vin-section");
                  }}
                >
                  {t("complete_vin_step")}
                </GoldShineButton>
              ) : !hasPhotos ? (
                <GoldShineButton
                  variant="secondary"
                  disabled={submitting || vinBusy}
                  onClick={() => {
                    setSubmitError(null);
                    showToast(t("add_damage_photos"));
                    scrollTo("photos-section");
                  }}
                >
                  {t("proceed_to_photos")}
                </GoldShineButton>
              ) : (
                <GoldShineButton variant="primary" disabled={submitting || vinBusy} onClick={submitEstimate}>
                  {submitting ? t("sending") : t("python_fast_estimates")}
                </GoldShineButton>
              )}

              {submitError ? (
                <div className="mt-3 rounded-xl border border-red-500/35 bg-red-500/10 p-3 text-sm text-red-200">
                  {submitError}
                </div>
              ) : null}

              {result?.ok ? (
                <div className="mt-4 rounded-2xl border border-yellow-300/30 bg-yellow-500/10 p-4">
                  <div className="font-bold text-yellow-100">Submitted</div>
                  {result?.estimate?.price?.totalLow != null && result?.estimate?.price?.totalHigh != null ? (
                    <div className="mt-2 text-white/85">
                      Estimated total:{" "}
                      <span className="font-extrabold">
                        ${Number(result.estimate.price.totalLow).toLocaleString()}–$
                        {Number(result.estimate.price.totalHigh).toLocaleString()}
                      </span>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>

          <footer className="mt-8 pb-6 text-center text-xs text-white/65">{t("estimate_preliminary")}</footer>
        </div>

        <div className="fixed bottom-4 left-1/2 z-[75] w-[min(560px,calc(100vw-2rem))] -translate-x-1/2">
          <div className="rounded-3xl border border-yellow-300/22 bg-black/72 backdrop-blur-md shadow-[0_18px_40px_rgba(0,0,0,0.65)]">
            <div className="grid grid-cols-3 gap-2 p-2">
              <button
                type="button"
                onClick={() => setContactModal("phone")}
                className="rounded-2xl border border-yellow-300/35 bg-[linear-gradient(135deg,rgba(255,215,0,0.22),rgba(255,255,255,0.07),rgba(255,215,0,0.14))] px-3 py-3 text-sm font-extrabold hover:border-yellow-200/55 shadow-[0_10px_22px_rgba(0,0,0,0.45)]"
              >
                {t("call")}
              </button>
              <button
                type="button"
                onClick={() => setContactModal("email")}
                className="rounded-2xl border border-yellow-300/35 bg-[linear-gradient(135deg,rgba(255,215,0,0.22),rgba(255,255,255,0.07),rgba(255,215,0,0.14))] px-3 py-3 text-sm font-extrabold hover:border-yellow-200/55 shadow-[0_10px_22px_rgba(0,0,0,0.45)]"
              >
                {t("email")}
              </button>
              <button
                type="button"
                onClick={() => setContactModal("address")}
                className="rounded-2xl border border-yellow-300/35 bg-[linear-gradient(135deg,rgba(255,215,0,0.22),rgba(255,255,255,0.07),rgba(255,215,0,0.14))] px-3 py-3 text-sm font-extrabold hover:border-yellow-200/55 shadow-[0_10px_22px_rgba(0,0,0,0.45)]"
              >
                {t("get_directions")}
              </button>
            </div>
          </div>
        </div>

        {contactModal ? (
          <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70" onClick={() => setContactModal(null)} />
            <div className="relative w-full max-w-md rounded-3xl border border-yellow-300/22 bg-[#06110b] p-5 shadow-2xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-extrabold">
                    {contactModal === "phone" ? t("call") : contactModal === "email" ? t("email") : t("get_directions")}
                  </h3>
                  <p className="mt-1 text-sm text-white/70 break-words">
                    {contactModal === "phone" ? BUSINESS_PHONE_PRETTY : contactModal === "email" ? BUSINESS_EMAIL : BUSINESS_ADDRESS}
                  </p>
                </div>

                <button
                  type="button"
                  className="rounded-xl border border-yellow-300/22 bg-white/10 px-3 py-2 text-sm font-semibold hover:bg-white/15"
                  onClick={() => setContactModal(null)}
                >
                  {t("close")}
                </button>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-2">
                {contactModal === "phone" ? (
                  <>
                    <a
                      href={`tel:${BUSINESS_PHONE_E164}`}
                      className="w-full rounded-2xl border border-yellow-300/30 bg-emerald-950/35 px-4 py-3 text-center text-sm font-extrabold hover:bg-emerald-950/45"
                    >
                      {t("call_now")}
                    </a>
                    <a
                      href={`sms:${BUSINESS_PHONE_E164}`}
                      className="w-full rounded-2xl border border-yellow-300/30 bg-emerald-950/35 px-4 py-3 text-center text-sm font-extrabold hover:bg-emerald-950/45"
                    >
                      {t("text")}
                    </a>
                    <button
                      type="button"
                      onClick={() => doCopy(BUSINESS_PHONE_PRETTY, "Phone")}
                      className="w-full rounded-2xl border border-yellow-300/30 bg-emerald-950/35 px-4 py-3 text-sm font-extrabold hover:bg-emerald-950/45"
                    >
                      {t("copy_number")}
                    </button>
                  </>
                ) : null}

                {contactModal === "email" ? (
                  <>
                    <a
                      href={`mailto:${BUSINESS_EMAIL}`}
                      className="w-full rounded-2xl border border-yellow-300/30 bg-emerald-950/35 px-4 py-3 text-center text-sm font-extrabold hover:bg-emerald-950/45"
                    >
                      {t("email_now")}
                    </a>
                    <button
                      type="button"
                      onClick={() => doCopy(BUSINESS_EMAIL, "Email")}
                      className="w-full rounded-2xl border border-yellow-300/30 bg-emerald-950/35 px-4 py-3 text-sm font-extrabold hover:bg-emerald-950/45"
                    >
                      {t("copy_email")}
                    </button>
                  </>
                ) : null}

                {contactModal === "address" ? (
                  <>
                    <a
                      href={googleMapsLink}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full rounded-2xl border border-yellow-300/30 bg-emerald-950/35 px-4 py-3 text-center text-sm font-extrabold hover:bg-emerald-950/45"
                    >
                      {t("open_directions")}
                    </a>
                    <button
                      type="button"
                      onClick={() => doCopy(BUSINESS_ADDRESS, "Address")}
                      className="w-full rounded-2xl border border-yellow-300/30 bg-emerald-950/35 px-4 py-3 text-sm font-extrabold hover:bg-emerald-950/45"
                    >
                      {t("copy_address")}
                    </button>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}

        {toast ? (
          <div className="fixed bottom-24 left-1/2 z-[95] -translate-x-1/2 rounded-full border border-yellow-300/22 bg-black/82 px-4 py-2 text-sm text-white shadow-lg">
            {toast}
          </div>
        ) : null}

        {showVinHelp ? (
          <div className="fixed inset-0 z-[85] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70" onClick={() => setShowVinHelp(false)} />
            <div className="relative w-full max-w-2xl rounded-3xl border border-yellow-300/22 bg-[#06110b] p-6 shadow-2xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-extrabold">{t("vin_places_title")}</h3>
                  <p className="mt-1 text-sm text-white/70">{t("vin_places_sub")}</p>
                </div>
                <button
                  type="button"
                  className="rounded-xl border border-yellow-300/22 bg-white/10 px-3 py-2 text-sm font-semibold hover:bg-white/15"
                  onClick={() => setShowVinHelp(false)}
                >
                  {t("close")}
                </button>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-emerald-200/12 bg-emerald-950/35 p-4">
                  <div className="font-semibold">{t("vin_place_1_title")}</div>
                  <div className="mt-2 text-sm text-white/75">{t("vin_place_1_body")}</div>
                </div>

                <div className="rounded-2xl border border-emerald-200/12 bg-emerald-950/35 p-4">
                  <div className="font-semibold">{t("vin_place_2_title")}</div>
                  <div className="mt-2 text-sm text-white/75">{t("vin_place_2_body")}</div>
                </div>

                <div className="rounded-2xl border border-emerald-200/12 bg-emerald-950/35 p-4">
                  <div className="font-semibold">{t("vin_place_3_title")}</div>
                  <div className="mt-2 text-sm text-white/75">{t("vin_place_3_body")}</div>
                </div>

                <div className="rounded-2xl border border-emerald-200/12 bg-emerald-950/35 p-4">
                  <div className="font-semibold">{t("vin_place_4_title")}</div>
                  <div className="mt-2 text-sm text-white/75">{t("vin_place_4_body")}</div>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {showVinScanner ? (
          <div className="fixed inset-0 z-[85] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70" onClick={() => (vinBusy ? null : setShowVinScanner(false))} />
            <div className="relative w-full max-w-lg rounded-3xl border border-yellow-300/22 bg-[#06110b] p-5 shadow-2xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-extrabold">{t("vin_scanner_title")}</h3>
                  <p className="mt-1 text-sm text-white/70">{t("vin_scanner_sub")}</p>
                </div>
                <button
                  type="button"
                  className="rounded-xl border border-yellow-300/22 bg-white/10 px-3 py-2 text-sm font-semibold hover:bg-white/15 disabled:opacity-60"
                  disabled={vinBusy}
                  onClick={() => setShowVinScanner(false)}
                >
                  {t("close")}
                </button>
              </div>

              <div className="mt-4 rounded-2xl border border-emerald-200/12 bg-emerald-950/35 p-4">
                <input
                  ref={cameraVinRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleVinFromImage(f);
                    e.currentTarget.value = "";
                  }}
                  disabled={vinBusy}
                />

                <button
                  type="button"
                  onClick={() => cameraVinRef.current?.click()}
                  className={`inline-flex w-full items-center justify-center rounded-2xl px-4 py-4 font-extrabold border border-yellow-300/30 shadow-[0_14px_28px_rgba(0,0,0,0.55)] ${
                    vinBusy ? "bg-white/5 text-white/45 cursor-not-allowed" : "bg-emerald-950/40 hover:bg-emerald-950/50"
                  }`}
                  disabled={vinBusy}
                >
                  {vinBusy ? t("reading") : t("take_vin_photo")}
                </button>

                {vinError ? (
                  <div className="mt-3 rounded-xl border border-red-500/35 bg-red-500/10 p-3 text-sm text-red-200">
                    {vinError}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}
