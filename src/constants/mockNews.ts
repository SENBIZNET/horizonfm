import { Timestamp } from 'firebase/firestore';
import { NewsItem } from '../types';

export const MOCK_NEWS: NewsItem[] = [
  {
    id: 'mock-1',
    title: "Lancement de la nouvelle programmation sur Horizon FM",
    excerpt: "Horizon FM dévoile sa nouvelle grille de programmes pour la saison 2026, avec plus d'émissions de proximité.",
    content: "Contenu détaillé de l'article sur la nouvelle programmation...",
    category: "Guinée",
    thumbnailUrl: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=800",
    publishedAt: Timestamp.now(),
    authorName: "Rédaction Horizon",
    viewCount: 1250,
    status: 'published'
  },
  {
    id: 'mock-2',
    title: "Les enjeux de la démocratie en Afrique de l'Ouest",
    excerpt: "Analyse des récents développements politiques dans la région et le rôle des médias indépendants.",
    content: "Contenu détaillé sur les enjeux de la démocratie...",
    category: "Afrique",
    thumbnailUrl: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&q=80&w=800",
    publishedAt: Timestamp.now(),
    authorName: "Amadou Diallo",
    viewCount: 3400,
    status: 'published'
  },
  {
    id: 'mock-3',
    title: "Économie : La Guinée renforce ses partenariats miniers",
    excerpt: "De nouveaux accords stratégiques ont été signés pour booster l'extraction de bauxite de manière durable.",
    content: "Contenu détaillé sur l'économie minière...",
    category: "Économie",
    thumbnailUrl: "https://images.unsplash.com/photo-1518458028785-8fbcd101ebb9?auto=format&fit=crop&q=80&w=800",
    publishedAt: Timestamp.now(),
    authorName: "Fatoumata Camara",
    viewCount: 2100,
    status: 'published'
  },
  {
    id: 'mock-4',
    title: "Culture : Le festival des arts de Conakry ouvre ses portes",
    excerpt: "Une célébration de la diversité culturelle guinéenne avec des artistes venus de tout le pays.",
    content: "Contenu détaillé sur le festival des arts...",
    category: "Culture",
    thumbnailUrl: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=800",
    publishedAt: Timestamp.now(),
    authorName: "Ibrahima Sory",
    viewCount: 1850,
    status: 'published'
  },
  {
    id: 'mock-5',
    title: "Sport : Le Syli National se prépare pour la prochaine CAN",
    excerpt: "L'équipe nationale intensifie ses entraînements pour relever les défis de la compétition continentale.",
    content: "Contenu détaillé sur la préparation du Syli National...",
    category: "Sport",
    thumbnailUrl: "/uploads/DDD.webp",
    publishedAt: Timestamp.now(),
    authorName: "Moussa Keita",
    viewCount: 5200,
    status: 'published'
  },
  {
    id: 'mock-6',
    title: "International : Sommet pour le climat à New York",
    excerpt: "Les dirigeants mondiaux se réunissent pour discuter des mesures urgentes face au réchauffement climatique.",
    content: "Contenu détaillé sur le sommet du climat...",
    category: "International",
    thumbnailUrl: "https://images.unsplash.com/photo-1569163139599-0f4517e36f51?auto=format&fit=crop&q=80&w=800",
    publishedAt: Timestamp.now(),
    authorName: "Jean Dupont",
    viewCount: 950,
    status: 'published'
  },
  {
    id: 'mock-7',
    title: "Guinée : Inauguration d'un nouveau campus à Kankan",
    excerpt: "Les étudiants de la région bénéficient désormais d'infrastructures modernes pour leurs études.",
    content: "Contenu détaillé sur l'éducation en Guinée...",
    category: "Guinée",
    thumbnailUrl: "https://images.unsplash.com/photo-1523050335456-adeba884586d?auto=format&fit=crop&q=80&w=800",
    publishedAt: Timestamp.now(),
    authorName: "Abdoulaye Sylla",
    viewCount: 1400,
    status: 'published'
  },
  {
    id: 'mock-8',
    title: "Afrique : Croissance technologique exponentielle au Nigéria",
    excerpt: "Lagos s'affirme comme le nouveau hub technologique du continent avec des investissements records.",
    content: "Contenu détaillé sur la tech en Afrique...",
    category: "Afrique",
    thumbnailUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800",
    publishedAt: Timestamp.now(),
    authorName: "Kofi Annan",
    viewCount: 2300,
    status: 'published'
  },
  {
    id: 'mock-9',
    title: "International : Avancées majeures dans l'exploration spatiale",
    excerpt: "Une nouvelle mission vers Mars promet de lever le voile sur les mystères de la planète rouge.",
    content: "Contenu détaillé sur l'exploration spatiale...",
    category: "International",
    thumbnailUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800",
    publishedAt: Timestamp.now(),
    authorName: "Dr. Sarah Miller",
    viewCount: 1600,
    status: 'published'
  },
  {
    id: 'mock-10',
    title: "Guinée : Horizon Medias renforce sa couverture nationale",
    excerpt: "De nouveaux émetteurs installés pour garantir une information de qualité dans tout le pays.",
    content: "Contenu détaillé sur l'expansion de l'antenne...",
    category: "Guinée",
    thumbnailUrl: "https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&q=80&w=800",
    publishedAt: Timestamp.now(),
    authorName: "Rédaction Horizon",
    viewCount: 2800,
    status: 'published'
  },
  {
    id: 'mock-11',
    title: "Économie : Reprise du secteur du tourisme en Afrique",
    excerpt: "Les destinations africaines attirent de plus en plus de visiteurs internationaux cet été.",
    content: "Contenu détaillé sur le tourisme africain...",
    category: "Afrique",
    thumbnailUrl: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&q=80&w=800",
    publishedAt: Timestamp.now(),
    authorName: "Ousmane Bangoura",
    viewCount: 1100,
    status: 'published'
  },
  {
    id: 'mock-12',
    title: "Culture : Hommage aux pionniers de la musique guinéenne",
    excerpt: "Une série de concerts et d'expositions pour célébrer l'héritage musical du pays.",
    content: "Contenu détaillé sur l'hommage musical...",
    category: "Guinée",
    thumbnailUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800",
    publishedAt: Timestamp.now(),
    authorName: "Sékou Touré",
    viewCount: 3100,
    status: 'published'
  }
];
