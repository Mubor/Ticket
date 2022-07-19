import { AppointmentRepository } from "../ports/repositories/appointment";

export class ClearAppointmentCommand {
	constructor(private readonly appointmentRepository: AppointmentRepository) {}

	async execute(): Promise<void> {
		return this.appointmentRepository.clear();
	}
}