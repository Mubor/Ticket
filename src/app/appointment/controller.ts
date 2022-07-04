import { Appointment } from "../../domain/appointment";
import { CLI, CLICommand } from "../../ports/cli";
import { Logger } from "../../ports/logger";
import { CreateAppointmentCommand } from "../../commands/CreateAppointmentCommand";
import { GetAppointmentCommand } from "../../commands/GetAppointmentCommand";
import { AppointmentRepository } from "../../ports/repositories/appointment";

export class AppointmentController {
	constructor(
		private readonly nodeCliOutput: Logger,
		private readonly nodeCli: CLI,
		private readonly appointmentRepository: AppointmentRepository
	) {}

	async process() {
		const command = this.nodeCli.getCommand();

		if (command === CLICommand.CREATE) {
			const appointment = await new CreateAppointmentCommand(
				this.appointmentRepository
			).execute();

			const record = Appointment.toRecord(appointment);

			this.nodeCliOutput.print(`[${record.id}] has been created`);
		}

		if (command === CLICommand.GET) {
			const { id } = this.nodeCli.getQuery();

			const appointment = await new GetAppointmentCommand(this.appointmentRepository).execute({
				id,
			});

			const record = Appointment.toRecord(appointment);

			this.nodeCliOutput.print(`[${record.id}] has been found`);
		}
	}
}
