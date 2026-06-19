import { Controller, Get, Post, Patch, Body, Param, UseGuards, Request } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { IsOptional, IsString } from 'class-validator';

class CreateOrderDto {
  @IsString()
  shippingName: string;

  @IsString()
  shippingPhone: string;

  @IsString()
  shippingAddress: string;

  @IsString()
  shippingCity: string;

  @IsOptional()
  @IsString()
  note?: string;
}

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post()
  create(
    @Request() req: { user: { id: string } },
    @Body() dto: CreateOrderDto,
  ) {
    return this.ordersService.create(req.user.id, dto);
  }

  @Get()
  findByUser(@Request() req: { user: { id: string } }) {
    return this.ordersService.findByUser(req.user.id);
  }

  @Get(':id')
  findById(
    @Request() req: { user: { id: string } },
    @Param('id') id: string,
  ) {
    return this.ordersService.findById(req.user.id, id);
  }
}
