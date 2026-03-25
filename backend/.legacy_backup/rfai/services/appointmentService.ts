import { prisma } from '../prisma';
import { Appointment } from '../../../shared';

export const appointmentService = {
  async getAllAppointments(): Promise<Appointment[]> {
    const appointments = await prisma.appointment.findMany();

    return appointments.map((appointment) => ({
      id: appointment.id,
      date: appointment.date,
      time: appointment.time,
      patientId: appointment.patientId,
      patientName: appointment.patientName,
      type: appointment.type,
      meetLink: appointment.meetLink,
      status: appointment.status as 'upcoming' | 'completed',
      weekNumber: appointment.weekNumber || undefined,
    }));
  },

  async getAppointmentsByPatientId(patientId: string): Promise<Appointment[]> {
    const appointments = await prisma.appointment.findMany({
      where: { patientId },
    });

    return appointments.map((appointment) => ({
      id: appointment.id,
      date: appointment.date,
      time: appointment.time,
      patientId: appointment.patientId,
      patientName: appointment.patientName,
      type: appointment.type,
      meetLink: appointment.meetLink,
      status: appointment.status as 'upcoming' | 'completed',
      weekNumber: appointment.weekNumber || undefined,
    }));
  },

  async createAppointment(data: Omit<Appointment, 'id'>): Promise<Appointment> {
    const appointment = await prisma.appointment.create({
      data: {
        date: data.date,
        time: data.time,
        patientId: data.patientId,
        patientName: data.patientName,
        type: data.type,
        meetLink: data.meetLink,
        status: data.status,
        weekNumber: data.weekNumber,
      },
    });

    return {
      id: appointment.id,
      date: appointment.date,
      time: appointment.time,
      patientId: appointment.patientId,
      patientName: appointment.patientName,
      type: appointment.type,
      meetLink: appointment.meetLink,
      status: appointment.status as 'upcoming' | 'completed',
      weekNumber: appointment.weekNumber || undefined,
    };
  },

  async updateAppointment(id: string, data: Partial<Appointment>): Promise<Appointment> {
    const appointment = await prisma.appointment.update({
      where: { id },
      data: {
        date: data.date,
        time: data.time,
        patientId: data.patientId,
        patientName: data.patientName,
        type: data.type,
        meetLink: data.meetLink,
        status: data.status,
        weekNumber: data.weekNumber,
      },
    });

    return {
      id: appointment.id,
      date: appointment.date,
      time: appointment.time,
      patientId: appointment.patientId,
      patientName: appointment.patientName,
      type: appointment.type,
      meetLink: appointment.meetLink,
      status: appointment.status as 'upcoming' | 'completed',
      weekNumber: appointment.weekNumber || undefined,
    };
  },

  async deleteAppointment(id: string): Promise<void> {
    await prisma.appointment.delete({
      where: { id },
    });
  },
};
