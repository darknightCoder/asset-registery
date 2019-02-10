"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fabric_contract_api_1 = require("fabric-contract-api");
class PropertiesContract extends fabric_contract_api_1.Contract {
    async initLedger(ctx) {
        const assets = [
            {
                propertyArea: '1400 sqft.',
                ownerName: 'sam dave',
                value: 12332,
                location: '12 avenue,richar street , california',
                type: 'single',
                propertyNumber: 'P1000001'
            },
            {
                propertyArea: '1400 sqft.',
                ownerName: 'sam dave',
                value: 12332,
                location: '12 avenue,richar street , california',
                type: 'single',
                propertyNumber: 'P100002'
            }
        ];
        for (let i = 0; i < assets.length; i++) {
            await ctx.stub.putState('Properties' + i, Buffer.from(JSON.stringify(assets[i])));
            console.info('Added <--> ', assets[i]);
        }
        console.info('============= END : Initialize Ledger ===========');
    }
    async queryAsset(ctx, assetNumber) {
        const assetAsBytes = await ctx.stub.getState(assetNumber); // get the car from chaincode state
        if (!assetAsBytes || assetAsBytes.length === 0) {
            throw new Error(`${assetNumber} does not exist`);
        }
        console.log(assetAsBytes.toString());
        return assetAsBytes.toString();
    }
    async createProperty(ctx, propertyNumber, propertyArea, cost, type, location, value, ownerName) {
        const assetDetailsAsBytes = await ctx.stub.getState(propertyNumber); // get the car from chaincode state
        if (assetDetailsAsBytes || assetDetailsAsBytes.length !== 0) {
            throw new Error(`${propertyNumber} already exists`);
        }
        const asset = {
            propertyArea,
            location,
            propertyNumber,
            type,
            value,
            ownerName,
        };
        await ctx.stub.putState(propertyNumber, Buffer.from(JSON.stringify(asset)));
    }
    async queryAllAssets(ctx, startKey, endKey) {
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
                }
                catch (err) {
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
    async changePropertyOwner(ctx, propertyNumber, newOwner) {
        console.info('============= START : changeOwner ===========');
        const assetDetailsAsBytes = await ctx.stub.getState(propertyNumber); // get the car from chaincode state
        if (!assetDetailsAsBytes || assetDetailsAsBytes.length === 0) {
            throw new Error(`${propertyNumber} does not exist`);
        }
        const asset = JSON.parse(assetDetailsAsBytes.toString());
        asset.ownerName = newOwner;
        await ctx.stub.putState(propertyNumber, Buffer.from(JSON.stringify(asset)));
        console.info('============= END : changeCarOwner ===========');
    }
}
exports.PropertiesContract = PropertiesContract;
//# sourceMappingURL=property-contract.js.map