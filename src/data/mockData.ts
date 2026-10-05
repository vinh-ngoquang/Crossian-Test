export interface ColorStyleOption {
  id: string;
  name: string;
  type: 'straight' | 'jogger';
  colorName: string;
  hex: string;
  image: string;
}

export const COLOR_STYLE_OPTIONS: ColorStyleOption[] = [
  {
    id: 'black',
    name: 'Black',
    type: 'straight',
    colorName: 'Black',
    hex: '#111827',
    image: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=1000&auto=format&fit=crop&q=80',
  },
  {
    id: 'navy',
    name: 'Navy',
    type: 'straight',
    colorName: 'Navy',
    hex: '#1e3a8a',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1000&auto=format&fit=crop&q=80',
  },
  {
    id: 'ocean-blue',
    name: 'Ocean Blue',
    type: 'straight',
    colorName: 'Ocean Blue',
    hex: '#38bdf8',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1000&auto=format&fit=crop&q=80',
  },
  {
    id: 'gray',
    name: 'Gray',
    type: 'straight',
    colorName: 'Gray',
    hex: '#64748b',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1000&auto=format&fit=crop&q=80',
  },
  {
    id: 'white',
    name: 'White',
    type: 'straight',
    colorName: 'White',
    hex: '#f8fafc',
    image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1000&auto=format&fit=crop&q=80',
  },
  {
    id: 'khaki',
    name: 'Khaki',
    type: 'straight',
    colorName: 'Khaki',
    hex: '#d6c4a5',
    image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=1000&auto=format&fit=crop&q=80',
  },
  {
    id: 'brown',
    name: 'Brown',
    type: 'straight',
    colorName: 'Brown',
    hex: '#78350f',
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1000&auto=format&fit=crop&q=80',
  },
  {
    id: 'black-jogger',
    name: 'Black Jogger',
    type: 'jogger',
    colorName: 'Black',
    hex: '#111827',
    image: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=1000&auto=format&fit=crop&q=80',
  },
  {
    id: 'navy-jogger',
    name: 'Navy Jogger',
    type: 'jogger',
    colorName: 'Navy',
    hex: '#1e3a8a',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1000&auto=format&fit=crop&q=80',
  },
  {
    id: 'gray-jogger',
    name: 'Gray Jogger',
    type: 'jogger',
    colorName: 'Gray',
    hex: '#64748b',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1000&auto=format&fit=crop&q=80',
  },
  {
    id: 'khaki-jogger',
    name: 'Khaki Jogger',
    type: 'jogger',
    colorName: 'Khaki',
    hex: '#d6c4a5',
    image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=1000&auto=format&fit=crop&q=80',
  },
];

export const US_SIZES = [
  'XS (0-2)',
  'S (4-6)',
  'M (8-10)',
  'L (12-14)',
  'XL (16-18)',
  '2XL (18-20)',
  '3XL (20W-22W)',
  '4XL (24W)',
  '5XL (26W)',
  '6XL (28W)',
];

export const INSEAM_OPTIONS = [
  'Regular (29-31")',
  'Petite (26-28")',
  'Tall (32-34")',
];

export const PRODUCT_GALLERY = [
  {
    url: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=1000&auto=format&fit=crop&q=80',
    badge: 'BLACK (Jogger Pants)',
  },
  {
    url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1000&auto=format&fit=crop&q=80',
    badge: 'GRAY (Straight Pants)',
  },
  {
    url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1000&auto=format&fit=crop&q=80',
    badge: 'NAVY (Straight Pants)',
  },
  {
    url: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=1000&auto=format&fit=crop&q=80',
    badge: 'KHAKI (Comfort Fit)',
  },
  {
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1000&auto=format&fit=crop&q=80',
    badge: 'OCEAN BLUE (Ice Silk)',
  },
];

export interface ScreenshotReview {
  id: string;
  name: string;
  verified: boolean;
  rating: number;
  title: string;
  comment: string;
  image: string;
}

export const SCREENSHOT_REVIEWS: ScreenshotReview[] = [
  {
    id: 'rev-bonnie',
    name: 'Bonnie',
    verified: true,
    rating: 5,
    title: 'Ordering a second pair NOW!',
    comment:
      'I bought these pants for this summer because they seemed promising. Delighted when they arrived today with the fabric and quality! Too breathable and comfy to wear all day long. Overall, very happy to have found these lightweight pants for summer! Love the zip pockets and convenient waistband too.',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'rev-farrah',
    name: 'Farrah R.',
    verified: true,
    rating: 5,
    title: "I'm obsessed",
    comment:
      "I can't recommend these pants enough! As a lady with curvy thighs and booty, I've had a hard time finding joggers that are flattering on me and don't look cheap. These are it! The fabric is light weight, breathable and durable. Buy 2 and definitely buy more for my friends!",
    image: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'rev-anna',
    name: 'Anna H.',
    verified: true,
    rating: 5,
    title: 'Great for active days',
    comment:
      'I love these pants because they are so silky smooth against my skin and I bench really easily thanks to the super stretchy fabric. I highly recommend these. Just wish they have more colors.',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'rev-rachel',
    name: 'Rachel M.',
    verified: true,
    rating: 5,
    title: 'Best travel pants ever',
    comment:
      'Wore these on a 10-hour flight to Europe. Totally wrinkle-free and felt like I was wearing soft pajamas while looking like dress trousers. The hidden zipper pockets kept my passport and boarding pass 100% safe.',
    image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'rev-jessica',
    name: 'Jessica W.',
    verified: true,
    rating: 5,
    title: 'Golden retriever hair brushes right off!',
    comment:
      'Dog owners know the struggle with black pants. The ice-silk fabric is slick and high density so pet hair does not stick at all. A simple wipe with my hand and they look brand new.',
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'rev-catherine',
    name: 'Catherine K.',
    verified: true,
    rating: 5,
    title: 'Cool to the touch even in 90 degree humidity',
    comment:
      'I was skeptical about the COOLMAX claim, but they genuinely feel refreshingly cool against the skin. No sweat sticking to your legs. Already ordered 2 more pairs in Navy and Khaki!',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
  },
];
