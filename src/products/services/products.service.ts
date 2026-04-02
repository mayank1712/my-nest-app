import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from '../schemas/product.schema';
import { CreateProductDto, ProductQueryDto } from '../dto/product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const newProduct = new this.productModel(createProductDto);
    return newProduct.save();
  }

  async findAll(query: ProductQueryDto) {
    const {
      category,
      minPrice,
      maxPrice,
      search,
      sortBy,
      page = 1,
      limit = 10,
    } = query;
    const filter: any = {};

    if (category) filter.category = category;
    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) filter.price.$gte = minPrice;
      if (maxPrice !== undefined) filter.price.$lte = maxPrice;
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const sort: any = {};
    if (sortBy) {
      const [field, order] = sortBy.split(':');
      sort[field] = order === 'desc' ? -1 : 1;
    } else {
      sort.createdAt = -1;
    }

    const total = await this.productModel.countDocuments(filter);
    const products = await this.productModel
      .find(filter)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    return {
      products,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async seed() {
    await this.productModel.deleteMany({});
    const dummyProducts = [
      {
        name: 'iPhone 15 Pro Max',
        description:
          'Experience the ultimate in mobile technology with the A17 Pro chip and a stunning Titanium design.',
        price: 159900,
        category: 'Mobiles',
        image:
          'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=1000&auto=format&fit=crop',
        rating: 4.9,
        stock: 32,
      },
      {
        name: 'Samsung Odyssey Ark 2',
        description:
          'Immerse yourself in a 55-inch 4K UHD 165Hz 1ms Quantum Mini-LED curved gaming screen.',
        price: 229900,
        category: 'Electronics',
        image:
          'https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=1000&auto=format&fit=crop',
        rating: 4.8,
        stock: 8,
      },
      {
        name: 'Zenith Mechanical Watch',
        description:
          'A masterpiece of Swiss engineering. Featuring an open-heart design and sapphire crystal.',
        price: 850000,
        category: 'Accessories',
        image:
          'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop',
        rating: 4.9,
        stock: 5,
      },
      {
        name: 'Sony Alpha a7 IV',
        description:
          'Full-frame mirrorless camera with 33MP sensor and 4K 60p video capabilities.',
        price: 199990,
        category: 'Electronics',
        image:
          'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1000&auto=format&fit=crop',
        rating: 4.9,
        stock: 12,
      },
      {
        name: 'Modernist Velvet Sofa',
        description:
          'Plush velvet upholstery and solid oak legs. A centerpiece for any contemporary living room.',
        price: 125000,
        category: 'Furniture',
        image:
          'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1000&auto=format&fit=crop',
        rating: 4.7,
        stock: 10,
      },
      {
        name: 'Artisan Ceramic Vase',
        description:
          'Hand-thrown ceramic vase with a unique reactive glaze finish.',
        price: 5900,
        category: 'Decor',
        image:
          'https://images.unsplash.com/photo-1581783898377-1c85bf937427?q=80&w=1000&auto=format&fit=crop',
        rating: 4.6,
        stock: 45,
      },
      {
        name: 'Air Jordan 1 Retro High',
        description:
          'The iconic "Lost and Found" colorway. A piece of sneaker history for your collection.',
        price: 45000,
        category: 'Shoes',
        image:
          'https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=1000&auto=format&fit=crop',
        rating: 4.9,
        stock: 15,
      },
      {
        name: 'Minimalist Oak Desk',
        description:
          'Handcrafted from sustainably sourced solid oak. Built to last a lifetime.',
        price: 78000,
        category: 'Furniture',
        image:
          'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?q=80&w=1000&auto=format&fit=crop',
        rating: 4.8,
        stock: 20,
      },
      {
        name: 'Bose QuietComfort Ultra',
        description:
          'World-class noise cancellation and spatial audio for an immersive listening experience.',
        price: 35900,
        category: 'Electronics',
        image:
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop',
        rating: 4.8,
        stock: 50,
      },
      {
        name: 'Cashmere Overcoat',
        description:
          'Luxuriously soft 100% Italian cashmere. Tailored fit for the modern gentleman.',
        price: 42000,
        category: 'Clothes',
        image:
          'https://images.unsplash.com/photo-1539533377285-a7b38964724a?q=80&w=1000&auto=format&fit=crop',
        rating: 4.7,
        stock: 25,
      },
      {
        name: 'Ray-Ban Wayfarer Classic',
        description:
          'The most recognizable style in the history of sunglasses. Timeless and iconic.',
        price: 10990,
        category: 'Accessories',
        image:
          'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=1000&auto=format&fit=crop',
        rating: 4.6,
        stock: 60,
      },
      {
        name: 'Leather Weekend Bag',
        description:
          'Supple full-grain leather that will develop a beautiful patina over time.',
        price: 18500,
        category: 'Accessories',
        image:
          'https://images.unsplash.com/photo-1547949003-9792a18a2601?q=80&w=1000&auto=format&fit=crop',
        rating: 4.8,
        stock: 30,
      },
      {
        name: 'Mechanical Gaming Keyboard',
        description:
          'Custom-built with lubed Gatereon switches and double-shot PBT keycaps.',
        price: 12500,
        category: 'Electronics',
        image:
          'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?q=80&w=1000&auto=format&fit=crop',
        rating: 4.7,
        stock: 40,
      },
      {
        name: 'Linen Button-Down Shirt',
        description:
          'Breathable European linen. Perfect for summer afternoons and beachside evenings.',
        price: 3499,
        category: 'Clothes',
        image:
          'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1000&auto=format&fit=crop',
        rating: 4.5,
        stock: 100,
      },
      {
        name: 'Organic Cotton Hoodie',
        description:
          'Heavyweight loopback Terry for ultimate comfort and structural durability.',
        price: 5999,
        category: 'Clothes',
        image:
          'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1000&auto=format&fit=crop',
        rating: 4.6,
        stock: 80,
      },
      {
        name: 'Dyson Airwrap Styler',
        description:
          'Multiple attachments to curl, wave, smooth, and dry hair without extreme heat.',
        price: 49900,
        category: 'Electronics',
        image:
          'https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=1000&auto=format&fit=crop',
        rating: 4.8,
        stock: 12,
      },
      {
        name: 'Chelsea Leather Boots',
        description:
          'Classic Chelsea boot style handcrafted from premium Italian leather.',
        price: 18000,
        category: 'Shoes',
        image:
          'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1000&auto=format&fit=crop',
        rating: 4.7,
        stock: 25,
      },
      {
        name: 'Smart Home Security Camera',
        description:
          '1080p HD indoor, plug-in security camera with motion detection and two-way audio.',
        price: 3500,
        category: 'Electronics',
        image:
          'https://images.unsplash.com/photo-1557342084-3c81eebf09c1?q=80&w=1000&auto=format&fit=crop',
        rating: 4.5,
        stock: 85,
      },
      {
        name: 'Vintage Wash Denim Jacket',
        description:
          'A timeless staple. Heavyweight denim with a relaxed fit and lived-in wash.',
        price: 6500,
        category: 'Clothes',
        image:
          'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?q=80&w=1000&auto=format&fit=crop',
        rating: 4.6,
        stock: 45,
      },
      {
        name: 'Aesthetic Marble Coasters',
        description:
          'Set of 4 genuine white marble coasters with gold brass inlay edges.',
        price: 1800,
        category: 'Decor',
        image:
          'https://images.unsplash.com/photo-1614539223602-0424b9c29ed6?q=80&w=1000&auto=format&fit=crop',
        rating: 4.9,
        stock: 120,
      },
      {
        name: 'Noise Cancelling Earbuds',
        description:
          'True wireless earbuds with active noise cancelling and 24-hour battery life.',
        price: 24900,
        category: 'Accessories',
        image:
          'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=1000&auto=format&fit=crop',
        rating: 4.7,
        stock: 65,
      },
      {
        name: 'Mid-Century Dining Chair',
        description:
          'Elegant walnut dining chair with a curved backrest and upholstered seat.',
        price: 18500,
        category: 'Furniture',
        image:
          'https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=1000&auto=format&fit=crop',
        rating: 4.8,
        stock: 18,
      },
      {
        name: 'Organic Ceramonial Matcha',
        description:
          'Ceremonial grade matcha powder sourced directly from Uji, Japan.',
        price: 2200,
        category: 'Accessories',
        image:
          'https://images.unsplash.com/photo-1582793988951-9aed5509eb97?q=80&w=1000&auto=format&fit=crop',
        rating: 4.9,
        stock: 200,
      },
      {
        name: 'MacBook Pro M3 Max',
        description:
          'Mind-blowing performance with the M3 Max chip. 16-inch Liquid Retina XDR display, up to 128GB unified memory.',
        price: 319900,
        category: 'Laptops',
        image:
          'https://images.unsplash.com/photo-1517336714460-4c504a076a8d?q=80&w=1000&auto=format&fit=crop',
        rating: 4.9,
        stock: 15,
      },
      {
        name: 'HP Spectre x360 14',
        description:
          'Luxury 2-in-1 convertible laptop. 3K OLED touch display, Intel Core Ultra 7 processor.',
        price: 165000,
        category: 'Laptops',
        image:
          'https://images.unsplash.com/photo-1593642702749-b7d2a804fbcf?q=80&w=1000&auto=format&fit=crop',
        rating: 4.8,
        stock: 22,
      },
      {
        name: 'Razer Blade 16',
        description:
          "The ultimate gaming laptop. NVIDIA RTX 4090, World's first dual-mode mini-LED display.",
        price: 350000,
        category: 'Laptops',
        image:
          'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?q=80&w=1000&auto=format&fit=crop',
        rating: 4.9,
        stock: 10,
      },
      {
        name: 'Lenovo ThinkPad X1 Carbon Gen 12',
        description:
          'Premium ultralight business laptop. Carbon fiber chassis, legendary keyboard, Intel Core Ultra.',
        price: 185000,
        category: 'Laptops',
        image:
          'https://images.unsplash.com/photo-1611078489935-0cb964de46d6?q=80&w=1000&auto=format&fit=crop',
        rating: 4.7,
        stock: 35,
      },
    ];

    return this.productModel.insertMany(dummyProducts);
  }
}
