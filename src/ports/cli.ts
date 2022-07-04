export enum CLICommand {
	CREATE = "create",
	GET = "get",
}

export interface CLI {
	getCommand(): string;
	getQuery(): Record<string, string>;
}
