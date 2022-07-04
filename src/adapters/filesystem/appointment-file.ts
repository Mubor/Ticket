import { resolve } from "node:path";
import { readdir, writeFile, readFile, stat } from "node:fs/promises";
import * as dayjs from "dayjs";

import { Appointment } from "../../domain/appointment";
import { File, State } from "../../ports/file";

export class AppointmentFile implements File<Appointment> {
  private static readonly DIRECTORY = resolve(__dirname, "../../../store");

  private fileName: string;

  private constructor(fileName: string) {
    this.fileName = fileName;
  }

  static async initStore(): Promise<AppointmentFile> {
    const files = await readdir(AppointmentFile.DIRECTORY);

    for (const fileName of files) {
      const { ctimeMs } = await stat(`${AppointmentFile.DIRECTORY}/${fileName}`);

      if (dayjs(ctimeMs).isAfter(dayjs().startOf("d"))) {
        return new AppointmentFile(fileName);
      }
    }

    const fileName = AppointmentFile.createName();
    await AppointmentFile.writeStore(fileName, "{}");

    return new AppointmentFile(fileName);
  }

  private static createName(): string {
    return `${new Date().toISOString().split("T")[0]}-store.json`;
  }

  private static async readStore(fileName: string): Promise<string> {
    return readFile(`${AppointmentFile.DIRECTORY}/${fileName}`, "utf-8");
  }

  private static async writeStore(fileName: string, content: string): Promise<void> {
    await writeFile(`${AppointmentFile.DIRECTORY}/${fileName}`, content);
  }

  async getState(): Promise<State<Appointment>> {
    return JSON.parse(await AppointmentFile.readStore(this.fileName));
  }

  async setState(state: State<Appointment>): Promise<void> {
    await AppointmentFile.writeStore(this.fileName, JSON.stringify(state));
  }
}