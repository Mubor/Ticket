export enum CLICommand {
	CREATE = "create",
	GET = "get",
	COMPLETE = "complete",
	DELETE = "delete",
	CLEAR = "clear",
	LIST = "list"
}

export interface CLI {
	getCommand(): string;
	getQuery(): Record<string, string>;
}
