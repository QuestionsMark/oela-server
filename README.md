<div id="top"></div>

[![Contributors][contributors-shield]][contributors-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

<br />
<div align="center">
  <a href="https://oela.pl">
    <img src="./readme/logo.png" alt="oela.pl logo" width="200" height="136">
  </a>

<h1 align="center">oela.pl - API</h1>
  <p align="center">
    Rest Api dla platformy oela.pl.
    <br />
    <br />
  </p>
</div>

[![Typescript][typescript]][typescript-url]
[![Nest][nest]][nest-url]
[![MySQL][mysql]][mysql-url]
[![JsonWebToken][jsonwebtoken]][jsonwebtoken-url]

<details>
  <summary>Spis treści</summary>
  <ol>
    <li>
      <a href="#o-projekcie">O projekcie</a>
    </li>
    <li>
      <a href="#jak-zacząć">Jak zacząć</a>
    </li>
  </ol>
</details>

## O projekcie

RESTFul API dla platformy oela.pl oparte na NestJS i MySQL.

## Jak zacząć

1. Sklonuj repozytorium
   ```sh
   git clone https://github.com/QuestionsMark/oela-server.git
   ```
2. Przejdź do katalogu projektu
   ```sh
   cd oela-server
   ```
3. Zainstaluj wszystkie zależności
   ```sh
   npm install
   ```
4. Stwórz plik konfiguracyjny `src/config/config.ts` na podstawie pliku `src/config/config.example.ts`

```js
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ValidationPipe } from '@nestjs/common';
import { CookieOptions } from 'express';
export const CORS_CONFIG: CorsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};
export const VALIDATION_PIPE_CONFIG = new ValidationPipe({
  disableErrorMessages: true,
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
  transformOptions: {
    enableImplicitConversion: true,
  },
});
export const SECRET_KEY = `fashdbfuahdbfuhasdbfiad aishdbf habdifbasih dbfiahsdfisjn iajdf`; // losowy ciąg znaków
export const COOKIES_CONFIG: CookieOptions = {
  secure: false,
  domain: 'localhost',
  httpOnly: true,
};
```

5. Stwórz plik konfiguracyjny `src/config/db.config.ts` na podstawie pliku `src/config/db.config.example.ts`

```js
import { DataSource } from 'typeorm';
export const DB_CONNECTION = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: '<DB_USER>',
  password: '<DB_PASSWORD>',
  database: '<DB_NAME>',
  entities: ['dist/**/**.entity{.ts,.js}'],
  bigNumberStrings: false,
  logging: true,
  synchronize: false,
});
```

<p align="right">(<a href="#top">back to top</a>)</p>

[contributors-shield]: https://img.shields.io/github/contributors/QuestionsMark/oela-server.svg?style=for-the-badge
[contributors-url]: https://github.com/QuestionsMark/oela-server/graphs/contributors
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/s%C5%82awomir-dziurman-75464b205/
[typescript]: https://img.shields.io/badge/typescript-20232A?style=for-the-badge&logo=typescript&logoColor=3178c6
[typescript-url]: https://www.typescriptlang.org/
[nest]: https://img.shields.io/badge/nestjs-E0234E?style=for-the-badge&logo=nestjs&logoColor=white
[nest-url]: https://nestjs.com/
[mysql]: https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white
[mysql-url]: https://www.mysql.com/
[jsonwebtoken]: https://img.shields.io/badge/json%20web%20tokens-323330?style=for-the-badge&logo=json-web-tokens&logoColor=pink
[jsonwebtoken-url]: https://www.npmjs.com/package/jsonwebtoken
