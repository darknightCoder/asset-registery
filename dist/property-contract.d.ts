import { Context, Contract } from 'fabric-contract-api';
export declare class PropertiesContract extends Contract {
    initLedger(ctx: Context): Promise<void>;
    queryAsset(ctx: Context, assetNumber: string): Promise<string>;
    createProperty(ctx: Context, propertyNumber: string, propertyArea: string, cost: number, type: string, location: string, value: number, ownerName: string): Promise<void>;
    queryAllAssets(ctx: Context, startKey: string, endKey: string): Promise<string>;
    changePropertyOwner(ctx: Context, propertyNumber: string, newOwner: string): Promise<void>;
}
