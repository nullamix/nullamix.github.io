export interface Project {
  name: string;
  description: string;
  url: string;
  sourceUrl?: string;
  tags: string[];
  status: 'live' | 'building' | 'archived';
}

export const projects: Project[] = [
  {
    name: 'CodeSanitize',
    description:
      'A local, reversible sanitizer for removing secrets, internal addresses, and proprietary identifiers before sharing code with AI tools.',
    url: 'https://nullamix.ir/CodeSanitize/',
    sourceUrl: 'https://github.com/nullamix/CodeSanitize',
    tags: ['privacy', 'security', 'javascript'],
    status: 'live'
  }
];
