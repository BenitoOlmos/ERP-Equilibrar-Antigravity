import { prisma } from '../prisma';
import { WeeklyEvaluationPayload } from '../../../shared';

export const evaluationService = {
  async createEvaluation(data: WeeklyEvaluationPayload): Promise<WeeklyEvaluationPayload> {
    const existingEval = await prisma.weeklyEvaluation.findFirst({
      where: { userId: data.userId, weekNumber: data.weekNumber },
      orderBy: { timestamp: 'desc' }
    });

    let evaluation;
    if (existingEval) {
      evaluation = await prisma.weeklyEvaluation.update({
        where: { id: existingEval.id },
        data: {
          timestamp: new Date(data.timestamp),
          audioListenTime: data.audioListenTime,
          exerciseExecutionTime: data.exerciseExecutionTime,
          reflectionReadCount: data.reflectionReadCount,
          answers: {
            deleteMany: {},
            create: Object.entries(data.answers).map(([questionId, value]) => ({
              questionId,
              value,
            })),
          },
        },
        include: { answers: true }
      });
    } else {
      evaluation = await prisma.weeklyEvaluation.create({
        data: {
          userId: data.userId,
          serviceId: data.serviceId,
          weekNumber: data.weekNumber,
          timestamp: new Date(data.timestamp),
          audioListenTime: data.audioListenTime,
          exerciseExecutionTime: data.exerciseExecutionTime,
          reflectionReadCount: data.reflectionReadCount,
          answers: {
            create: Object.entries(data.answers).map(([questionId, value]) => ({
              questionId,
              value,
            })),
          },
        },
        include: { answers: true },
      });
    }

    const answersRecord: Record<string, number> = {};
    evaluation.answers.forEach((answer) => {
      answersRecord[answer.questionId] = answer.value;
    });

    return {
      userId: evaluation.userId,
      serviceId: evaluation.serviceId,
      weekNumber: evaluation.weekNumber,
      timestamp: evaluation.timestamp.toISOString(),
      audioListenTime: evaluation.audioListenTime || undefined,
      exerciseExecutionTime: evaluation.exerciseExecutionTime || undefined,
      reflectionReadCount: evaluation.reflectionReadCount || undefined,
      answers: answersRecord,
    };
  },

  async getEvaluationsByUserId(userId: string): Promise<WeeklyEvaluationPayload[]> {
    const evaluations = await prisma.weeklyEvaluation.findMany({
      where: { userId },
      include: {
        answers: true,
      },
      orderBy: {
        timestamp: 'desc',
      },
    });

    return evaluations.map((evaluation) => {
      const answersRecord: Record<string, number> = {};
      evaluation.answers.forEach((answer) => {
        answersRecord[answer.questionId] = answer.value;
      });

      return {
        userId: evaluation.userId,
        serviceId: evaluation.serviceId,
        weekNumber: evaluation.weekNumber,
        timestamp: evaluation.timestamp.toISOString(),
        audioListenTime: evaluation.audioListenTime || undefined,
        exerciseExecutionTime: evaluation.exerciseExecutionTime || undefined,
        reflectionReadCount: evaluation.reflectionReadCount || undefined,
        answers: answersRecord,
      };
    });
  },
};
