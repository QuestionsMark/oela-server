import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { CollectionModule } from './collection/collection.module';
import { ProductTypeModule } from './product-type/product-type.module';
import { CoverModule } from './cover/cover.module';
import { HashtagModule } from './hashtag/hashtag.module';
import { NewsModule } from './news/news.module';

@Module({
  imports: [UserModule, ProductModule, CollectionModule, ProductTypeModule, CoverModule, HashtagModule, NewsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
