import { Controller, Get, Res, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import { readFileSync } from 'fs';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/list')
  getListForUser(@Res() resp: Response): any {
    const mockData = readFileSync('./data/results.json');
    resp.status(HttpStatus.OK).send(mockData);
  }
}
