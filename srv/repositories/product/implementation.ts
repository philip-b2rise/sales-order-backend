import cds from '@sap/cds';

import { Products } from '@models/sales';
import { ProductModel, ProductProps } from "srv/models/product";
import { ProductRepository } from "./protocols";

export class ProductRepositoryImpl implements ProductRepository {
    public async findByIds(ids: ProductProps['id'][]): Promise<ProductModel[] | null> {
        const productsQuery = SELECT.from('sales.Products').where({ id: ids });
        const products: Products = await cds.run(productsQuery);

        if (!products.length) {
            return null;
        }

        return products.map((product) => ProductModel.with({
            id: product.id as string,
            name: product.name as string,
            price: product.price as number,
            stock: product.stock as number,
        }));
    }

    public async updateStock(product: ProductModel): Promise<void> {
        await cds.update('sales.Products').where({ id: product.id }).with({ stock: product.stock });
    }
}
