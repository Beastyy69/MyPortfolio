/* ─────────────────────────────────────────────────────────────
   Certificates — real credentials only.
   Titles, issuers, dates and IDs were checked on 2026‑11‑21 against each
   credential page (Udemy / Coursera) or read from the original
   certificate image (Open Source Connect Global, HackerRank). Images are
   the original certificates, saved locally at full resolution.
   `skills` lists only what the certificate's own title names.
   ───────────────────────────────────────────────────────────── */
import udemyDjango from '../assets/certificates/udemy-python-django.webp';
import udemyC from '../assets/certificates/udemy-c-bootcamp.webp';
import metaJs from '../assets/certificates/meta-javascript.webp';
import metaHtml from '../assets/certificates/meta-html-css.webp';
import googlePython from '../assets/certificates/google-python.webp';
import oscg from '../assets/certificates/oscg-2026.webp';
import hackerrank from '../assets/certificates/hackerrank-python.webp';

export const TOPICS = [
  { id: 'python', label: 'Python' },
  { id: 'c', label: 'C programming' },
  { id: 'web', label: 'Web development' },
  { id: 'community', label: 'Community · open source' },
];

export const certificates = [
  {
    id: 'hackerrank-python',
    topic: 'python',
    title: 'Python (Basic)',
    issuer: 'HackerRank',
    kind: 'Skill certification',
    date: '02 Aug 2026',
    year: 2026,
    credentialId: 'B5D2C9B5F5B6',
    url: 'https://www.hackerrank.com/certificates/b5d2c9b5f5b6',
    image: hackerrank,
    ratio: '4 / 3',
    skills: ['Python'],
    note: 'Passed the HackerRank skill certification test.',
  },
  {
    id: 'oscg-2026',
    topic: 'community',
    title: 'Certificate of Appreciation — Project Admin',
    issuer: 'Open Source Connect Global',
    kind: 'Open‑source contribution',
    date: '5–25 Feb 2026',
    year: 2026,
    url: 'https://wallet.truscholar.io/credentials/certificates/69fc840536bebb00204713f2',
    image: oscg,
    ratio: '500 / 652',
    skills: ['Open source', 'Project administration'],
    note: 'Awarded for contributions as a Project Admin for Open Source Connect Global 2026, held 5th–25th February 2026.',
  },
  {
    id: 'udemy-python-django',
    topic: 'python',
    title: 'Python And Django Framework For Beginners Complete Course',
    issuer: 'Udemy',
    instructor: 'Horizon Tech',
    kind: 'Course completion · 13 total hours',
    date: '21 Sep 2025',
    year: 2025,
    credentialId: 'UC-291db4dd-c69b-4d89-85f5-63a5ca0a9c4b',
    url: 'https://ude.my/UC-291db4dd-c69b-4d89-85f5-63a5ca0a9c4b',
    image: udemyDjango,
    ratio: '4 / 3',
    skills: ['Python', 'Django'],
  },
  {
    id: 'udemy-c-bootcamp',
    topic: 'c',
    title: '2025 C Programming Bootcamp – The Complete C Language Course',
    issuer: 'Udemy',
    instructor: 'Toppers Bootcamp',
    kind: 'Course completion · 12 total hours',
    date: '30 Apr 2025',
    year: 2025,
    credentialId: 'UC-278d7084-1e3a-4c52-8c93-2b98b9577bce',
    url: 'https://www.udemy.com/certificate/UC-278d7084-1e3a-4c52-8c93-2b98b9577bce',
    image: udemyC,
    ratio: '4 / 3',
    skills: ['C'],
  },
  {
    id: 'meta-html-css',
    topic: 'web',
    title: 'HTML and CSS in depth',
    issuer: 'Meta · Coursera',
    kind: 'Course certificate',
    date: '23 Oct 2024',
    year: 2024,
    credentialId: 'JPW8COCH0F8J',
    url: 'https://www.coursera.org/account/accomplishments/records/JPW8COCH0F8J',
    image: metaHtml,
    ratio: '1200 / 928',
    skills: ['HTML', 'CSS'],
  },
  {
    id: 'meta-javascript',
    topic: 'web',
    title: 'Programming with JavaScript',
    issuer: 'Meta · Coursera',
    kind: 'Course certificate',
    date: '20 Sep 2024',
    year: 2024,
    credentialId: 'NG02D9JMTCUO',
    url: 'https://www.coursera.org/account/accomplishments/records/NG02D9JMTCUO',
    image: metaJs,
    ratio: '1200 / 928',
    skills: ['JavaScript'],
  },
  {
    id: 'google-python',
    topic: 'python',
    title: 'Crash Course on Python',
    issuer: 'Google · Coursera',
    kind: 'Course certificate',
    date: '15 Sep 2024',
    year: 2024,
    credentialId: 'Z65BAYP0NZ3G',
    url: 'https://www.coursera.org/account/accomplishments/records/Z65BAYP0NZ3G',
    image: googlePython,
    ratio: '1200 / 928',
    skills: ['Python'],
  },
];
