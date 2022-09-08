import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { CollectionModule } from './collection/collection.module';
import { ProductTypeModule } from './product-type/product-type.module';
import { CoverModule } from './cover/cover.module';
import { HashtagModule } from './hashtag/hashtag.module';
import { NewsModule } from './news/news.module';
import { FileModule } from './file/file.module';
import { DB_CONNECTION } from './config/db.config';

@Module({
  imports: [
    TypeOrmModule.forRoot(DB_CONNECTION.options),
    UserModule,
    ProductModule,
    CollectionModule,
    ProductTypeModule,
    CoverModule,
    HashtagModule,
    NewsModule,
    FileModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
