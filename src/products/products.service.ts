import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Product } from './product.model';

@Injectable()
export class ProductsService {
    products: Product[] = [];

    constructor(
        @InjectModel('Product') private readonly productModel: Model<Product>
    ) { }


    async insertProduct(title: string, description: string, price: number): Promise<string> {
        const productId = Math.random().toString();
        const newProduct = new this.productModel({ title, description, price });
        const result = await newProduct.save();

        return result.id as string;
    }

    async getAllProducts(): Promise<Product[]> {
        const products = await this.productModel.find().exec();
        return products;
    }

    async getProduct(id: string) {
        const product = await this.findProduct(id);

        return product;
    }

    async updateProduct(productId: string, title: string, description: string, price: number) {
        const updatedProduct = await this.findProduct(productId);
        if (title) updatedProduct.title = title;
        if (description) updatedProduct.description = description;
        if (price) updatedProduct.price = price;

        updatedProduct.save();
    }

    async removeProduct(id: string) {
        const result = await this.productModel.deleteOne({ _id: id }).exec();
        if (result.deletedCount === 0) throw new NotFoundException('Could not find the product!');
    }


    private async findProduct(id: string): Promise<Product> {
        let product;
        try {
            product = await this.productModel.findById(id);
        } catch (err) {
            throw new NotFoundException('Could not find the product!');
        }

        if (!product) throw new NotFoundException('Could not find the product!');

        return product;
    }
}