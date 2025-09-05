/*
  constants/index.js
  - Définit des constantes réutilisables dans l'application.
  - Ici `variants` contient des classes CSS utilitaires (Tailwind) pour
    styliser des composants (ex: Button).
  - Avantage: centraliser les variantes évite la duplication et facilite
    les modifications de style.
*/

export const variants = {
  primary: "bg-amber-600 hover:bg-amber-700 text-white",
  secondary: "bg-pink-600 hover:bg-pink-700 text-dark",
};

export const sizes = {
  sm: "px-3 py-1 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-5 py-3 text-lg",
};
