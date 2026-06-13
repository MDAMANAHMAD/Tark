import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import dbConnect from './db';
import User from './models/user';

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter both email and password');
        }

        await dbConnect();

        let user = await User.findOne({ email: credentials.email.toLowerCase() });

        if (!user) {
          const defaultEmail = (process.env.ADMIN_INITIAL_EMAIL || 'admin@tark.com').toLowerCase();
          if (credentials.email.toLowerCase() === defaultEmail) {
            // Check if any admin exists in the database
            const adminExists = await User.findOne({ role: 'admin' });
            if (!adminExists) {
              const defaultPassword = process.env.ADMIN_INITIAL_PASSWORD || 'AdminTark2026!';
              const hashedPassword = await bcrypt.hash(defaultPassword, 12);
              user = await User.create({
                name: 'Admin User',
                email: defaultEmail,
                password: hashedPassword,
                role: 'admin',
              });

              // Auto-seed default categories
              try {
                const Category = (await import('./models/category')).default;
                const defaultCategories = ['Constitutional Law', 'Criminal Justice', 'Corporate Law', 'Human Rights', 'Legal Tech', 'Law School Tips'];
                for (const cat of defaultCategories) {
                  const slug = cat.toLowerCase().replace(/\s+/g, '-');
                  const existing = await Category.findOne({ slug });
                  if (!existing) {
                    await Category.create({ name: cat, slug });
                  }
                }
              } catch (catErr) {
                console.error('Failed to auto-seed categories during login:', catErr);
              }
            }
          }
        }

        if (!user) {
          throw new Error('No user found with this email');
        }

        const isValidPassword = await bcrypt.compare(credentials.password, user.password);

        if (!isValidPassword) {
          throw new Error('Incorrect password');
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 1 day
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      
      // Allow updates to the profile (name/email) dynamically
      if (trigger === 'update' && session) {
        token.name = session.name;
        token.email = session.email;
      }
      
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
