import { Appointment } from "../../domain/appointment";
import { CLI, CLICommand } from "../../ports/cli";
import { Logger } from "../../ports/logger";
import { CreateAppointmentCommand } from "../../commands/CreateAppointmentCommand";
import { GetAppointmentCommand } from "../../commands/GetAppointmentCommand";
import { AppointmentRepository } from "../../ports/repositories/appointment";
import { DeleteAppointmentCommand } from "../../commands/DeleteAppointmentCommand";
import { CompleteAppointmentCommand } from "../../commands/CompleteAppointmentCommand";
import { ClearAppointmentCommand } from "../../commands/CLearAppointmentCommand";
import { ListAppointmentCommand } from "../../commands/ListAppointmentCommand";

export class AppointmentController {
	constructor(
		private readonly nodeCliOutput: Logger,
		private readonly nodeCli: CLI,
		private readonly appointmentRepository: AppointmentRepository
	) {}

	async process() {
		const command = this.nodeCli.getCommand();

		if (command === CLICommand.CREATE) {
			const appointment = await new CreateAppointmentCommand(this.appointmentRepository).execute();

			const record = Appointment.toRecord(appointment);

			this.nodeCliOutput.print(`[${record.id}] has been created`);
		}

		else if (command === CLICommand.GET) {
			const { id } = this.nodeCli.getQuery();

			const appointment = await new GetAppointmentCommand(this.appointmentRepository).execute({
				id,
			});

			const record = Appointment.toRecord(appointment);

			this.nodeCliOutput.print(`${JSON.stringify(record)}`);
		}

		else if (command === CLICommand.DELETE) {
			const { id } = this.nodeCli.getQuery();

			await new DeleteAppointmentCommand(this.appointmentRepository).execute({
				id,
			});	

			this.nodeCliOutput.print(`${id} deleted`);
		}

		else if(command === CLICommand.COMPLETE) {
			const { id } = this.nodeCli.getQuery();

			await new CompleteAppointmentCommand(this.appointmentRepository).execute({
				id,
			});

			this.nodeCliOutput.print(`${id} completed`);
		}
		
		else if(command === CLICommand.CLEAR) {
			await new ClearAppointmentCommand(this.appointmentRepository).execute();
			this.nodeCliOutput.print(`data has been cleared`);
		}

		else if(command === CLICommand.LIST) {
			let {status, limit} = this.nodeCli.getQuery();

			const appointments = await new ListAppointmentCommand(this.appointmentRepository)
				.execute({completed: status === undefined ? status : JSON.parse(status), limit: parseInt(limit)});

			for (const appointment of appointments) {
				this.nodeCliOutput.print(this.getOutputString(appointment));			
			}
		}
	}

	getOutputString(appointment: Appointment): string {
		appointment = Appointment.toModel(appointment);
		return `${appointment.id} | ${appointment.completed} | ${appointment.created_at} | ${appointment.updated_at || ''}`
	}
}
