
import { Context, Contract } from 'fabric-contract-api';
import { AssetDetails } from './models/Asset.model';

export class PropertiesContract extends Contract {

    public async initLedger(ctx: Context) {
        console.info('============= START : Initialize Ledger ===========');
        const assets: AssetDetails[] = [
            {
                propertyArea: '1400 sqft.',
                ownerName: 'sam dave',
                value: 12332,
                location : '12 avenue,richar street , california',
                type: 'single',
                propertyNumber: 1000001
            },
            {
                propertyArea: '1400 sqft.',
                ownerName: 'sam dave',
                value: 12332,
                location : '12 avenue,richar street , california',
                type: 'single',
                propertyNumber: 100002
            }
        ];

        for (let i = 0; i < assets.length; i++) {
            
            await ctx.stub.putState('Properties' + i, Buffer.from(JSON.stringify(assets[i])));
            console.info('Added <--> ', assets[i]);
        }
        console.info('============= END : Initialize Ledger ===========');
    }

    public async queryAsset(ctx: Context, assetNumber: string): Promise<string> {
        const assetAsBytes = await ctx.stub.getState(assetNumber); // get the car from chaincode state
        if (!assetAsBytes || assetAsBytes.length === 0) {
            throw new Error(`${assetNumber} does not exist`);
        }
        console.log(assetAsBytes.toString());
        return assetAsBytes.toString();
    }

    public async createProperty(ctx: Context, propertyNumber: number, propertyArea: string, cost: number, type: string, location: string,value: number, ownerName: string) {
        console.info('============= START : Create Car ===========');

        const asset: AssetDetails = {
            propertyArea,
            location,
            propertyNumber,
            type,
            value,
            ownerName,
        };

        await ctx.stub.putState(propertyNumber, Buffer.from(JSON.stringify(asset)));
        console.info('============= END : Create Property ===========');
    }

    public async queryAllAssets(ctx: Context): Promise<string> {
        const startKey = '1000001';
        const endKey = '1000099';

        const iterator = await ctx.stub.getStateByRange(startKey, endKey);

        const allResults = [];
        while (true) {
            const res = await iterator.next();

            if (res.value && res.value.value.toString()) {
                console.log(res.value.value.toString('utf8'));

                const Key = res.value.key;
                let Record;
                try {
                    Record = JSON.parse(res.value.value.toString('utf8'));
                } catch (err) {
                    console.log(err);
                    Record = res.value.value.toString('utf8');
                }
                allResults.push({ Key, Record });
            }
            if (res.done) {
                console.log('end of data');
                await iterator.close();
                console.info(allResults);
                return JSON.stringify(allResults);
            }
        }
    }

    public async changePropertyOwner(ctx: Context, propertyNumber: string, newOwner: string) {
        console.info('============= START : changeOwner ===========');

        const assetDetailsAsBytes = await ctx.stub.getState(propertyNumber); // get the car from chaincode state
        if (!assetDetailsAsBytes || assetDetailsAsBytes.length === 0) {
            throw new Error(`${propertyNumber} does not exist`);
        }
        const asset: AssetDetails = JSON.parse(assetDetailsAsBytes.toString());
        asset.ownerName = newOwner;

        await ctx.stub.putState(propertyNumber, Buffer.from(JSON.stringify(asset)));
        console.info('============= END : changeCarOwner ===========');
    }

}
