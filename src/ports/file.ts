export type State<Entity> = Record<string, Entity>;

export interface File<Entity> {
	getState(): Promise<State<Entity>>;
	setState(state: State<Entity>): Promise<void>;
}
