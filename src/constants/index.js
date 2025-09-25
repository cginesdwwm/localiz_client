/*
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

// Clés de stockage
export const STORAGE_KEY = "localiz_theme";
// Authentification / clés de stockage
export const AUTH_TOKEN = "token";
export const AUTH_USER = "user";

// Session / UI keys
export const REGISTER_EXPIRES = "register_expiresAt";
export const REGISTER_TOAST_KEY = "register_message_handled";
export const LOGIN_MESSAGE_KEY = "login_message_handled";

// Préfixes de salutation pour les utilisateurs connectés (aléatoire quotidien)
export const DAILY_GREETINGS = [
  "Bonjour, [Prénom] !",
  "Salut [Prénom] !",
  "Coucou [Prénom] !",
  "Hello [Prénom] !",
  "Bienvenue, [Prénom] !",
  "Ravis de te revoir, [Prénom] !",
  "Chouette de te revoir, [Prénom] !",
  "Contents de te revoir, [Prénom] !",
  "Hey [Prénom] !",
  "Bonne journée, [Prénom] !",
  "Bonne visite, [Prénom] !",
  "[Prénom], tu es une source d'inspiration pour nous ! 😊",
  "Quel plaisir de te revoir, [Prénom] !",
];

// Messages affichés sur la page d'accueil sous l'en-tête / le logo.
export const WELCOME_MESSAGES = [
  "Prêt·e à découvrir les bons plans du jour près de chez toi ?",
  "Une nouvelle journée, de nouvelles trouvailles… Va jeter un œil !",
  "Il y a sûrement quelque chose d'intéressant près de toi aujourd'hui.",
  "Envie d'économiser ? Parcourez les offres locales.",
  "Quoi de neuf à échanger ou à partager aujourd'hui ?",
  "Des trésors cachés t'attendent dans ta communauté.",
  "Découvre les dernières annonces près de chez toi.",
  "Des bonnes affaires t'attendent juste au coin de la rue.",
  "Ton quartier regorge de trésors et d'opportunités au partage. Explore Localiz !",
  "Chaque jour est une nouvelle chance de découvrir quelque chose de génial près de chez toi.",
  "Pourquoi ne pas faire un tour et voir ce que ta communauté a à offrir aujourd'hui ?",
  "Des économies, des trouvailles uniques et des connexions locales t'attendent. Plonge dans Localiz !",
  "Le meilleur de ta communauté est à portée de clic !",
  "Fais de chaque jour une aventure avec Localiz. Qui sait ce que tu pourrais trouver ?",
  "Localiz : où les bonnes affaires rencontrent les bonnes personnes.",
  "Un petit geste, un grand impact : recycle, upcycle, échange, partage !",
  "Découvre, connecte, partage : Localiz est là pour toi !",
  "Donne une nouvelle vie à des objets, inspire ton entourage !",
  "Chaque objet partagé réduit les déchets. Ton impact compte !",
  "Chaque objet a une histoire. Laquelle vas-tu faire voyager aujourd'hui ?",
  "Contribue à une consommation plus durable, une annonce à la fois. Merci de faire partie de Localiz !",
  "Tes échanges aident à réduire les déchets. Ensemble, on fait la différence !",
  "Partager, c'est prendre soin de notre planète. Merci d'être un·e Localizer !",
  "Fais partie du changement avec Localiz. Chaque partage compte !",
  "Ensemble, créons une communauté plus durable et solidaire.",
  "Merci de contribuer à une économie circulaire ! Chaque chose partagée sur Localiz a un impact positif.",
  "Localiz : ton allié pour une consommation responsable et solidaire.",
  "Ton engagement sur Localiz crée une vague d'impact positif ! Continue de partager et d'inspirer.",
  "Merci d'être là ! Localiz grandit grâce à toi.",
  "Chaque partage sur Localiz est un pas vers un monde meilleur. Merci !",
  "Localiz : où chaque geste compte. Merci de faire partie de l'aventure !",
  "Localiz, c'est aussi un réseau solidaire. Trouve ce dont tu as besoin et aide les autres !",
  "Tu aimes l'esprit Localiz ? Parles-en autour de toi et aide-nous à faire grandir la communauté !",
  "C'est grâce à des utilisateurs comme toi que Localiz prend tout son sens ! Un grand merci pour ton engagement.",
  "Partage un objet ou un bon plan, et fais un·e heureux·se aujourd'hui.",
  "Chaque objet partagé sur Localiz est une victoire pour la planète. Merci de faire partie du mouvement !",
  "Envie de faire de la place ou de faire plaisir ? Localiz est là pour ça.",
  "Localiz : ton espace pour échanger, partager et découvrir.",
  "En quelques clics, donne une seconde vie à tes objets et fais plaisir autour de toi !",
  "Et si tu dénichais ton prochain coup de cœur sans dépenser un centime ? Explore les annonces !",
  "Tu as une question sur une annonce ? N'hésite pas à envoyer un message !",
  "Une question sur une annonce ? Lance la discussion, c'est le meilleur moyen d'en savoir plus !",
  "Chaque jour, de nouvelles annonces sont postées. Reviens souvent pour ne rien manquer !",
  "N'hésite pas à échanger avec les autres membres ! De belles rencontres peuvent commencer sur Localiz.",
  "Une pépite t'attend peut-être juste au coin de ta rue ! Découvre les dernières pépites Localiz.",
  "Fais découvrir les bons plans près de chez eux à tes proches! Invite-les à rejoindre Localiz.",
  "Plus on est de fous, plus on rit ! Invite tes amis à rejoindre Localiz et à partager leurs bons plans.",
  "Partager, c'est aussi prendre soin de notre planète. Merci d'être un·e Localizer !",
  "Chaque objet partagé réduit les déchets. Ton impact compte !",
];
