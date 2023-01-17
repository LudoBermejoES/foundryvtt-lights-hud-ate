export interface CalculatedUsesData {
	available: number;
	maximum?: number | null;
	isAmmunition?: boolean;
	showZeroUses?: boolean;
	consumed?: boolean | number;
}
