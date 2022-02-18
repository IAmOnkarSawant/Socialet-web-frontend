import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "../../../config/connectDB";
import Users from "./../../../models/Users";
import bcrypt from "bcrypt";

connectDB();

export default NextAuth({
  session: {
    jwt: true,
    secret: process.env.NEXTAUTH_SECRET,
  },
  providers: [
    CredentialsProvider({
      id: "register_provider",
      name: "Registration",
      async authorize(credentials) {
        return registerUser({ ...credentials });
      },
    }),
    CredentialsProvider({
      id: "login_provider",
      name: "Login",
      async authorize(credentials) {
        return loginUser({ ...credentials });
      },
    }),
  ],
  pages: {
    signIn: "/authPages/login",
  },
  // MongoDB database
  database: process.env.DATABASE_URL,
  callbacks: {
    session: async (session, user) => {
      return Promise.resolve(session);
    },
  },
});

const loginUser = async ({ email, password }) => {
  const user = await Users.findOne({ email });
  if (!user) throw new Error("User not found!");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Password is incorrect");
  else return user;
};

const registerUser = async ({ email, password, name }) => {
  const userFound = await Users.findOne({ email });
  if (userFound) {
    throw new Error("User is already registred with this mail id");
  }
  const hashPass = await bcrypt.hash(password, 12);
  const newUser = Users.create({ name, email, password: hashPass });
  if (newUser) return newUser;
  else throw new Error("User is not created due to some internal problem");
};
