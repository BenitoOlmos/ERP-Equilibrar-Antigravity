import { prisma } from '../prisma';
import { User, ProfileType, Role } from '../../../shared';
import bcrypt from 'bcrypt';

export const userService = {
  async getAllUsers(): Promise<User[]> {
    const users = await prisma.user.findMany({
      include: {
        completedWeeks: true,
      },
    });

    return users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as Role,
      profile: user.profile as ProfileType | undefined,
      currentWeek: user.currentWeek || undefined,
      completedWeeks: user.completedWeeks.map((cw) => cw.weekNumber),
      notes: user.notes || undefined,
      phone: user.phone || undefined,
      meetLink: user.meetLink || undefined,
      createdAt: user.createdAt.toISOString(),
    }));
  },

  async getUserById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        completedWeeks: true,
      },
    });

    if (!user) return null;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as Role,
      profile: user.profile as ProfileType | undefined,
      currentWeek: user.currentWeek || undefined,
      completedWeeks: user.completedWeeks.map((cw) => cw.weekNumber),
      notes: user.notes || undefined,
      phone: user.phone || undefined,
      meetLink: user.meetLink || undefined,
      createdAt: user.createdAt.toISOString(),
    };
  },

  async createUser(data: Omit<User, 'id'>): Promise<User> {
    const saltRounds = 10;
    const hashedPassword = data.password ? await bcrypt.hash(data.password, saltRounds) : undefined;

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role,
        profile: data.profile,
        currentWeek: data.currentWeek,
        notes: data.notes,
        phone: data.phone,
        meetLink: data.meetLink, // IDE cache refresh
        completedWeeks: {
          create: data.completedWeeks?.map((weekNumber) => ({ weekNumber })) || [],
        },
      },
      include: {
        completedWeeks: true,
      },
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as Role,
      profile: user.profile as ProfileType | undefined,
      currentWeek: user.currentWeek || undefined,
      completedWeeks: user.completedWeeks.map((cw) => cw.weekNumber),
      notes: user.notes || undefined,
      phone: user.phone || undefined,
      meetLink: user.meetLink || undefined,
      createdAt: user.createdAt.toISOString(),
    };
  },

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    const saltRounds = 10;
    const hashedPassword = data.password ? await bcrypt.hash(data.password, saltRounds) : undefined;

    const updateData: any = {
      name: data.name,
      email: data.email,
      role: data.role,
      profile: data.profile,
      currentWeek: data.currentWeek,
      notes: data.notes,
      phone: data.phone,
      meetLink: data.meetLink,
      ...(data.completedWeeks && {
        completedWeeks: {
          deleteMany: {},
          create: data.completedWeeks.map((weekNumber) => ({ weekNumber })),
        },
      }),
    };

    if (hashedPassword) {
      updateData.password = hashedPassword;
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      include: {
        completedWeeks: true,
      },
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as Role,
      profile: user.profile as ProfileType | undefined,
      currentWeek: user.currentWeek || undefined,
      completedWeeks: user.completedWeeks.map((cw) => cw.weekNumber),
      notes: user.notes || undefined,
      phone: user.phone || undefined,
      meetLink: user.meetLink || undefined,
      createdAt: user.createdAt.toISOString(),
    };
  },

  async deleteUser(id: string): Promise<void> {
    await prisma.user.delete({
      where: { id },
    });
  },
};
