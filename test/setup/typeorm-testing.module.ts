import { TypeOrmModule } from '@nestjs/typeorm';
import ormConfig from './orm-configuration';

export const TypeormTestingModule = () => [TypeOrmModule.forRoot(ormConfig)];
