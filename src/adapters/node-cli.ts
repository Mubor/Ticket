import { isUndefined } from "lodash";
import { DomainError } from "../domain/error";
import { CLI, CLICommand } from "../ports/cli";

export class NodeCLI implements CLI {
	getCommand(): CLICommand {
		const { arg } = this.parseArguments();

		if (!arg) {
			const errorMessage = "CLICommandArgument not found";

			throw new DomainError(errorMessage);
		}

		if (!arg.startsWith("--")) {
			const errorMessage = "CLICommandArgument must start with --";

			throw new DomainError(errorMessage);
		}

		return arg.slice(2) as CLICommand;
	}

	getQuery<T>(): T {
		const { arg, query } = this.parseArguments();

		if (!arg) {
			const errorMessage = "CLICommandArgument must be specified before query";

			throw new DomainError(errorMessage);
		}

		if (!query) {
			return {} as T;
		}

		return this.parseQueryParams<T>(query);
	}

	private parseQueryParams<T>(query: string): T {
		const queryList = query.split("&");

		return queryList.reduce((params, current) => {
			const [queryKey, queryValue] = current.split("=");

			if (!isUndefined(queryValue)) {
				return { ...params, [queryKey]: this.castQueryParam(queryValue) };
			}

			return params;
		}, {} as T);
	}

	private castQueryParam(value: string): unknown {
		if (!isNaN(Number(value))) {
			return Number(value);
		}

		if (value === "false") {
			return false;
		}

		if (value === "true") {
			return true;
		}

		return value;
	}

	private parseArguments(): { arg?: string; query?: string } {
		const [arg, query] = process.argv.slice(2);

		return {
			arg,
			query,
		};
	}
}
