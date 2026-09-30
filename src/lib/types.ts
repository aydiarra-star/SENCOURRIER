export type Article = {
  id: string; slug: string; title: string; excerpt: string; category: string; image: string;
  author: string; publishedAt: string; readingTime: number; featured?: boolean; status: 'published' | 'draft'; body: string;
};
export type Journalist = { id: string; name: string; role: string; bio: string; initials: string };
export type Comment = { id: string; articleId: string; name: string; email: string; body: string; approved: boolean; createdAt: string };
export type Subscriber = { id: string; email: string; createdAt: string };
export type ContactMessage = { id: string; name: string; email: string; subject: string; message: string; createdAt: string };
export type User = { id: string; name: string; email: string; role: string };
export type State = { articles: Article[]; journalists: Journalist[]; comments: Comment[]; subscribers: Subscriber[]; messages: ContactMessage[]; users: User[] };
