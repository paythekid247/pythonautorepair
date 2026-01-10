export type Locale = "en" | "es-CO" | "ht" | "ru";

export const messages: Record<Locale, Record<string, string>> = {
  en: {
    tagline: "Step-by-step: VIN → photos → optional details → fast estimate range.",
    vinVerified: "VIN verified",
    vinDecodeFailed: "VIN lookup failed.",
    completeVinFirst: "Complete the VIN step first.",
    addPhotosFirst: "Please add at least one damage photo first.",
    sending: "Sending...",
    submit: "Python Fast Estimates",
  },

  "es-CO": {
    tagline: "Paso a paso: VIN → fotos → detalles opcionales → rango rápido de estimación.",
    vinVerified: "VIN verificado",
    vinDecodeFailed: "No se pudo verificar el VIN.",
    completeVinFirst: "Primero completa el paso del VIN.",
    addPhotosFirst: "Agrega al menos una foto del daño.",
    sending: "Enviando...",
    submit: "Estimación Rápida Python",
  },

  ht: {
    tagline: "Etap pa etap: VIN → foto → detay opsyonèl → estimasyon rapid.",
    vinVerified: "VIN verifye",
    vinDecodeFailed: "VIN pa ka verifye.",
    completeVinFirst: "Tanpri fini etap VIN an anvan.",
    addPhotosFirst: "Tanpri ajoute omwen yon foto domaj la.",
    sending: "Ap voye...",
    submit: "Estimasyon Rapid Python",
  },

  ru: {
    tagline: "Пошагово: VIN → фото → доп. детали → быстрый диапазон оценки.",
    vinVerified: "VIN подтверждён",
    vinDecodeFailed: "Не удалось проверить VIN.",
    completeVinFirst: "Сначала завершите шаг с VIN.",
    addPhotosFirst: "Добавьте хотя бы одно фото повреждений.",
    sending: "Отправка...",
    submit: "Быстрая оценка Python",
  },
};
