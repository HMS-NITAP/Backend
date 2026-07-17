import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import "dotenv/config";

const prisma = new PrismaClient();

const getCredentials = () => {
    const email = process.env.ADMIN_EMAIL ?? "admin@admin.com";
    const password = process.env.ADMIN_PASSWORD ?? "admin";

    return { email, password };
};

const createAdmin = async (email, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);

    return prisma.user.upsert({
        where: { email },
        update: {
            password: hashedPassword,
            accountType: "ADMIN",
            status: "ACTIVE",
        },
        create: {
            email,
            password: hashedPassword,
            accountType: "ADMIN",
            status: "ACTIVE",
        },
    });
};

const main = async () => {
    const { email, password } = getCredentials();
    const admin = await createAdmin(email, password);

    console.log(`Admin account ready: ${admin.email}`);
};

try {
    await main();
} catch (error) {
    console.error("Unable to create admin account:", error);
    process.exitCode = 1;
} finally {
    await prisma.$disconnect();
}
