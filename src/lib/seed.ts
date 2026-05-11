import { Timestamp } from 'firebase/firestore';
import { newsService } from '../services/newsService';
import { NewsItem } from '../types';

export const seedInitialData = async () => {
  const articles: Omit<NewsItem, 'id'>[] = [
    {
      title: "GUINÉE : LA HAC MET EN GARDE CONTRE LA DÉRIVE DES CONTENUS SUR LES RÉSEAUX SOCIAUX",
      content: "La Haute Autorité de la Communication (HAC) a publié un communiqué ferme ce mardi, mettant en garde les créateurs de contenus et les médias en ligne contre la propagation de discours haineux et de fausses informations. L'institution souligne la nécessité d'un cyberespace responsable pour préserver la cohésion sociale.",
      excerpt: "La HAC durcit le ton face aux dérapages constatés sur les plateformes numériques en Guinée.",
      category: "GUINEE",
      thumbnailUrl: "/uploads/IMG_7735-1.jpeg",
      publishedAt: Timestamp.fromDate(new Date(2026, 3, 15)),
      authorName: "Rédaction Horizon",
      authorId: "dev-admin",
      status: "published",
      viewCount: 12450
    },
    {
      title: "APRÈS L'ALGÉRIE, LE PAPE LÉON XIV SE REND AU CAMEROUN",
      content: "Le souverain pontife Léon XIV a entamé une visite d'État historique au Cameroun. Accueilli par une foule immense à Yaoundé, il a plaidé pour la réconciliation et le développement durable sur le continent africain. Cette étape marque la suite de sa tournée après son passage remarqué à Alger.",
      excerpt: "Visite papale historique au Cameroun placée sous le signe de la paix et de l'unité africaine.",
      category: "ACTUALITE AFRICAINE",
      thumbnailUrl: "/uploads/222.jpg",
      publishedAt: Timestamp.fromDate(new Date(2026, 3, 15)),
      authorName: "Rédaction",
      authorId: "dev-admin",
      status: "published",
      viewCount: 15420
    },
    {
      title: "GUINÉE : DÉCÈS DE TOUMBA DIAKITÉ EN DÉTENTION",
      content: "Une nouvelle qui secoue l'opinion publique guinéenne : Aboubacar Sidiki Diakité, dit Toumba, est décédé en milieu de journée. Les circonstances exactes de son décès en détention font l'objet de nombreuses spéculations, alors que le pays attend une communication officielle des autorités judiciaires.",
      excerpt: "L'ancien aide de camp de Moussa Dadis Camara s'est éteint en prison, créant une onde de choc.",
      category: "GUINEE",
      thumbnailUrl: "/uploads/toumba.jpeg",
      publishedAt: Timestamp.fromDate(new Date(2026, 2, 26)),
      authorName: "Équipe News",
      authorId: "dev-admin",
      status: "published",
      viewCount: 22100
    },
    {
      title: "GUINÉE : LE PRÉSIDENT DOUMBOUYA DISSOUT 40 PARTIS POLITIQUES",
      content: "Dans un décret lu à la télévision nationale, le président de la transition a annoncé la dissolution de quarante formations politiques. Cette décision, motivée par le non-respect des critères réglementaires, redéfinit le paysage politique guinéen à l'approche des prochaines échéances électorales.",
      excerpt: "Restructuration majeure du champ politique avec la dissolution de 40 partis par décret présidentiel.",
      category: "GUINEE",
      thumbnailUrl: "/uploads/Mamady-Doubougna.jpg",
      publishedAt: Timestamp.fromDate(new Date(2026, 2, 9)),
      authorName: "Horizon Politique",
      authorId: "dev-admin",
      status: "published",
      viewCount: 18900
    },
    {
      title: "L'IRAN DIRIGÉ PAR UN NOUVEAU GUIDE SUPRÊME, LE PÉTROLE S'ENVOLE",
      content: "La transition au sommet de l'État iranien provoque des remous sur les marchés mondiaux de l'énergie. Le baril de Brent a franchi des seuils critiques ce matin, les investisseurs craignant une période d'incertitude géopolitique accrue au Moyen-Orient.",
      excerpt: "Réaction immédiate des marchés pétroliers suite au changement de leadership en Iran.",
      category: "INTERNATIONAL",
      thumbnailUrl: "/uploads/AA1XOUxr-750x472-1.jpg",
      publishedAt: Timestamp.fromDate(new Date(2026, 2, 9)),
      authorName: "Rédaction Éco",
      authorId: "dev-admin",
      status: "published",
      viewCount: 14300
    },
    {
      title: "SÉNÉGAL: MACKY SALL EXPOSE SES AMBITIONS POUR LE POSTE DE SECRÉTARIAT GÉNÉRAL À L'ONU",
      content: "L'ancien président sénégalais a officiellement présenté sa vision pour le poste de Secrétaire Général des Nations Unies. Mettant en avant son expérience de médiateur continental, il souhaite porter la voix de l'Afrique et du Sud global au cœur des décisions internationales.",
      excerpt: "Macky Sall brigue le secrétariat général de l'ONU pour représenter les intérêts de l'Afrique.",
      category: "ACTUALITE AFRICAINE",
      thumbnailUrl: "/uploads/msall.webp",
      publishedAt: Timestamp.fromDate(new Date(2026, 2, 5)),
      authorName: "Rédaction",
      authorId: "dev-admin",
      status: "published",
      viewCount: 9800
    },
    {
      title: "CAN 2025 : LE MAROC SE PRÉPARE POUR UNE ÉDITION HISTORIQUE",
      content: "Les préparatifs de la Coupe d'Afrique des Nations 2025 avancent à grands pas au Maroc. Les autorités sportives et le comité d'organisation promettent une compétition sans précédent, avec des infrastructures de classe mondiale et une expérience mémorable pour les supporters africains.",
      excerpt: "Le Royaume chérifien mobilise des ressources massives pour accueillir la plus grande fête du football continental.",
      category: "ACTUALITE AFRICAINE",
      thumbnailUrl: "/uploads/can2025.jpg",
      publishedAt: Timestamp.fromDate(new Date(2026, 2, 2)),
      authorName: "Sports Horizon",
      authorId: "dev-admin",
      status: "published",
      viewCount: 25600
    },
    {
      title: "TECHNOLOGIE : DÉPLOIEMENT ACCÉLÉRÉ DE LA FIBRE OPTIQUE EN GUINÉE",
      content: "Le gouvernement guinéen a lancé une nouvelle phase de son plan 'Numérique pour Tous'. L'objectif est de raccorder plus de deux millions de foyers à la fibre optique d'ici la fin de l'année, favorisant ainsi l'entrepreneuriat numérique et l'éducation à distance dans les zones rurales.",
      excerpt: "Transformation numérique majeure en vue avec l'extension du réseau haut débit sur l'ensemble du territoire.",
      category: "GUINEE",
      thumbnailUrl: "/uploads/fibre.jpg",
      publishedAt: Timestamp.fromDate(new Date(2026, 1, 28)),
      authorName: "Tech News",
      authorId: "dev-admin",
      status: "published",
      viewCount: 11200
    },
    {
      title: "ENVIRONNEMENT : L'AFRIQUE FACE AUX ENJEUX DU RÉCHAUFFEMENT CLIMATIQUE",
      content: "Lors du sommet sur le climat à Nairobi, les dirigeants africains ont appelé à une plus grande justice climatique. Le continent, bien que faible pollueur, subit de plein fouet les conséquences de la crise environnementale globale, nécessitant des investissements massifs en adaptation.",
      excerpt: "Cri de ralliement des leaders africains pour un soutien international accru face à l'urgence climatique.",
      category: "INTERNATIONAL",
      thumbnailUrl: "/uploads/climat.jpg",
      publishedAt: Timestamp.fromDate(new Date(2026, 1, 25)),
      authorName: "Rédaction",
      authorId: "dev-admin",
      status: "published",
      viewCount: 13500
    },
    {
      title: "CULTURE : LE RETOUR DES FESTIVALS LOCAUX DYNAMISE L'ÉCONOMIE",
      content: "De Conakry à Nzérékoré, les festivals culturels reprennent vie après une période de calme. Ces événements ne se contentent pas de célébrer le patrimoine guinéen, ils créent également des milliers d'emplois temporaires et boostent le secteur du tourisme local.",
      excerpt: "La renaissance culturelle guinéenne profite à l'économie locale et à la promotion des talents.",
      category: "GUINEE",
      thumbnailUrl: "/uploads/fest.jpg",
      publishedAt: Timestamp.fromDate(new Date(2026, 1, 20)),
      authorName: "Horizon Culture",
      authorId: "dev-admin",
      status: "published",
      viewCount: 7800
    },
    {
      title: "DIPLOMATIE : LA GUINÉE RENFORCE SES LIENS AVEC LES PAYS DU MANO RIVER UNION",
      content: "Une série de rencontres bilatérales s'est tenue à Conakry pour discuter de la sécurité transfrontalière et de l'intégration économique régionale. Les délégués ont souligné l'importance de la coopération pour faire face aux défis communs en Afrique de l'Ouest.",
      excerpt: "Renforcement stratégique de la coopération régionale pour la stabilité et le développement au sein de l'espace Mano River.",
      category: "INTERNATIONAL",
      thumbnailUrl: "/uploads/Maada.jpeg",
      publishedAt: Timestamp.fromDate(new Date(2026, 1, 15)),
      authorName: "Rédaction",
      authorId: "dev-admin",
      status: "published",
      viewCount: 6500
    },
    {
      title: "SANTÉ : CAMPAGNE NATIONALE DE VACCINATION CONTRE LA ROUGEOLE",
      content: "Le ministère de la Santé publique a lancé une vaste campagne de sensibilisation et de vaccination sur l'ensemble du territoire national. Les équipes mobiles circuleront dans les quartiers et villages pour assurer une couverture maximale des enfants de moins de cinq ans.",
      excerpt: "Mobilisation générale pour protéger la petite enfance contre les épidémies saisonnières en Guinée.",
      category: "GUINEE",
      thumbnailUrl: "/uploads/rougeole.jpeg",
      publishedAt: Timestamp.fromDate(new Date(2026, 1, 10)),
      authorName: "Santé Horizon",
      authorId: "dev-admin",
      status: "published",
      viewCount: 9200
    }
  ];

  for (const article of articles) {
    await newsService.ensureArticleExists(article.title, article);
  }
  console.log("Seeding process completed successfully with 12 real articles from Horizon FM.");
};
