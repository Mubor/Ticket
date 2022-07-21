import { Appointment } from "../domain/appointment";
import { AppointmentRepository, FindManyFilter } from "../ports/repositories/appointment";

export class ListAppointmentCommand {
	constructor(private readonly appointmentRepository: AppointmentRepository) {}

	async execute({completed , limit}: FindManyFilter): Promise<Array<Appointment>> {        
        return await this.appointmentRepository.findMany({completed, limit})                
	}
}