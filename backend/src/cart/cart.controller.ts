import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { IsInt, IsString, Min } from 'class-validator';

class AddToCartDto {
  @IsString()
  productId: string;

  @IsString()
  size: string;

  @IsInt()
  @Min(1)
  quantity: number;
}

class UpdateCartDto {
  @IsInt()
  @Min(0)
  quantity: number;
}

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private cartService: CartService) {}

  @Get()
  getCart(@Request() req: { user: { id: string } }) {
    return this.cartService.getCart(req.user.id);
  }

  @Post('items')
  addItem(
    @Request() req: { user: { id: string } },
    @Body() dto: AddToCartDto,
  ) {
    return this.cartService.addItem(
      req.user.id,
      dto.productId,
      dto.size,
      dto.quantity,
    );
  }

  @Patch('items/:id')
  updateItem(
    @Request() req: { user: { id: string } },
    @Param('id') id: string,
    @Body() dto: UpdateCartDto,
  ) {
    return this.cartService.updateItem(req.user.id, id, dto.quantity);
  }

  @Delete('items/:id')
  removeItem(
    @Request() req: { user: { id: string } },
    @Param('id') id: string,
  ) {
    return this.cartService.removeItem(req.user.id, id);
  }

  @Delete()
  clearCart(@Request() req: { user: { id: string } }) {
    return this.cartService.clearCart(req.user.id);
  }
}
