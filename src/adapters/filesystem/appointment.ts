
import { isUndefined } from "lodash";
import { Appointment } from "../../domain/appointment";
import { NotFoundError } from "../../domain/error";
import { AppointmentRepository, FindManyFilter } from "../../ports/repositories/appointment";
import { File } from "../../ports/file";

export class FileSystemAppointmentRepository implements AppointmentRepository {
	constructor(private readonly file: File<Appointment>) {
		
	}

	async save(appointment: Appointment): Promise<Appointment> {
		const state = await this.file.getState();

		this.file.setState({...state, [appointment.id]: appointment })

		return appointment;
	}

	async findOne(id: string): Promise<Appointment | undefined> {
		const state = await this.file.getState();

		const record = state[id];

		return record;
	}

	async findMany({ completed, limit }: FindManyFilter): Promise<Appointment[]> {
		let records = Object.values(await this.file.getState());

		if (!isUndefined(completed)) {
			records = records.filter(record => record.completed === completed);
		}

		if (!isUndefined(limit) && isFinite(limit)) {
			records = records.slice(0, limit);
		}

		return records;
	}

	async update(appointment: Appointment): Promise<Appointment> {
		const state = await this.file.getState();

		const record = state[appointment.id];

		if (!record) {
			throw new NotFoundError();
		}

		this.file.setState({ ...state, [record.id]: appointment })

		return appointment;
	}
	
	async remove(id: string): Promise<void> {
		const state = await this.file.getState();

		const { [id]: record, ...nextState } = state;

		if (!record) {
			throw new NotFoundError();
		}

		this.file.setState(nextState);
	}
}