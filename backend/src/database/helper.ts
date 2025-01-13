import connectToDatabase  from '../config/db'
import ProductModel from '../models/Product'

export async function markProductAsSold(productId: string) {
    await connectToDatabase();
    const product = await ProductModel.findById(productId);
    console.log('Product retrieved:', product);
    console.log('Current approvedForSale value:', product?.approvedForSale);

    if (product?.approvedForSale === 'approved') {
        const updatedProduct = await ProductModel.findOneAndUpdate(
            { _id: productId, approvedForSale: 'approved' },
            { $set: { approvedForSale: 'sold' } },
            { new: true }
        );

        if (!updatedProduct) {
            console.warn('No products were updated. Check the product state and condition.');
        } else {
            console.log('Updated product state:', updatedProduct);
        }
    } else {
        console.warn('Product is not approved for sale:', product?.approvedForSale);
    }
}

import v8 from 'v8';


// log memeory usage to figure out deployment error
export function logMemoryUsage() {
  const memoryUsage = process.memoryUsage();
  const heapStats = v8.getHeapStatistics();
  console.log('Memory Usage:', {
    rss: `${Math.round(memoryUsage.rss / 1024 / 1024)} MB`,
    heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB`,
    heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`,
    external: `${Math.round(memoryUsage.external / 1024 / 1024)} MB`,
    heapSizeLimit: `${Math.round(heapStats.heap_size_limit / 1024 / 1024)} MB`,
  });
}