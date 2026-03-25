import { prisma } from '../prisma';
import { ServiceData, ProfileType, WeekContent, Question } from '../../../shared';

export const serviceService = {
  async getAllServices(): Promise<ServiceData[]> {
    const services = await prisma.service.findMany({
      include: {
        weeks: {
          include: {
            questions: true,
          },
          orderBy: {
            weekNumber: 'asc',
          },
        },
      },
    });

    return services.map(service => this._mapServiceToServiceData(service));
  },

  async getServiceByProfile(profile: ProfileType): Promise<ServiceData | null> {
    const service = await prisma.service.findUnique({
      where: { profile },
      include: {
        weeks: {
          include: {
            questions: true,
          },
          orderBy: {
            weekNumber: 'asc',
          },
        },
      },
    });

    if (!service) return null;

    return this._mapServiceToServiceData(service);
  },

  async createOrUpdateService(data: ServiceData): Promise<ServiceData> {
    // We cannot use a simple update with nested create/delete/update easily for arbitrary arrays
    // if we don't pass IDs for the weeks and questions from the frontend.
    // Let's assume the frontend passes the correct existing IDs for elements that already exist.
    // If not, we will need to fetch the existing service to do a manual diff.
    // Let's do a manual diff to be completely safe and avoid losing IDs.

    const existingService = await prisma.service.findUnique({
      where: { profile: data.profile }
    });

    if (!existingService) {
      // Create from scratch
      const service = await prisma.service.create({
        data: {
          profile: data.profile,
          title: data.title,
          weeks: {
            create: data.weeks.map((week) => ({
              weekNumber: week.weekNumber,
              title: week.title,
              reflexion: week.reflexion,
              ejercicio: JSON.stringify(week.ejercicio),
              audioUrl: week.audioUrl,
              youtubeUrl: week.youtubeUrl,
              videoConferenceEnabled: week.videoConferenceEnabled,
              questions: {
                create: week.questions.map((q) => ({
                  text: q.text,
                  type: q.type,
                  min: q.min,
                  max: q.max,
                })),
              },
            })),
          },
        },
        include: {
          weeks: { include: { questions: true }, orderBy: { weekNumber: 'asc' } },
        },
      });
      return this._mapServiceToServiceData(service);
    }

    // Relational-Safe Update: Iterate through weeks and questions manually to preserve historical IDs.
    // 1. Update the parent Service Title
    await prisma.service.update({
      where: { id: existingService.id },
      data: { title: data.title }
    });

    for (const weekData of data.weeks) {
      // Find the existing week for this service
      const existingWeek = await prisma.weekContent.findUnique({
        where: { serviceId_weekNumber: { serviceId: existingService.id, weekNumber: weekData.weekNumber } }
      });

      if (existingWeek) {
        // Update existing week
        await prisma.weekContent.update({
          where: { id: existingWeek.id },
          data: {
            title: weekData.title,
            reflexion: weekData.reflexion,
            ejercicio: JSON.stringify(weekData.ejercicio),
            audioUrl: weekData.audioUrl,
            youtubeUrl: weekData.youtubeUrl,
            videoConferenceEnabled: weekData.videoConferenceEnabled,
          }
        });

        // Handle questions
        const incomingQuestionIds = weekData.questions.map(q => q.id).filter(id => id && !id.startsWith('q'));

        // Delete questions that were removed in the UI
        await prisma.question.deleteMany({
          where: {
            weekContentId: existingWeek.id,
            id: { notIn: incomingQuestionIds }
          }
        });

        // Create or update remaining questions
        for (const qData of weekData.questions) {
          if (qData.id && !qData.id.startsWith('q')) {
            // Update existing question
            await prisma.question.update({
              where: { id: qData.id },
              data: {
                text: qData.text,
                type: qData.type,
                min: qData.min,
                max: qData.max,
              }
            });
          } else {
            // Create new question added from the UI
            await prisma.question.create({
              data: {
                weekContentId: existingWeek.id,
                text: qData.text,
                type: qData.type,
                min: qData.min,
                max: qData.max,
              }
            });
          }
        }
      } else {
        // If a new week object was introduced (fallback)
        await prisma.weekContent.create({
          data: {
            serviceId: existingService.id,
            weekNumber: weekData.weekNumber,
            title: weekData.title,
            reflexion: weekData.reflexion,
            ejercicio: JSON.stringify(weekData.ejercicio),
            audioUrl: weekData.audioUrl,
            youtubeUrl: weekData.youtubeUrl,
            videoConferenceEnabled: weekData.videoConferenceEnabled,
            questions: {
              create: weekData.questions.map(qData => ({
                text: qData.text,
                type: qData.type,
                min: qData.min,
                max: qData.max,
              }))
            }
          }
        });
      }
    }

    // Refetch the complete structure to return to the frontend
    const updatedService = await prisma.service.findUnique({
      where: { id: existingService.id },
      include: {
        weeks: { include: { questions: true }, orderBy: { weekNumber: 'asc' } }
      }
    });

    if (!updatedService) {
      throw new Error("Critical synchronization error after update");
    }

    return this._mapServiceToServiceData(updatedService);
  },

  _mapServiceToServiceData(service: any): ServiceData {
    return {
      profile: service.profile as ProfileType,
      title: service.title,
      weeks: service.weeks.map((week: any) => {
        let parsedEjercicio: string[] = [];
        try {
          parsedEjercicio = JSON.parse(week.ejercicio);
        } catch {
          // Fallback if the string wasn't valid JSON (e.g., legacy string)
          parsedEjercicio = week.ejercicio ? [week.ejercicio] : [];
        }

        return {
          serviceId: service.id,
          weekNumber: week.weekNumber,
          title: week.title,
          reflexion: week.reflexion,
          ejercicio: parsedEjercicio,
          audioUrl: week.audioUrl,
          youtubeUrl: week.youtubeUrl,
          videoConferenceEnabled: week.videoConferenceEnabled,
          questions: week.questions.map((q: any) => ({
            id: q.id,
            text: q.text,
            type: q.type as 'slider',
            min: q.min,
            max: q.max,
          })),
        };
      }),
    };
  }
};
