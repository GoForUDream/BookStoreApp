import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import bcrypt from 'bcryptjs';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const slugify = (text: string): string => {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
};

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@bookstore.com' },
    update: {},
    create: {
      email: 'admin@bookstore.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // Create test user
  const userPassword = await bcrypt.hash('user123', 12);
  const user = await prisma.user.upsert({
    where: { email: 'user@bookstore.com' },
    update: {},
    create: {
      email: 'user@bookstore.com',
      password: userPassword,
      firstName: 'John',
      lastName: 'Doe',
      role: 'USER',
    },
  });
  console.log('✅ Test user created:', user.email);

  // Create categories
  const categoriesData = [
    { name: 'Fiction', description: 'Novels, short stories, and literary fiction' },
    { name: 'Non-Fiction', description: 'Biographies, history, and factual books' },
    { name: 'Science & Technology', description: 'Science, programming, and tech books' },
    { name: 'Business & Economics', description: 'Business strategy and economics' },
    { name: 'Self-Help', description: 'Personal development and motivation' },
    { name: 'Children & Young Adult', description: 'Books for young readers' },
  ];

  const categories: Record<string, { id: string }> = {};
  for (const cat of categoriesData) {
    const category = await prisma.category.upsert({
      where: { slug: slugify(cat.name) },
      update: {},
      create: { name: cat.name, slug: slugify(cat.name), description: cat.description },
    });
    categories[cat.name] = category;
  }
  console.log('✅ Categories created');

  // Create books
  const booksData = [
    {
      title: 'The Midnight Library',
      author: 'Matt Haig',
      description: 'A dazzling novel about all the choices that go into a life well lived.',
      price: 16.99,
      originalPrice: 24.99,
      isbn: '978-0525559474',
      publisher: 'Viking',
      pages: 304,
      coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
      stock: 50,
      sold: 1250,
      featured: true,
      category: 'Fiction',
    },
    {
      title: 'Atomic Habits',
      author: 'James Clear',
      description: 'An Easy & Proven Way to Build Good Habits & Break Bad Ones.',
      price: 18.99,
      originalPrice: 27.00,
      isbn: '978-0735211292',
      publisher: 'Avery',
      pages: 320,
      coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',
      stock: 100,
      sold: 3500,
      featured: true,
      category: 'Self-Help',
    },
    {
      title: 'Zero to One',
      author: 'Peter Thiel',
      description: 'Notes on Startups, or How to Build the Future.',
      price: 15.99,
      isbn: '978-0804139298',
      publisher: 'Crown Business',
      pages: 224,
      coverImage: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400',
      stock: 75,
      sold: 890,
      featured: true,
      category: 'Business & Economics',
    },
    {
      title: 'Clean Code',
      author: 'Robert C. Martin',
      description: 'A Handbook of Agile Software Craftsmanship.',
      price: 39.99,
      isbn: '978-0132350884',
      publisher: 'Prentice Hall',
      pages: 464,
      coverImage: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400',
      stock: 40,
      sold: 2100,
      featured: true,
      category: 'Science & Technology',
    },
    {
      title: 'Harry Potter and the Sorcerer\'s Stone',
      author: 'J.K. Rowling',
      description: 'The first book in the beloved Harry Potter series.',
      price: 12.99,
      originalPrice: 19.99,
      isbn: '978-0590353427',
      publisher: 'Scholastic',
      pages: 309,
      coverImage: 'https://images.unsplash.com/photo-1618666012174-83b441c0bc76?w=400',
      stock: 200,
      sold: 5000,
      featured: true,
      category: 'Children & Young Adult',
    },
    {
      title: 'Sapiens: A Brief History of Humankind',
      author: 'Yuval Noah Harari',
      description: 'A groundbreaking narrative of humanity\'s creation and evolution.',
      price: 22.99,
      isbn: '978-0062316097',
      publisher: 'Harper',
      pages: 464,
      coverImage: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400',
      stock: 60,
      sold: 1800,
      featured: true,
      category: 'Non-Fiction',
    },
    {
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      description: 'A portrait of the Jazz Age in all of its decadence and excess.',
      price: 9.99,
      isbn: '978-0743273565',
      publisher: 'Scribner',
      pages: 180,
      coverImage: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400',
      stock: 150,
      sold: 4200,
      category: 'Fiction',
    },
    {
      title: 'The Lean Startup',
      author: 'Eric Ries',
      description: 'How Today\'s Entrepreneurs Use Continuous Innovation.',
      price: 16.99,
      isbn: '978-0307887894',
      publisher: 'Currency',
      pages: 336,
      coverImage: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400',
      stock: 45,
      sold: 950,
      category: 'Business & Economics',
    },
    {
      title: 'JavaScript: The Good Parts',
      author: 'Douglas Crockford',
      description: 'Unearthing the Excellence in JavaScript.',
      price: 29.99,
      isbn: '978-0596517748',
      publisher: 'O\'Reilly Media',
      pages: 176,
      coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400',
      stock: 30,
      sold: 780,
      category: 'Science & Technology',
    },
    {
      title: 'The Power of Now',
      author: 'Eckhart Tolle',
      description: 'A Guide to Spiritual Enlightenment.',
      price: 14.99,
      isbn: '978-1577314806',
      publisher: 'New World Library',
      pages: 236,
      coverImage: 'https://images.unsplash.com/photo-1513001900722-370f803f498d?w=400',
      stock: 80,
      sold: 1500,
      category: 'Self-Help',
    },
    {
      title: '1984',
      author: 'George Orwell',
      description: 'A dystopian social science fiction novel.',
      price: 11.99,
      isbn: '978-0451524935',
      publisher: 'Signet Classic',
      pages: 328,
      coverImage: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=400',
      stock: 120,
      sold: 3800,
      category: 'Fiction',
    },
    {
      title: 'Thinking, Fast and Slow',
      author: 'Daniel Kahneman',
      description: 'A tour of the mind and explains the two systems that drive thinking.',
      price: 17.99,
      isbn: '978-0374533557',
      publisher: 'Farrar, Straus and Giroux',
      pages: 499,
      coverImage: 'https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?w=400',
      stock: 55,
      sold: 1100,
      category: 'Non-Fiction',
    },
  ];

  for (const bookData of booksData) {
    const { category, ...book } = bookData;
    await prisma.book.upsert({
      where: { isbn: book.isbn },
      update: {},
      create: {
        ...book,
        slug: slugify(book.title),
        categoryId: categories[category].id,
      },
    });
  }
  console.log('✅ Books created');

  console.log('🎉 Seeding completed!');
  console.log('\n📝 Login credentials:');
  console.log('   Admin: admin@bookstore.com / admin123');
  console.log('   User:  user@bookstore.com / user123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
